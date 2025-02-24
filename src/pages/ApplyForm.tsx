import React from "react";
import { Button, Box, MenuItem, FormControl, Select } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import ConsentCheckbox from "../Components/ConsentCheckbox";
import "../styles/ApplyForm.css";

const ApplyForm: React.FC = () => {
  const [startDate, setStartDate] = React.useState<Dayjs | null>(dayjs());
  const [endDate, setEndDate] = React.useState<Dayjs | null>(dayjs());

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div className="pt-[5px] px-[5%] pb-20 w-full">
      <Box component="form" onSubmit={handleSubmit} className="gap-[25px] flex flex-col justify-center items-center">
        <div className="w-full">
          {/* <input type="text" className="ipt" label="申請人姓名"></input> */}
          <TextField className="ipt" placeholder="申請人姓名" variant="outlined" sx={{ bgcolor: "white" }} fullWidth />
        </div>
        <div className="flex justify-between w-full">
          <TextField className="ipt" placeholder="手機號碼" variant="outlined" fullWidth />
        </div>
        <div className="w-full justify-between flex gap-4">
          <TextField className="ipt" placeholder="人數" variant="outlined" />
          <FormControl className="ipt" fullWidth>
            <InputLabel>借用地點</InputLabel>
            <Select labelId="demo-simple-select-label" placeholder="借用地點">
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
          <TextField className="ipt" placeholder="活動簡述（請認真寫！）" variant="outlined" fullWidth />
        </div>
      </Box>
      <div className="mt-[20px] flex flex-col justify-center items-center">
        {/* <div className="w-9/12 flex gap-1">
          <div>請確認您已詳閱空間借用條例</div>
        </div> */}
        <ConsentCheckbox />
        <Button className="myBtn" type="submit" variant="contained" fullWidth size="large">
          確認送出
        </Button>
      </div>
    </div>
  );
};

export default ApplyForm;
