import React from "react";

const Reserve = () => {
  return (
    <div className="w-full h-12 px-2.5 justify-start items-center gap-[15px] inline-flex">
      <div className="w-4 h-4 bg-[#ffd81e] rounded-full border-white" />
      <div className="w-full h-12 flex flex-row px-5 bg-[#f7f7f7] rounded-[10px] items-center">
        <div className="h-[18px] basis-3/5 text-black/80 text-sm font-normal font-['Inter']">21:00 → 23:00</div>
        <div className="basis-2/5 text-black/80 text-sm font-normal font-['Inter']">小導師室</div>
      </div>
    </div>
  );
};

export default Reserve;
