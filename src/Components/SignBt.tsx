import React, { useState } from "react";
import "../styles/SignBt.css";

const SignBt: React.FC = () => {
  // 使用 useState 來管理按鈕的狀態，預設為登出
  const [isLogin, setIsLogin] = useState(false);

  // 點擊按鈕時切換狀態
  const handleToggle = () => {
    setIsLogin(!isLogin);
    alert(window.getComputedStyle(document.body).fontFamily);
  };

  return (
    <div onClick={handleToggle} className="signBt">
      {/* 動態根據 isLogin 狀態變換按鈕的外觀 */}
      <div className={`bt signBt-button ${isLogin ? "login" : ""}`}></div>
      <div className={`signBt-text word ${isLogin ? "login" : ""}`}>{isLogin ? "登入" : "登出"}</div>
    </div>
  );
};

export default SignBt;
