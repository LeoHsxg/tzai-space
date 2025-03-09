/**
 * index.js
 * 這個檔案是 Firebase Functions 的入口。
 * 主要功能：
 * 1. 讀取 service_account.json (Service Account 憑證)
 * 2. 透過 JWT 建立 Google Calendar API 的授權。
 * 3. 提供一個 HTTP Cloud Function (addEventToCalendar)，對外接受 POST 請求。
 * 4. 在請求中包含要預訂或取消的資訊，就會去新增/刪除 Google Calendar 事件。
 */
const { google } = require("googleapis");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
// 讀取 Service Account JSON 檔案 (裡面需要包含 client_email / private_key 等欄位)
const serviceAccount = require("./service_account.json");
const calendar = google.calendar("v3");
const cors = require("cors")({ origin: "*" });
admin.initializeApp();

const TIME_ZONE = "Asia/Taipei";

/**
 * 這個函式負責回傳一個 JWT 物件，用來透過 Service Account 連線到 Google API
 * @returns {google.auth.JWT}
 */
function getServiceAccountAuth() {
  return new google.auth.JWT(
    serviceAccount.client_email, // 來自 service_account.json
    null, // keyFile 或 key 的路徑, 這裡用 null 因為我們直接用 private_key
    serviceAccount.private_key, // 私鑰，用於 JWT 簽署
    ["https://www.googleapis.com/auth/calendar"] // 我們要使用 calendar 的 scope
  );
}

/**
 * addEvent: 處理核心的「新增事件(預訂)」或「刪除事件(取消)」邏輯
 * 使用 async/await，不用自己 new Promise。
 *
 * @param {Object} event - 從前端傳來的資料 (例如 event.checkinTime, event.checkoutTime...)
 * @param {google.auth.JWT} auth - 透過 getServiceAccountAuth() 取得的 JWT，用於呼叫 Calendar API
 * @returns {Promise<Object>} - 回傳一個物件，內含 message 欄位 (例如 {message: "Successfully booked"})
 */
async function addEvent(event, auth) {
  // 先看一下 event 內容，方便除錯
  console.log("Received event data:", event);

  // 基本資料檢查：電話號碼/人數/姓名/描述的長度或格式
  if (/^\d+$/.exec(event.phone) == null) {
    throw new Error("Phone number must be an integer!");
  }
  if (event.phone.length != 10) {
    throw new Error("Phone length doesn's match!");
  }
  if (/^\d+$/.exec(event.crowdSize) == null) {
    throw new Error("為什麼人數會有小數啦...");
  }
  if (parseInt(event.crowdSize) <= 0) {
    throw new Error("人數請至少為 1, 老兄你是幽靈嗎?");
  }
  if (event.name.includes("\n")) {
    throw new Error("Name cannot contain newline!");
  }
  if (event.name.length > 30) {
    throw new Error("名字太長啦, Ovuvuevuevue enyetuenwuevue ugbemugbem  osas");
  }
  if (event.eventDescription.length > 100) {
    throw new Error("感謝你描述那麼詳細，但是太詳細了");
  }
  // room 只允許這四個值
  if (!["書房", "橘廳", "會議室", "小導師室", "貢丸室"].includes(event.room)) {
    throw new Error("Please select the room to book :)");
  }

  // 轉成 Date 物件後再 toISOString() (帶 +08:00 主要是指定 Asia/Taipei 區時)
  const st = new Date(event.checkinTime);
  const ed = new Date(event.checkoutTime);
  const today = new Date();

  // 限制只能預訂未來 31 天內的時間
  const diffInDays = (st - today) / (1000 * 3600 * 24);
  if (diffInDays > 31) {
    throw new Error("Not allowed to book further than one month to the future.");
  }
  // 檢查區間是否正確
  if (st >= ed) {
    throw new Error("結束時間請大於開始時間, 對時間逆行者致上敬意");
  }
  const diffInHours = (ed - st) / (1000 * 3600);
  if (diffInHours > 4) {
    throw new Error("一次最多只能借用四小時！");
  }

  // 組合要寫進 Google Calendar "description" 的內容
  const desc = [
    `Booked by: ${event.name}`,
    `Contact: ${event.email}`,
    `Phone: ${event.phone}`,
    `Crowd Size: ${event.crowdSize}`,
    `Event Description: ${event.eventDescription}`,
    `Booked at: ${new Date().toISOString()}`, // 紀錄系統現在操作時間
  ].join("\n");

  // 為了查詢是否衝突，我們將要查詢 st 前 2 天, ed 後 2 天 的事件
  const st1 = new Date(st);
  st1.setDate(st1.getDate() - 2);
  const ed1 = new Date(ed);
  ed1.setDate(ed1.getDate() + 2);

  // 呼叫 calendar.events.list 查詢，看看在 [st1, ed1] 之間有什麼事件
  const eventListResp = await calendar.events.list({
    auth,
    calendarId: "oa27fmn21hoqd0hvdpg1bqlv1k@group.calendar.google.com", // 這個換成你實際的 Calendar ID
    timeMin: st1.toISOString(),
    timeMax: ed1.toISOString(),
    maxResults: 2000,
  });
  const events = eventListResp.data.items || [];

  // 交集判斷: 時段 [a, b) 和 [c, d) 是否有重疊
  function intersect(a, b, c, d) {
    return Math.max(+a, +c) < Math.min(+b, +d);
  }

  // 逐一檢查已經存在的事件
  for (const _event of events) {
    // 解析 _event 的開始、結束和摘要(房間名稱)
    const s = new Date(_event.start.dateTime);
    const e = new Date(_event.end.dateTime);
    const r = _event.summary; // e.g. "書房" / "橘廳" / ...

    // 如果房間名字跟我們允許的四種以外，顯示錯誤(理論上應該不會發生)
    if (!["書房", "橘廳", "會議室", "小導師室", "貢丸室"].includes(r)) {
      throw new Error("Something wrong: " + r + ", please notify the admin");
    }

    // 若房間一樣，且時間區間相交，就拋錯
    if (r === event.room && intersect(st, ed, s, e)) {
      throw new Error("Conflicts with: " + _event.htmlLink);
    }
  }

  // 如果走到這裡，表示要預訂，且沒有衝突
  // 直接呼叫 calendar.events.insert 新增事件
  await calendar.events.insert({
    auth,
    calendarId: "oa27fmn21hoqd0hvdpg1bqlv1k@group.calendar.google.com", // 這個請換成你實際的 Calendar ID
    resource: {
      summary: event.room, // 顯示哪個房間
      description: desc, // 寫入我們組合好的描述
      // colorId: 1, 也可以指定 colorId (1~11)
      colorId: ["書房", "橘廳", "會議室", "小導師室", "貢丸室"].findIndex(s => s === event.room) + 1,
      start: {
        dateTime: st,
        timeZone: TIME_ZONE,
      },
      end: {
        dateTime: ed,
        timeZone: TIME_ZONE,
      },
    },
  });

  // 新增成功後回傳一個訊息 => 沒有用到
  return {
    message:
      "預約成功\n" +
      "Please check the calendar since this system is still in beta phase " +
      "and might make some mistakes (in case of unexpected conflict, " +
      "whichever with an earlier create time is effective).",
  };
}

/**
 * Firebase Cloud Function: addEventToCalendar
 *
 * 當前端對這個 function 發送 HTTP POST 請求，並在 body 帶上 {event} 的資料時，
 * 我們就會呼叫 addEvent(...) 來新增或刪除 Google Calendar 上的事件，
 * 最後把結果 (成功或失敗) 用 response 回給前端。
 */
// https://ithelp.ithome.com.tw/articles/10267360
exports.addEventToCalendar = functions.https.onRequest(async (request, response) => {
  // 如果你需要做 CORS，可以考慮設定這個回應頭
  // response.set("Access-Control-Allow-Origin", "https://tzai-space.web.app");
  // response.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
  // response.set("Access-Control-Allow-Headers", "Origin, Accept, Content-Type, X-Requested-With");
  cors(request, response, async err => {
    if (err) {
      // Denied by CORS/error with CORS configuration
      console.error("CORS blocked request -> ", err);
      response.status(403).send("Forbidden by CORS");
      return;
    }

    // 如果是預檢請求，直接回應 200
    if (request.method === "OPTIONS") {
      response.status(200).send("");
      return;
    }

    // 取得資料, 建立 JWT，用 Service Account 授權
    const eventData = request.body;
    const auth = getServiceAccountAuth();

    try {
      // 嘗試執行主邏輯
      const result = await addEvent(eventData, auth);
      response.status(200).send(result);
    } catch (err) {
      response.status(500).send({ status: 500, message: err.message });
      console.error(err.message);
    }
  });
});

