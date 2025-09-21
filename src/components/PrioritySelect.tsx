import { useState } from "react";
import { Box, Button, Menu, MenuItem, Typography } from "@mui/material";
import { KeyboardArrowDown } from "@mui/icons-material";
import type { TaskPriority } from "../types/user";
import { PriorityBadge } from "./PriorityBadge";

interface PrioritySelectProps {
  selectedPriority: TaskPriority | null;
  onPriorityChange: (priority: TaskPriority | null) => void;
  priorities: TaskPriority[];
  fontColor?: string;
  width?: string | number;
}

/**
 * PrioritySelect component allows users to select a priority for a task
 */
export const PrioritySelect: React.FC<PrioritySelectProps> = ({
  selectedPriority,
  onPriorityChange,
  priorities,
  fontColor = "#ffffff",
  width = "100%",
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePrioritySelect = (priority: TaskPriority | null) => {
    onPriorityChange(priority);
    handleClose();
  };

  // Sort priorities by level (lower level = higher priority)
  const sortedPriorities = [...priorities].sort((a, b) => a.level - b.level);

  return (
    <Box sx={{ width, mb: "14px" }}>
      <Typography
        sx={{
          color: fontColor,
          fontSize: "16px",
          fontWeight: 500,
          mb: "8px",
        }}
      >
        Priority (Optional)
      </Typography>
      <Button
        onClick={handleClick}
        endIcon={<KeyboardArrowDown />}
        sx={{
          color: fontColor,
          border: `2px solid ${fontColor}20`,
          borderRadius: "16px",
          textTransform: "none",
          justifyContent: "space-between",
          width: "100%",
          p: "12px 16px",
          "&:hover": {
            backgroundColor: `${fontColor}10`,
          },
        }}
      >
        {selectedPriority ? (
          <PriorityBadge priority={selectedPriority} size="small" variant="filled" />
        ) : (
          <Typography sx={{ color: fontColor, opacity: 0.7 }}>Select Priority</Typography>
        )}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              borderRadius: "16px",
              minWidth: 200,
              mt: 1,
            },
          },
        }}
      >
        <MenuItem
          onClick={() => handlePrioritySelect(null)}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            p: "12px 16px",
          }}
        >
          <Box
            sx={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              border: "2px solid #ccc",
              mr: "8px",
            }}
          />
          <Typography>No Priority</Typography>
        </MenuItem>

        {sortedPriorities.map((priority) => (
          <MenuItem
            key={priority.id}
            onClick={() => handlePrioritySelect(priority)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              p: "12px 16px",
            }}
          >
            <PriorityBadge priority={priority} size="small" variant="filled" />
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};
