import { Emoji } from "emoji-picker-react";
import { Box, Chip } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { TaskPriority } from "../types/user";

interface PriorityBadgeProps {
  priority: TaskPriority;
  size?: "small" | "medium";
  showEmoji?: boolean;
  showLabel?: boolean;
  variant?: "filled" | "outlined";
  sx?: object;
}

const StyledPriorityBadge = styled(Chip)<{
  prioritycolor: string;
  size: "small" | "medium";
}>(({ theme, prioritycolor, size }) => ({
  backgroundColor: prioritycolor,
  color: theme.palette.getContrastText(prioritycolor),
  fontWeight: 600,
  fontSize: size === "small" ? "12px" : "14px",
  height: size === "small" ? "24px" : "28px",
  borderRadius: "12px",
  border: "none",
  "& .MuiChip-label": {
    padding: size === "small" ? "0 8px" : "0 10px",
    fontSize: "inherit",
    fontWeight: "inherit",
  },
  "&:hover": {
    backgroundColor: prioritycolor,
    opacity: 0.9,
  },
}));

const PriorityCircle = styled(Box)<{ prioritycolor: string; size: "small" | "medium" }>(
  ({ prioritycolor, size }) => ({
    width: size === "small" ? "8px" : "10px",
    height: size === "small" ? "8px" : "10px",
    borderRadius: "50%",
    backgroundColor: prioritycolor,
    display: "inline-block",
    marginRight: size === "small" ? "4px" : "6px",
  }),
);

/**
 * PriorityBadge component displays a task priority with customizable appearance
 */
export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  size = "medium",
  showEmoji = true,
  showLabel = true,
  variant = "filled",
  sx = {},
}) => {
  if (variant === "outlined") {
    return (
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: size === "small" ? "4px" : "6px",
          ...sx,
        }}
      >
        <PriorityCircle prioritycolor={priority.color} size={size} />
        {showEmoji && priority.emoji && (
          <Emoji
            unified={priority.emoji}
            size={size === "small" ? 12 : size === "medium" ? 14 : 16}
            lazyLoad
          />
        )}
        {showLabel && (
          <span
            style={{
              fontSize: size === "small" ? "12px" : size === "medium" ? "14px" : "16px",
              fontWeight: 600,
              color: priority.color,
            }}
          >
            {priority.name}
          </span>
        )}
      </Box>
    );
  }

  return (
    <StyledPriorityBadge
      prioritycolor={priority.color}
      size={size}
      label={
        <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {showEmoji && priority.emoji && (
            <Emoji
              unified={priority.emoji}
              size={size === "small" ? 12 : size === "medium" ? 14 : 16}
              lazyLoad
            />
          )}
          {showLabel && priority.name}
        </Box>
      }
      sx={{
        ...sx,
      }}
    />
  );
};
