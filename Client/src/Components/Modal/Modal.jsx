import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import "./styles/Modal.scss";

export default function Modal({
  text = "",
  setText = () => {},
  handleSubmit = () => {},
  open,
  setOpen,
  isSubmitting = false,
  modalMode = "create",
}) {
  const isDelete = modalMode === "delete";
  const title = {
    create: "Create New List",
    edit: "Rename List",
    delete: "Delete List?",
  }[modalMode];

  const handleClose = () => {
    setOpen(false);
  };

  const onFormSubmit = async (event) => {
    event.preventDefault();
    const wasCompleted = await handleSubmit();
    if (wasCompleted) handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      className="custom-app-modal"
      PaperProps={{
        className: "modal-paper-container",
      }}
    >
      <DialogTitle className={`modal-title ${isDelete ? "delete-title" : ""}`}>
        {title}
      </DialogTitle>

      <DialogContent className="modal-content">
        <form id="subscription-form" onSubmit={onFormSubmit}>
          {isDelete ? (
            <Typography className="modal-delete-text">
              Are you sure you want to delete <strong>“{text}”</strong>? This
              action cannot be undone and all associated tasks will be removed.
            </Typography>
          ) : (
            <TextField
              autoFocus
              required
              id="taskListName"
              name="taskListName"
              type="text"
              fullWidth
              variant="outlined"
              placeholder="Enter list name"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="modal-text-field"
              inputProps={{
                maxLength: 50,
              }}
            />
          )}
        </form>
      </DialogContent>

      <DialogActions className="modal-actions">
        <Button
          onClick={handleClose}
          disabled={isSubmitting}
          className="modal-cancel-btn"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form="subscription-form"
          disabled={isSubmitting || (!isDelete && !text.trim())}
          className={`modal-confirm-btn ${isDelete ? "delete-btn" : ""}`}
        >
          {isSubmitting ? "Saving..." : isDelete ? "Delete" : "Done"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
