import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { app, auth } from "./firebase"; // Now you can use `auth` or other Firebase functions here
import NavBar from "./Components/NavBar";
import Footer from "./Components/Footer";
import Calendar from "./pages/Calendar";
import ApplyForm from "./pages/ApplyForm";
import Rule from "./pages/Rule";
import "./App.css";
import BgGrid from "./img/grid.svg";

const App: React.FC = () => {
  const backgroundStyle = {
    backgroundImage: `url(${BgGrid})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    height: "100vh",
    zIndex: -1,
  };

  return (
    <div style={backgroundStyle}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Router>
          <NavBar />
          <Routes>
            <Route path="/" element={<Calendar />} />
            <Route path="/rule" element={<Rule />} />
            <Route path="/apply" element={<ApplyForm />} />
          </Routes>
          <Footer />
        </Router>
      </LocalizationProvider>
    </div>
  );
};

export default App;

