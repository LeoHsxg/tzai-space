import React from "react";
import { TextField, Button, Box } from "@mui/material";
import { InputLabel, MenuItem, FormControl, Select } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import "../styles/ApplyForm.css";
import ConsentCheckbox from "../Components/ConsentCheckbox";

const ApplyForm: React.FC = () => {
  const [startDate, setStartDate] = React.useState<Dayjs | null>(dayjs());
  const [endDate, setEndDate] = React.useState<Dayjs | null>(dayjs());

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div className="pt-[75px] pb-[120px] w-9/12 m-auto max-w-[400px] ">
      <div className="text-center text-black/80 text-2xl font-noto font-bold break-words mt-6 mb-4">仁齋空間借用表單</div>
      <Box component="form" onSubmit={handleSubmit} className="gap-5 flex flex-col justify-center items-center">
        <TextField className="custom-textfield" label="申請人姓名" variant="outlined" fullWidth />
        <div className="flex justify-between w-full gap-3">
          <TextField className="custom-textfield" label="人數" variant="outlined" fullWidth />
          <TextField className="custom-textfield" label="手機號碼" variant="outlined" fullWidth />
        </div>
        <FormControl className="custom-textfield" fullWidth>
          <InputLabel>借用地點</InputLabel>
          <Select labelId="demo-simple-select-label" label="借用地點">
            <MenuItem value={10}>小導師室</MenuItem>
            <MenuItem value={20}>書房</MenuItem>
            <MenuItem value={30}>橘廳</MenuItem>
            <MenuItem value={30}>會議室</MenuItem>
            <MenuItem value={30}>貢丸室</MenuItem>
          </Select>
        </FormControl>
        <div className="flex justify-between w-full gap-3">
          <DateTimePicker className="custom-textfield" label="開始日期" value={startDate} onChange={newValue => setStartDate(newValue)} />
          <DateTimePicker className="custom-textfield" label="結束日期" value={endDate} onChange={newValue => setEndDate(newValue)} />
        </div>
        <TextField className="custom-textfield" label="活動簡述" variant="outlined" fullWidth />
      </Box>
      <div className="mt-[20px] flex flex-col justify-center items-center">
        {/* <div className="w-9/12 flex gap-1">
          <div>請確認您已詳閱空間借用條例</div>
        </div> */}
        <ConsentCheckbox />
        <Button
          className=""
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          sx={{
            marginTop: "5px",
            backgroundColor: "#FFD81E",
          }}>
          確認送出
        </Button>
      </div>
    </div>
  );
};

export default ApplyForm;
