import firebase from "firebase/app";
import "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { gapi } from "gapi-script";

// FirebaseCalendarAPI
export class FCAPI {
  private static isGoogleAuthInitialized = false;

  // 初始化 Google API 客戶端
  static initializeGoogleAuth() {
    if (this.isGoogleAuthInitialized) return;

    // 加載 Google API 客戶端
    gapi.load("client:auth2", async () => {
      try {
        await gapi.auth2.init({
          client_id: "YOUR_GOOGLE_CLIENT_ID", // 使用你的 Google Client ID
        });
        this.isGoogleAuthInitialized = true;
        console.log("Google API 初始化成功");
      } catch (error) {
        console.error("Google API 初始化失敗:", error);
      }
    });
  }

  // 處理 Google 登入
  static async signInWithGoogle(): Promise<firebase.User | null> {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope("https://www.googleapis.com/auth/calendar"); // 請求 Google Calendar 權限

      const result = await signInWithPopup(firebase.auth(), provider);
      const currentUser = result.user;

      console.log("Google 登入成功:", currentUser?.email);

      // 確保使用者有 Google Calendar 的權限
      const token = result.credential?.accessToken;
      console.log("Google Calendar API access token:", token);

      return currentUser;
    } catch (error) {
      console.error("Google 登入失敗:", error);
      throw new Error("Google 登入失敗");
    }
  }

  // 確保使用者登入並有 Google Calendar 權限
  static async ensureGoogleCalendarAuth(): Promise<void> {
    try {
      const currentUser = firebase.auth().currentUser;
      if (!currentUser) {
        throw new Error("尚未登入，請先登入");
      }

      // 確認是否有 Google Calendar 權限
      const googleAuth = gapi.auth2.getAuthInstance();
      const isAuthorized = googleAuth?.isSignedIn.get();
      if (!isAuthorized) {
        throw new Error("需要 Google Calendar 權限");
      }

      console.log("Google Calendar 權限已確認");
    } catch (error) {
      console.error("Google Calendar 權限確認失敗:", error);
      throw error;
    }
  }

  // 建立 Google Calendar 事件
  static async createCalendarEvent(summary: string, description: string, startDate: string, endDate: string): Promise<void> {
    try {
      await this.ensureGoogleCalendarAuth();

      // 初始化 Google Calendar API 客戶端
      await gapi.client.load("calendar", "v3");

      // 建立事件的資料
      const event = {
        summary,
        description,
        start: {
          dateTime: startDate,
          timeZone: "Asia/Taipei",
        },
        end: {
          dateTime: endDate,
          timeZone: "Asia/Taipei",
        },
      };

      // 發送請求建立事件
      const response = await gapi.client.calendar.events.insert({
        calendarId: "primary", // 使用主要日曆
        resource: event,
      });

      console.log("Google Calendar 事件建立成功:", response);
    } catch (error) {
      console.error("建立 Google Calendar 事件失敗:", error);
      throw new Error("建立 Google Calendar 事件失敗");
    }
  }
}
