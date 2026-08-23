import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";

export default function Modal({
  text = "",
  setText = () => {},
  handleSubmit = () => {},
}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onFormSubmit = (event) => {
    event.preventDefault();
    console.log("Form submitted with text:", text);
    handleSubmit(event);
    handleClose();
  };

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open form dialog
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>Create new list</DialogTitle>
        <DialogContent>
          <form id="subscription-form" onSubmit={onFormSubmit}>
            <TextField
              autoFocus
              required
              id="taskListName"
              name="taskListName"
              type="text"
              fullWidth
              variant="filled"
              placeholder="Enter list name"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
              }}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" form="subscription-form">
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
