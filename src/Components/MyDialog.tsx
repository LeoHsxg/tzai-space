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
      <DialogTitle>
        <span className="font-bold text-black/80">{title}</span>
      </DialogTitle>
      <DialogContent>
        <DialogContentText className="space-y-0.5">
          <div>
            <span className="font-bold">姓名</span> &nbsp;陳小遙
          </div>
          <div>
            <span className="font-bold">郵件</span> &nbsp;testtesttesttest@gmail.com
          </div>
          <div>
            <span className="font-bold">人數</span> &nbsp;{content}
          </div>
          <div>
            <span className="font-bold">起始</span> &nbsp;2024/08/15 09:00 PM
          </div>
          <div>
            <span className="font-bold">結束</span> &nbsp;2024/08/15 09:00 PM
          </div>
          <div>
            <span className="font-bold">簡述</span> &nbsp;巴巴拉拉小魔仙子你好哈密瓜巴巴拉拉小魔仙子你好哈密瓜巴巴拉拉小魔仙子你好哈密瓜
          </div>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>關閉</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MyDialog;
