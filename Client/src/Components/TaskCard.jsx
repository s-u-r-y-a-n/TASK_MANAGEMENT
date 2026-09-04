import { Box, Chip, IconButton, Paper, Stack, Typography } from "@mui/material";

import {
  CheckCircleOutlined,
  DescriptionOutlined,
  DownloadOutlined,
  FolderOutlined,
  MoreVert,
  OpenInNew,
  Star,
  StarBorder,
} from "@mui/icons-material";

const TaskCard = ({ task, onToggle, onMenu, onStar }) => {
  const hasAttachment = task?.attachment?.fileName && task?.attachment?.fileUrl;
  const isPdf = task?.attachment?.mimeType === "application/pdf";
  const isImage = task?.attachment?.mimeType?.startsWith("image/");
  const listName = task?.listId?.listName || task?.listName;

  const handleOpenAttachment = () => {
    if (!hasAttachment) return;
    window.open(task.attachment.fileUrl, "_blank", "noopener,noreferrer");
  };

  const handleDownload = () => {
    if (!hasAttachment) return;
    const link = document.createElement("a");
    link.href = task.attachment.fileUrl;
    link.download = task.attachment.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        backgroundColor: "#fff",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          borderColor: "primary.light",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
        },
      }}
    >
      <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 1.25,
          }}
        >
          {/* Complete checkbox */}
          <IconButton
            onClick={() => onToggle?.(task)}
            size="small"
            sx={{
              mt: 0.1,
              color:
                task.status === "Completed" ? "success.main" : "text.secondary",
            }}
          >
            <CheckCircleOutlined />
          </IconButton>

          {/* Task content */}
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
            }}
          >
            {/* Title */}
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color:
                  task.status === "Completed"
                    ? "text.disabled"
                    : "text.primary",

                textDecoration:
                  task.status === "Completed" ? "line-through" : "none",

                wordBreak: "break-word",
              }}
            >
              {task.title}
            </Typography>

            {task.description ? (
              <Typography
                variant="body2"
                sx={{
                  mt: 0.5,
                  color: "text.secondary",
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {task.description}
              </Typography>
            ) : (
              <Typography
                variant="body2"
                sx={{
                  mt: 0.5,
                  color: "text.disabled",
                  fontStyle: "italic",
                }}
              >
                No description
              </Typography>
            )}
          </Box>

          <IconButton size="small" onClick={(event) => onMenu?.(event, task)}>
            <MoreVert fontSize="small" />
          </IconButton>
        </Box>

        {hasAttachment && (
          <AttachmentPreview
            fileName={task.attachment.fileName}
            fileUrl={task.attachment.fileUrl}
            mimeType={task.attachment.mimeType}
            isPdf={isPdf}
            isImage={isImage}
            onOpen={handleOpenAttachment}
            onDownload={handleDownload}
          />
        )}

        <Box
          sx={{
            mt: 2,
            pl: { xs: 0, sm: 5.5 },

            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,

            flexWrap: "wrap",
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{
              flexWrap: "wrap",
              gap: 0.75,
            }}
          >
            {listName && (
              <Chip
                size="small"
                icon={<FolderOutlined />}
                label={listName}
                variant="outlined"
                sx={{ backgroundColor: "background.default" }}
              />
            )}

            {task.priority && <PriorityChip priority={task.priority} />}

            {task.status && <StatusChip status={task.status} />}

            {task.dueDate && (
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Due {new Date(task.dueDate).toLocaleDateString()}
              </Typography>
            )}
          </Stack>

          <IconButton
            size="small"
            onClick={() => onStar?.(task)}
            sx={{
              color: task.starred ? "warning.main" : "text.disabled",
            }}
          >
            {task.starred ? (
              <Star fontSize="small" />
            ) : (
              <StarBorder fontSize="small" />
            )}
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

const AttachmentPreview = ({
  fileName,
  isPdf,
  isImage,
  onOpen,
  onDownload,
}) => (
  <Box
    sx={{
      mt: 1.5,
      ml: { xs: 0, sm: 5.5 },
      display: "flex",
      alignItems: "center",
      gap: 1,
      p: 1,
      border: "1px solid",
      borderColor: "divider",
      borderRadius: 1.5,
    }}
  >
    <DescriptionOutlined color="action" fontSize="small" />
    <Typography variant="body2" noWrap sx={{ flex: 1 }}>
      {fileName} {isPdf ? "(PDF)" : isImage ? "(Image)" : ""}
    </Typography>
    <IconButton size="small" aria-label="Open attachment" onClick={onOpen}>
      <OpenInNew fontSize="small" />
    </IconButton>
    <IconButton
      size="small"
      aria-label="Download attachment"
      onClick={onDownload}
    >
      <DownloadOutlined fontSize="small" />
    </IconButton>
  </Box>
);

const PriorityChip = ({ priority }) => {
  const colorByPriority = { High: "error", Medium: "warning", Low: "success" };

  return (
    <Chip
      size="small"
      label={priority}
      color={colorByPriority[priority] || "default"}
    />
  );
};

const StatusChip = ({ status }) => (
  <Chip
    size="small"
    label={status}
    color={status === "Completed" ? "success" : "default"}
  />
);

export default TaskCard;
