import React from "react";
import dayjs, { Dayjs } from "dayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { values } from "lodash";

const Calendar: React.FC = () => {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs("2024-08-15"));

  return (
    <div>
      <DateCalendar value={value} onChange={newValue => setValue(newValue)} />
      <DateTimePicker defaultValue={dayjs("2024-08-15T21:00")} />
    </div>
  );
};

export default Calendar;
