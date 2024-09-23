import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Calendar from "./Components/Calendar";
import NavBar from "./Components/NavBar";
import Footer from "./Components/Footer";
import Rule from "./Components/Rule";
import "./App.css";

const App: React.FC = () => {
  const backgroundStyle = {
    backgroundImage: "url(/src/img/grid.svg)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    height: "100vh",
    zIndex: -1,
  };

  return (
    <div style={backgroundStyle}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <NavBar />
        <Calendar />
        {/* <Rule /> */}
        <Footer />
      </LocalizationProvider>
    </div>
  );
};

export default App;

