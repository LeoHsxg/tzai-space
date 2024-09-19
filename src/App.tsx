import React from "react";
import Calendar from "./Components/Calendar";
import "./Components/Calendar.css";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const App: React.FC = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Calendar />
    </LocalizationProvider>
  );
};

export default App;

