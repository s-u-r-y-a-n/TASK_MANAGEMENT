import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

export const DialogComponent = ({
  open,
  onClose,
  onSubmit,
  title,
  description,
  children,
  submitText = "Save",
  cancelText = "Cancel",
  maxWidth = "sm",
  loading = false,
  submitAsFormData = false,
}) => {
  const formId = React.useId();

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    if (submitAsFormData) {
      onSubmit?.(formData);
      return;
    }

    const formValues = Object.fromEntries(formData.entries());

    onSubmit?.(formValues);
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth={maxWidth}
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          px: 3,
          pt: 3,
          pb: 1,
          fontSize: "1.4rem",
          fontWeight: 700,
        }}
      >
        {title}
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 2 }}>
        {description && (
          <DialogContentText
            sx={{
              mb: 3,
              color: "text.secondary",
              fontSize: "0.9rem",
            }}
          >
            {description}
          </DialogContentText>
        )}

        <form id={formId} noValidate onSubmit={handleSubmit}>
          {children}
        </form>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: "1px solid",
          borderColor: "divider",
          gap: 1,
        }}
      >
        <Button
          onClick={onClose}
          disabled={loading}
          variant="outlined"
          sx={{
            textTransform: "none",
            borderRadius: 2,
            px: 2.5,
          }}
        >
          {cancelText}
        </Button>

        <Button
          type="submit"
          form={formId}
          variant="contained"
          disabled={loading}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            px: 2.5,
            fontWeight: 600,
          }}
        >
          {loading ? "Creating..." : submitText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
