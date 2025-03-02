/**
 * index.js
 * 這個檔案是 Firebase Functions 的入口。
 * 主要功能：
 * 1. 讀取 service_account.json (Service Account 憑證)
 * 2. 透過 JWT 建立 Google Calendar API 的授權。
 * 3. 提供一個 HTTP Cloud Function (addEventToCalendar)，對外接受 POST 請求。
 * 4. 在請求中包含要預訂或取消的資訊，就會去新增/刪除 Google Calendar 事件。
 */

// 引入 googleapis, firebase-functions, firebase-admin
const { google } = require("googleapis");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
// 讀取 Service Account JSON 檔案 (裡面需要包含 client_email / private_key 等欄位)
const serviceAccount = require("./service_account.json");
const calendar = google.calendar("v3");
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
 * @param {Object} event - 從前端傳來的資料 (例如 event.button, event.checkinTime, event.checkoutTime...)
 * @param {google.auth.JWT} auth - 透過 getServiceAccountAuth() 取得的 JWT，用於呼叫 Calendar API
 * @returns {Promise<Object>} - 回傳一個物件，內含 message 欄位 (例如 {message: "Successfully booked"})
 */
async function addEvent(event, auth) {
  /**
   * 1. 基本防呆：確認 button, 驗證 Firebase idToken, 各種欄位格式
   * 2. 若是 "book": 新增事件(判斷是否衝突)
   * 3. 若是 "cancel": 刪除事件(僅刪除符合範圍與個人資訊的事件)
   */

  // 如果 button 未指定或不在 "book"/"cancel"，就預設為 "book"
  if (!["book", "cancel"].includes(event.button)) {
    event.button = "book";
  }

  // 先看一下 event 內容，方便除錯
  console.log("Received event data:", event);

  // 驗證前端傳來的 idToken 是否有效，確保使用者已登入
  // (需要前端從 Firebase Auth 拿到 idToken)
  let uid;
  try {
    // verifyIdToken 如果失敗，會 throw error
    uid = (await admin.auth().verifyIdToken(event.idToken)).uid;
  } catch (err) {
    // 表示無法驗證 idToken，可能過期或不合法
    return { message: "Please login again :P" };
  }
  // 如果 token 驗證成功，但資料裡面的 uid 與 token 裡的 uid 不一致，也不行
  if (uid !== event.uid) {
    return { message: "Please login again :P" };
  }

  // 基本資料檢查：電話號碼/人數/姓名/描述的長度或格式
  if (/^\d+$/.exec(event.phone) == null) {
    throw new Error("Phone number must be an integer!");
  }
  if (event.phone.length > 20) {
    throw new Error("Phone length too long...");
  }
  if (/^\d+$/.exec(event.crowdSize) == null) {
    throw new Error("Crowd size must be integer!");
  }
  if (parseInt(event.crowdSize) > 100) {
    throw new Error("That's too many people...");
  }
  if (event.name.includes("\n")) {
    throw new Error("Name cannot contain newline!");
  }
  if (event.name.length > 30) {
    throw new Error("Name is too long!");
  }
  if (event.eventDescription.length > 500) {
    throw new Error("Description is too long!");
  }
  // room 只允許這四個值
  if (!["書房", "橘廳", "會議室", "小導師室"].includes(event.room)) {
    throw new Error("Please select the room to book :)");
  }

  // 時間格式的處理：如果長度只有 16，補上秒數 :00
  if (event.checkinTime.length === 16) event.checkinTime += ":00";
  if (event.checkoutTime.length === 16) event.checkoutTime += ":00";

  // 正規表達式檢查 "yyyy-mm-ddThh:mm:ss" 這種格式
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(event.checkinTime) || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(event.checkoutTime)) {
    throw new Error("Date format is irregular! Please contact the admin or try another device.");
  }

  // 轉成 Date 物件後再 toISOString() (帶 +08:00 主要是指定 Asia/Taipei 區時)
  const st = new Date(new Date(event.checkinTime + "+08:00").toISOString());
  const ed = new Date(new Date(event.checkoutTime + "+08:00").toISOString());
  const today = new Date();

  // 限制只能預訂未來 31 天內的時間
  const diffInDays = (st - today) / (1000 * 3600 * 24);
  if (diffInDays > 31) {
    throw new Error("Not allowed to book further than one month to the future.");
  }
  // 檢查時間是否無效
  if (st.toString() === "Invalid Date" || ed.toString() === "Invalid Date") {
    throw new Error("Please strictly follow the time format.");
  }
  // 檢查區間是否正確
  if (st >= ed) {
    throw new Error("Range of time is not positive.");
  }
  // 不能預訂過去時間
  if (ed <= today) {
    throw new Error("Cannot book for the past.");
  }
  // 最長一次只能訂 24 小時
  const diffInHours = (ed - st) / (1000 * 3600);
  if (diffInHours > 24) {
    throw new Error("Max interval allowed at once is 1 day.");
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
    if (!["書房", "橘廳", "會議室", "小導師室"].includes(r)) {
      throw new Error("Something wrong: " + r + ", please notify the admin");
    }

    // 讀取事件的 description，假設前兩行是:
    // Booked by: XXX
    // Contact: YYY
    const p = _event.description || "";
    const pLines = p.split("\n");
    // substring(11) 是因為 "Booked by: " 有 11 個字(含空格)
    const n = (pLines[0] || "admin").substring(11);
    const m = (pLines[1] || "admin").substring(9);

    // 如果要 "cancel"(取消)，符合區間且預訂者資料一致，就刪除該事件
    if (event.button === "cancel") {
      // 判斷是否在 [st, ed] 之內
      const inRange = +st <= +s && +e <= +ed;
      // 判斷是否為同一個人(透過 email / name)
      const samePerson = m === event.email && n === event.name;
      if (r === event.room && inRange && samePerson) {
        // 刪除此事件
        await calendar.events.delete({
          auth,
          calendarId: "oa27fmn21hoqd0hvdpg1bqlv1k@group.calendar.google.com",
          eventId: _event.id,
        });
        // 刪除成功後，回傳一個訊息
        return { message: "Successfully deleted 1 event." };
      }
    }
    // 如果是 "book"(預訂)，就要判斷是否衝突
    else if (event.button === "book") {
      // 若房間一樣，且時間區間相交，就拋錯
      if (r === event.room && intersect(st, ed, s, e)) {
        throw new Error("Conflicts with: " + _event.htmlLink);
      }
    }
  }

  // 如果是 "cancel"，卻沒有在上面找到任何要刪除的事件，就拋出錯誤
  if (event.button === "cancel") {
    throw new Error("Make sure the specified interval contains the interval you wish to delete.");
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
      colorId: ["書房", "橘廳", "會議室", "小導師室"].findIndex(s => s === event.room) + 1,
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

  // 新增成功後回傳一個訊息
  return {
    message:
      "Successfully booked.\n" +
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
 *
 * 使用 async/await + try/catch 簡化流程
 */
exports.addEventToCalendar = functions.https.onRequest(async (request, response) => {
  // 取得前端傳來的資料
  const eventData = request.body;
  // 建立 JWT，用 Service Account 授權
  const auth = getServiceAccountAuth();

  // 如果你需要做 CORS，可以考慮設定這個回應頭
  response.set("Access-Control-Allow-Origin", "*");

  try {
    // 嘗試執行主邏輯
    const result = await addEvent(eventData, auth);
    response.status(200).send(result);
  } catch (err) {
    response.status(500).send({ status: 500, message: err.message });
    console.error(err.message);
  }
});

