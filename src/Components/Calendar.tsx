import React from "react";
import dayjs, { Dayjs } from "dayjs";
// import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DateCalendar } from "@mui/x-date-pickers";
import Reserve from "./Reserve";

const Calendar: React.FC = () => {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs("2024-08-15"));

  return (
    <div className="mt-8 w-full flex flex-col justify-center items-center">
      <DateCalendar className="bg-white rounded-lg " value={value} onChange={newValue => setValue(newValue)} />
      {/* <DateTimePicker defaultValue={dayjs("2024-08-15T21:00")} /> */}
      <div className="test w-10/12 flex-col justify-center items-center inline-flex">
        <div className="self-stretch px-2.5 justify-between items-center inline-flex">
          <div className="text-black/60 text-xs font-medium font-['Noto Sans TC']">今日預約共 8 筆</div>
          <div className="text-black/60 text-xs font-medium font-['Noto Sans TC']">歪比歪比巴卜</div>
        </div>
        <div className="self-stretch h-[365px] py-2.5 flex-col justify-start items-center gap-3.5 flex">
          <Reserve />
          <Reserve />
          <Reserve />
        </div>
      </div>
    </div>
  );
};

export default Calendar;
