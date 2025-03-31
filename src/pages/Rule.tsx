import React, { useEffect, useState } from "react";
import { getRegulationsData } from "../firebase/fapi"; // ← 你設定的 firebase 檔案
import "../styles/Rule.css";

const Rule = () => {
  const [rules, setRules] = useState<string[]>([]);

  const fetchRules = async () => {
    try {
      const rules: string[] = await getRegulationsData();
      setRules(rules);
    } catch (error) {
      console.error("載入條例失敗:", error);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  return (
    <div className="w-full">
      <p className="topic text-2xl mb-4">空間借用條例</p>
      {/* <div className="rule pb-[5%]">
        {rules.map((text, idx) => (<div key={idx} className="content">
            {text}
          </div>))}
      </div> */}
      <div className="rule pb-[5%]">
        <div className="content">1. 小導外層玻璃門自由開關、內層防火門須保持常開， 違者立即取消借用及往後借用資格</div>
        <div className="content">2. 若要取消預約請大家在收到的mail點選「取消預約」。</div>
        <div className="content">3. 同一天借用多個不相鄰時段請填寫多份表單。</div>
        <div className="content">4. 同一小組的人員一週最多借用三次公共空間，每次至多四小時，違反規定經發現，仁齋齋團隊有權刪除。</div>
        <div className="content">5. 借用的預定時間不得提前超過30天</div>
        <div className="content">6. 為保障大家使用空間的權益，超過預約三十分鐘內未使用，則自動取消預約，並開放其他齋民直接入內使用空間。</div>
        <div className="content">7. 如遭遇任何爭議或對規定不清楚等問題，請聯絡現任齋長，齋長有調解與最終裁決權。 </div>
        <div className="content">8. 仁齋齋團隊保有對本條例的修改與解釋權。 </div>
        <div className="content">9. 當您借用或使用任何仁齋公共空間視為您已閱讀、了解並同意本條例的所有內容。</div>
      </div>
    </div>
  );
};

export default Rule;
