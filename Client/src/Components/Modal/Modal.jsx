import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";

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
    edit: "Edit List",
    delete: "Delete List",
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
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <form id="subscription-form" onSubmit={onFormSubmit}>
            {isDelete ? (
              <Typography>
                Are you sure you want to delete “{text}”? This action cannot be undone.
              </Typography>
            ) : (
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
                onChange={(e) => setText(e.target.value)}
              />
            )}
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="subscription-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : isDelete ? "Delete" : "Done"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
