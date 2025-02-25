// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";
import { gapi } from "gapi-script";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDGKPnWpC9N15OFlXnRErz7e6URy7vtNi4",
  authDomain: "tzai-space.firebaseapp.com",
  projectId: "tzai-space",
  storageBucket: "tzai-space.appspot.com",
  messagingSenderId: "154014267141",
  appId: "1:154014267141:web:90d61c6b08f0d957e6696c",
  measurementId: "G-5P7DHECJHN",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// FirebaseCalendarAPI
export class FCAPI {
  private static isGoogleAuthInitialized = false;

  // calendarId: "oa27fmn21hoqd0hvdpg1bqlv1k@group.calendar.google.com"

  // 初始化 Google API 客戶端
  static initializeGoogleAuth() {
    if (this.isGoogleAuthInitialized) return;

    // 加載 Google API 客戶端
    gapi.load("client:auth2", async () => {
      try {
        await gapi.auth2.init({
          client_id: "154014267141-ii9vds533i6lg0c8du8b01q4d3vqettp.apps.googleusercontent.com",
        });
        this.isGoogleAuthInitialized = true;
        console.log("Google API 初始化成功");
      } catch (error) {
        console.error("Google API 初始化失敗:", error);
      }
    });
  }

  // 處理 Google 登入
  static async signInWithGoogle(): Promise<User | null> {
    try {
      const auth = getAuth(); // 獲取 Firebase Auth 實例
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const currentUser = result.user;

      console.log("Google 登入成功:", currentUser?.email);

      return currentUser;
    } catch (error) {
      console.error("Google 登入失敗:", error);
      throw new Error("Google 登入失敗");
    }
  }

  // 建立 Google Calendar 事件
  static async createCalendarEvent(data: {
    name: string;
    phone: string;
    crowdSize: string;
    room: string;
    checkinTime: string;
    checkoutTime: string;
    eventDescription: string;
  }): Promise<void> {
    try {
      // 初始化 Google Calendar API 客戶端
      await gapi.client.load("calendar", "v3");

      // 大概是這裡要做檢測合法性

      // 建立事件的資料
      const event = {
        name: data.name,
        phone: data.phone,
        crowdSize: data.crowdSize,
        room: data.room,
        start: {
          dateTime: data.checkinTime,
          timeZone: "Asia/Taipei",
        },
        end: {
          dateTime: data.checkoutTime,
          timeZone: "Asia/Taipei",
        },
        description: data.eventDescription,
      };

      // 發送請求建立事件
      const response = await gapi.client.calendar.events.insert({
        auth: auth,
        calendarId: "oa27fmn21hoqd0hvdpg1bqlv1k@group.calendar.google.com",
        resource: event,
      });

      console.log("Google Calendar 事件建立成功:", response);
    } catch (error) {
      console.error("建立 Google Calendar 事件失敗:", error);
      throw new Error("建立 Google Calendar 事件失敗");
    }
  }
}

// // 確認是否有 Google Calendar 權限
// const googleAuth = gapi.auth2.getAuthInstance();
// const isAuthorized = googleAuth?.isSignedIn.get();
// 確保使用者登入並有 Google Calendar 權限
// 但這個網站需要編輯的是共用的日曆，因此不需要這個功能！
// 而且要求編輯個人日曆的權限是很高級的api
// 隨便亂調用會把你判定為危險網站www
