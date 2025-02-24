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

const App: React.FC = () => {
  return (
    <div className="bg-[#F3F3F3] relative h-screen">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Router>
          <NavBar />
          <Routes>
            <Route path="/" element={<Calendar />} />
            <Route path="/apply" element={<ApplyForm />} />
            <Route path="/rule" element={<Rule />} />
          </Routes>
          <Footer />
        </Router>
      </LocalizationProvider>
    </div>
  );
};

export default App;

