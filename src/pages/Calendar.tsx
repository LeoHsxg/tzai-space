import React, { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
// import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DateCalendar } from "@mui/x-date-pickers";
import { CircularProgress } from "@mui/material";
import Reserve from "../Components/Reserve";
import MyDialog from "../Components/MyDialog";
import { Event } from "../types/event";
import "../styles/Calendar.css";

const Calendar: React.FC = () => {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs());
  const [events, setEvents] = useState<Event[]>([]); // 儲存事件資料
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]); // 當天的事件
  const [filteredAmount, setFilteredAmount] = useState<number>(0);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null); // 選中的事件
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false); // 新增 loading 狀態

  const fetchEvents = async (year: number, month: number) => {
    setLoading(true);
    try {
      const response = await fetch(`https://tzai-space.web.app/api/get?year=${year}&month=${month}`);
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        console.log("解析後的事件:", data.events);
        setEvents(data.events || []);
      } catch (error) {
        console.error("JSON 解析失敗，回應內容:", text, "\n錯誤訊息:", error);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClickOpen = (event: Event) => {
    setSelectedEvent(event);
    // console.log("selectedEvent:", selectedEvent);
    setOpen(true);
  };

  const handleClose = () => {
    // setSelectedEvent(null);
    setOpen(false);
  };

  React.useEffect(() => {
    const today = dayjs();
    fetchEvents(today.year(), today.month() + 1);
  }, []);

  const handleMonthChange = (newMonth: Dayjs) => {
    console.log("Month changed to:", newMonth);
    fetchEvents(newMonth.year(), newMonth.month() + 1);
  };

  // 當 value 改變時，篩選當天的事件
  React.useEffect(() => {
    if (!value) return;
    // 格式化為 YYYY-MM-DD, 撇除掉幾點幾分才有辦法比較
    const selectedDate = value.format("YYYY-MM-DD");
    const dailyEvents = events.filter(event => {
      const sd = dayjs(event.start.dateTime).format("YYYY-MM-DD");
      const ed = dayjs(event.end.dateTime).format("YYYY-MM-DD");
      return sd <= selectedDate && selectedDate <= ed;
    });
    setFilteredEvents(dailyEvents);
    setFilteredAmount(dailyEvents.length);
  }, [value, events]); // 當 `value` 或 `events` 改變時重新篩選

  return (
    <div className="w-full pb-16">
      <div className="calendarDiv w-full py-0 px-[7.5%]">
        <DateCalendar
          sx={{ width: "100%" }}
          className="w-full m-0 bg-white rounded-xl"
          value={value}
          onChange={newValue => setValue(newValue)}
          onMonthChange={handleMonthChange}
        />
      </div>
      {/* <DateTimePicker defaultValue={dayjs("2024-08-15T21:00")} /> */}
      <div className="test w-full py-4 px-[5%] flex-col justify-center items-center inline-flex">
        <div className="self-stretch px-2.5 justify-between items-center inline-flex">
          <div className="font">今日預約共 {filteredAmount} 筆</div>
          <div className="font underline">查看詳情</div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center w-full h-full">
            <CircularProgress />
          </div>
        ) : (
          <div className="self-stretch py-2.5 flex-col justify-start items-center gap-3.5 flex">
            {filteredEvents.map((event, index) => (
              <Reserve onClick={() => handleClickOpen(event)} key={index} event={event} />
            ))}
            <MyDialog open={open} onClose={handleClose} event={selectedEvent || ({} as Event)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
