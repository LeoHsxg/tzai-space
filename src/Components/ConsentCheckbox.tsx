import React, { useState } from "react";
import "../styles/ConsentCheckbox.css";

const ConsentCheckbox: React.FC = () => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className="flex items-center gap-0.5">
      <input type="checkbox" id="consent" checked={isChecked} onChange={handleCheckboxChange} className="hidden" />
      <label htmlFor="consent" className={`checkbox-label ${isChecked ? "checked" : ""}`}>
        {isChecked && (
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </label>
      {/* <div className="small-circle" /> */}
      <span className="text-black/60 text-xs font-normal font-['Inter']">
        本人已詳閱、瞭解並願意遵守
        <span className="underline">空間借用條例</span>
      </span>
    </div>
  );
};

export default ConsentCheckbox;
