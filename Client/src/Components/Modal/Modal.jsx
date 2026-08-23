import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

export default function Modal({
  text = "",
  setText = () => {},
  handleSubmit = () => {},
  open,
  setOpen,
  isSubmitting = false,
}) {
  const handleClose = () => {
    setOpen(false);
  };

  const onFormSubmit = async (event) => {
    event.preventDefault();
    const wasCreated = await handleSubmit();
    if (wasCreated) handleClose();
  };

  return (
    <>
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
          <Button onClick={handleClose} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" form="subscription-form" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Done"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
