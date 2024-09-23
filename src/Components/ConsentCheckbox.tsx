import React, { useState } from "react";

const ConsentCheckbox: React.FC = () => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className="flex items-center gap-1">
      <input type="checkbox" id="consent" checked={isChecked} onChange={handleCheckboxChange} className="hidden" />
      <label
        htmlFor="consent"
        className={`w-6 h-6 border-2 rounded-full flex items-center justify-center cursor-pointer ${
          isChecked ? "bg-blue-500 border-blue-500" : "border-gray-300"
        }`}>
        {isChecked && (
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </label>
      <div className="w-3 h-3 rounded-full border-3 border-[#828282] bg-red-500" />
      <span className="text-black/60 text-xs font-normal font-['Inter']">
        本人已詳閱、瞭解並願意配合遵守<span className="underline">空間借用條例</span>
      </span>
    </div>
  );
};

export default ConsentCheckbox;
