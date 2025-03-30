/**
 * index.js
 * 這個檔案是 Firebase Functions 的入口。
 */
// 引入使用的套件
const { google } = require("googleapis");
const calendar = google.calendar("v3");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// 打包的程式碼
const { addEvent } = require("./src/addEvent");

// 一些應該藏起來的酷東西
const API_KEY = "AIzaSyDGKPnWpC9N15OFlXnRErz7e6URy7vtNi4";
const CALENDAR_ID = "oa27fmn21hoqd0hvdpg1bqlv1k@group.calendar.google.com";

/**
 * Firebase Cloud Function: addEventToCalendar
 * 當前端對這個 function 發送 HTTP POST 請求，並在 body 帶上 {event} 的資料時，
 * 我們就會呼叫 addEvent, 使用 Service Account 來新增事件，
 */
exports.addEventToCalendar = functions.https.onRequest(async (request, response) => {
  // 取得資料, 建立 JWT，用 Service Account 授權
  const eventData = request.body;
  try {
    // 嘗試執行主邏輯
    const result = await addEvent(eventData);
    response.status(200).send(result);
  } catch (err) {
    response.status(500).send({ status: 500, message: err.message });
    console.error(err.message);
  }
});

/**
 * Firebase Cloud Function: getEventsForMonth
 * 當前端對這個 function 發送 GET 請求，並在 query string 中帶上 {year} 和 {month} 的參數時，
 * 我們會呼叫 Google Calendar API 來獲取該月的所有事件。
 */
exports.getEventsForMonth = functions.https.onRequest(async (request, response) => {
  // request.query：用於存放 URL 中的查詢參數，也就是 URL 中 ? 之後的部分。
  // 例如：?year=2024&month=3, request.query 就會是 { year: "2024", month: "3" }
  const { year, month } = request.query;

  if (!year || !month) {
    response.status(400).send("Year and month are required.");
    return;
  }

  // 計算該月的開始時間和結束時間
  // 傻逼 javascript 的 month 是從 0 開始，所以要 -1
  const startOfMonth = new Date(year, month - 1, 1);
  // 後續被轉換為 ISO 格式，時間下限會是這一天的零點，因此需要加 1 天
  const endOfMonth = new Date(year, month, 1);

  // 轉換為 ISO 格式
  const timeMin = startOfMonth.toISOString();
  const timeMax = endOfMonth.toISOString();

  try {
    // 使用 calendar.events.list 來讀取該月的事件 Event List Response"
    const eventListResp = await calendar.events.list({
      key: API_KEY, // 使用 API 金鑰
      calendarId: CALENDAR_ID, // 使用你的 Calendar ID
      timeMin: timeMin,
      timeMax: timeMax,
      maxResults: 2000,
      singleEvents: true, // 確保不會取得重複的事件
      orderBy: "startTime", // 按時間排序
      fields: "items(start,end,summary,description,extendedProperties(shared))",
    });

    // 取得事件資料
    const events = eventListResp.data.items || [];
    console.log("Fetched events:", events);

    // 如果有事件，回傳事件資料；如果沒有，回傳空訊息
    if (events.length > 0) {
      response.status(200).json({ events });
    } else {
      response.status(200).send({ message: "No events found for this month." });
    }
  } catch (err) {
    response.status(500).send({ status: 500, message: err.message });
    console.error("Error fetching events:", err);
  }
});

// 如果你需要做 CORS，可以考慮設定這個回應頭
// response.set("Access-Control-Allow-Origin", "https://tzai-space.web.app");
// response.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
// response.set("Access-Control-Allow-Headers", "Origin, Accept, Content-Type, X-Requested-With");
// 或是使用 const cors = require("cors")({ origin: "*" });

