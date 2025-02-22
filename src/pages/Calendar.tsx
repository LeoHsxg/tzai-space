import React, { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
// import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DateCalendar } from "@mui/x-date-pickers";
import Reserve from "../Components/Reserve";
import MyDialog from "../Components/MyDialog";
import "../styles/Calendar.css";

const Calendar: React.FC = () => {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs("2024-08-15"));
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="pt-[90px] pb-[75px] w-full flex flex-col justify-center items-center">
      <div className="fuck">
        <DateCalendar className="cal bg-white rounded-lg" value={value} onChange={newValue => setValue(newValue)} />
      </div>
      {/* <DateTimePicker defaultValue={dayjs("2024-08-15T21:00")} /> */}
      <div className="test w-10/12 flex-col justify-center items-center inline-flex">
        <div className="self-stretch px-2.5 justify-between items-center inline-flex">
          <div className="font">今日預約共 8 筆</div>
          <div className="font">歪比歪比巴卜</div>
        </div>
        <div className="self-stretch h-[365px] py-2.5 flex-col justify-start items-center gap-3.5 flex">
          <Reserve onClick={handleClickOpen} />
          <Reserve onClick={handleClickOpen} />
          <Reserve onClick={handleClickOpen} />
          <Reserve onClick={handleClickOpen} />
          <Reserve onClick={handleClickOpen} />
          <Reserve onClick={handleClickOpen} />
          <MyDialog open={open} onClose={handleClose} title="預約詳情" content="3" />
        </div>
      </div>
    </div>
  );
};

export default Calendar;
