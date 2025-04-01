import React, { useState } from "react";
import { Button, Box, MenuItem, FormControl, Select } from "@mui/material";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { CircularProgress, Snackbar, Alert } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";

import { useAuth } from "../hooks/useAuth"; // 假設這是你的 auth hook
import { validateData } from "../func/applyFunc";
import ConsentCheckbox from "../Components/ConsentCheckbox";
import "../styles/ApplyForm.css";

// const FUNCTION_URL = "https://addeventtocalendar-u5raioyw6q-uc.a.run.app";
const FUNCTION_URL = "https://tzai-space.web.app/api/add/";

interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning"; // green, red, blue, orange
  // variant: "standard" | "filled" | "outlined";
}

const ApplyForm: React.FC = () => {
  const user = useAuth(); // 從 context 拿使用者

  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
  const [applicantName, setApplicantName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [crowdSize, setCrowdSize] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [consent, setConsent] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false); // 控制 Dialog

  // 控制 Snackbar
  const [snackbarState, setSnackbarState] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });
  const { open: openSnackbar, message: snackbarMessage, severity: snackbarSeverity } = snackbarState;
  const handleOpenSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarState({ open: true, message, severity });
  };
  const handleCloseSnackbar = () => {
    setSnackbarState({ ...snackbarState, open: false });
  };

  // 處理同意勾選狀態（假設 ConsentCheckbox 支援 checked 與 onChange）
  const handleConsentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConsent(event.target.checked);
  };

  // 表單提交核心程式
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // 基本欄位驗證，確認必填欄位皆有填寫
    if (!applicantName || !phone || !crowdSize || !location || !startDate || !endDate || !description || !consent) {
      alert("請填寫所有必填欄位，並同意隱私權政策");
      return;
    }

    setLoading(true);

    try {
      if (!user) {
        throw new Error("請先進行登入！");
      }

      const requestBody = {
        name: applicantName,
        phone: phone,
        crowdSize: crowdSize,
        room: location,
        checkinTime: startDate.toISOString(),
        checkoutTime: endDate.toISOString(),
        email: user.email ?? "test@gmail.com",
        eventDescription: description,
      };
      console.log("Request Body:", requestBody);

      // 基本資料檢查：電話號碼/人數/姓名/描述的長度或格式
      await validateData(requestBody);

      const response = await fetch(FUNCTION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Unknown error");
      }

      handleOpenSnackbar("預約成功。", "success");
      // setSnackbarMessage(result.message);
    } catch (err: unknown) {
      handleOpenSnackbar((err as Error).message || "請求失敗，請稍後再試。", "error");
    } finally {
      setLoading(false); // 隱藏 Loading Dialog
    }
  };

  return (
    <div className="mt-[5px] px-[5%] pb-20 w-full">
      <Box component="form" onSubmit={handleSubmit} className="gap-5 flex flex-col justify-center items-center">
        <div className="w-full">
          {/* <input type="text" className="ipt" label="申請人姓名"></input> */}
          <TextField
            className="ipt"
            placeholder="申請人姓名"
            variant="outlined"
            sx={{ bgcolor: "white" }}
            fullWidth
            onChange={e => setApplicantName(e.target.value)}
          />
        </div>
        <div className="flex justify-between w-full">
          <TextField className="ipt" fullWidth placeholder="手機號碼" variant="outlined" onChange={e => setPhone(e.target.value)} />
        </div>
        <div className="w-full justify-between flex gap-4">
          <TextField className="ipt" placeholder="人數" variant="outlined" onChange={e => setCrowdSize(e.target.value)} />
          <FormControl className="ipt" fullWidth>
            <InputLabel>借用地點</InputLabel>
            <Select labelId="demo-simple-select-label" placeholder="借用地點" onChange={e => setLocation(e.target.value as string)}>
              <MenuItem value={"小導師室"}>小導師室</MenuItem>
              <MenuItem value={"書房"}>書房</MenuItem>
              <MenuItem value={"橘廳"}>橘廳</MenuItem>
              <MenuItem value={"會議室"}>會議室</MenuItem>
              {/* <MenuItem value={"貢丸室"}>貢丸室</MenuItem> */}
            </Select>
          </FormControl>
        </div>
        <div className="w-full">
          <DateTimePicker
            className="ipt w-full"
            label="開始日期"
            value={startDate}
            views={["month", "day", "hours", "minutes"]}
            onChange={newValue => setStartDate(newValue)}
          />
        </div>
        <div className="flex justify-between w-full">
          <DateTimePicker
            className="ipt w-full"
            label="結束日期"
            value={endDate}
            views={["month", "day", "hours", "minutes"]}
            onChange={newValue => setEndDate(newValue)}
          />
        </div>
        <div className="w-full">
          <TextField
            className="ipt"
            placeholder="活動簡述（請認真寫！）"
            variant="outlined"
            fullWidth
            onChange={e => setDescription(e.target.value)}
          />
        </div>
      </Box>
      <div className="mt-[20px] flex flex-col justify-center items-center">
        <ConsentCheckbox checked={consent} onChange={handleConsentChange} />
        <Button className="myBtn" type="submit" variant="contained" fullWidth size="large" onClick={handleSubmit}>
          確認送出
        </Button>
      </div>

      {/* 1. MUI Dialog - Loading 彈出視窗 */}
      <Dialog
        open={loading}
        aria-labelledby="loading-dialog"
        fullWidth
        maxWidth="sm"
        sx={{
          "& .MuiBackdrop-root": {
            backgroundColor: "rgba(0, 0, 0, 0.8)", // 調整背景顏色，讓它變得更黑
          },
        }}>
        <DialogTitle id="loading-dialog" font-bold font-noto>
          處理中...
        </DialogTitle>
        <DialogContent className="flex flex-col items-center">
          <CircularProgress />
        </DialogContent>
      </Dialog>

      {/* 2. MUI Snackbar - 結果通知 */}
      <Snackbar anchorOrigin={{ vertical: "top", horizontal: "center" }} open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert severity={snackbarSeverity} variant="filled" onClose={handleCloseSnackbar} sx={{ width: "90%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ApplyForm;
