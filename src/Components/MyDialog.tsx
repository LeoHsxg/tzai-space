import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

interface MyDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

const MyDialog: React.FC<MyDialogProps> = ({ open, onClose, title, content }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText className="space-y-0.5">
          <div>姓名 陳小遙</div>
          <div>郵件 testtesttesttest@gmail.com</div>
          <div>人數 {content}</div>
          <div>起始 2024/08/15 09:00 PM</div>
          <div>結束 2024/08/15 09:00 PM</div>
          <div>簡述 巴巴拉拉小魔仙子你好哈密瓜巴巴拉拉小魔仙子你好哈密瓜巴巴拉拉小魔仙子你好哈密瓜</div>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>關閉</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MyDialog;
