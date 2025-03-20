import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { Event } from "../types/event";

interface MyDialogProps {
  open: boolean;
  onClose: () => void;
  event: Event;
}

const MyDialog: React.FC<MyDialogProps> = ({ open, onClose, event }) => {
  const {
    start: { dateTime: startTime },
    end: { dateTime: endTime },
    summary,
    extendedProperties: {
      shared: { phone, crowdSize, name, email, eventDescription },
    },
  } = event;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <span className="font-bold text-black/80">{summary}</span>
      </DialogTitle>
      {event ? (
        <div>加載不出資料欸？</div>
      ) : (
        <DialogContent>
          <DialogContentText className="space-y-0.5">
            <div>
              <span className="font-bold">姓名</span> &nbsp;{name}
            </div>
            <div>
              <span className="font-bold">郵件</span> &nbsp;{email}
            </div>
            <div>
              <span className="font-bold">人數</span> &nbsp;{crowdSize}
            </div>
            <div>
              <span className="font-bold">起始</span> &nbsp;{startTime}
            </div>
            <div>
              <span className="font-bold">結束</span> &nbsp;{endTime}
            </div>
            <div>
              <span className="font-bold">簡述</span> &nbsp;{eventDescription}
            </div>
          </DialogContentText>
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={onClose}>關閉</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MyDialog;
