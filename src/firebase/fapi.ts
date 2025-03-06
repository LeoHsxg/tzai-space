// firebase.tsx / firebase.js (檔名隨你，React/TS 或 JS 都可以)
// 此檔為 Firebase App 初始化 & 提供 Google Sign-In 函式

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// 你的 Firebase 專案設定
const firebaseConfig = {
  apiKey: "AIzaSyDGKPnWpC9N15OFlXnRErz7e6URy7vtNi4",
  authDomain: "tzai-space.firebaseapp.com",
  projectId: "tzai-space",
  storageBucket: "tzai-space.appspot.com",
  messagingSenderId: "154014267141",
  appId: "1:154014267141:web:90d61c6b08f0d957e6696c",
  measurementId: "G-5P7DHECJHN",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// 這個函式用來做 Google 登入
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();

  // 觸發彈窗
  const result = await signInWithPopup(auth, provider);
  // 取得使用者及其資料
  const user = result.user;
  const email = user.email;
  const uid = user.uid;
  const displayName = user.displayName;

  console.log("使用者的 Email: ", email);
  console.log("使用者的 UID: ", uid);
  console.log("使用者的顯示名稱: ", displayName);

  return { email, uid, displayName };
}
