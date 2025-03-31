import React from "react";
import { signInWithGoogle, auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import { useAuth } from "../hooks/useAuth"; // 假設這是你的 auth hook
import "../styles/SignBt.css";

const SignBt: React.FC = () => {
  const user = useAuth(); // 拿到目前登入的使用者

  const handleToggle = async () => {
    try {
      if (!user) {
        await signInWithGoogle();
        console.log(user, " 登入成功！");
      } else {
        await signOut(auth);
        console.log(user, " 登出成功！");
      }
    } catch (error) {
      console.error("登入或登出失敗：", error);
    }
  };

  return (
    <div onClick={handleToggle} className="signBt">
      {/* 動態根據 isLogin 狀態變換按鈕的外觀 */}
      <div className={`bt signBt-button ${user ? "" : "login"}`}></div>
      <div className={`signBt-text word ${user ? "" : "login"}`}>{user ? "登出" : "登入"}</div>
    </div>
  );
};

export default SignBt;
