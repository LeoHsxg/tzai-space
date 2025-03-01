import React, { useState } from "react";
import { Button, Box, MenuItem, FormControl, Select } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { FCAPI, auth } from "../firebase/firebase"; // 改成引入你撰寫的 API
import ConsentCheckbox from "../Components/ConsentCheckbox";
import "../styles/ApplyForm.css";

// 這個應用程式未經 Google 驗證 這個應用程式要求存取您 Google 帳戶中的機密資訊。在開發人員 (leosimba9487@gmail.com) 向 Google 驗證這個應用程式之前，請勿使用這個應用程式。

const ApplyForm: React.FC = () => {
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
  const [applicantName, setApplicantName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [crowdSize, setCrowdSize] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [consent, setConsent] = useState<boolean>(false);

  // 元件掛載時初始化 Google API 客戶端
  React.useEffect(() => {
    FCAPI.initializeGoogleAuth();
  }, []);

  // 處理同意勾選狀態（假設 ConsentCheckbox 支援 checked 與 onChange）
  const handleConsentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConsent(event.target.checked);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // 基本欄位驗證，確認必填欄位皆有填寫
    if (!applicantName || !phone || !crowdSize || !location || !startDate || !endDate || !description || !consent) {
      alert("請填寫所有必填欄位，並同意隱私權政策");
      return;
    }

    try {
      // 若使用者尚未登入，則要求使用 Google 登入，並額外要求 Google Calendar 權限
      let currentUser = auth.currentUser;
      if (!currentUser) {
        currentUser = await FCAPI.signInWithGoogle();
      } else {
        console.log("使用者已登入:", currentUser.email);
      }

      let event = {
        name: applicantName,
        phone: phone,
        crowdSize: crowdSize,
        room: location,
        checkinTime: startDate.toISOString(),
        checkoutTime: endDate.toISOString(),
        eventDescription: description,
      };

      await FCAPI.createCalendarEvent(event);

      alert("活動建立成功");
    } catch (error: unknown) {
      // console.error("送出表單錯誤：", error);
      alert("送出表單時發生錯誤: " + (error as Error).message);
    }
  };

  return (
    <div className="pt-[5px] px-[5%] pb-20 w-full">
      <Box component="form" onSubmit={handleSubmit} className="gap-[25px] flex flex-col justify-center items-center">
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
              <MenuItem value={10}>小導師室</MenuItem>
              <MenuItem value={20}>書房</MenuItem>
              <MenuItem value={30}>橘廳</MenuItem>
              <MenuItem value={30}>會議室</MenuItem>
              <MenuItem value={30}>貢丸室</MenuItem>
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
    </div>
  );
};

export default ApplyForm;
