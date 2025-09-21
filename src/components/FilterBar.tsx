import { useState } from "react";
import { Box, Button, Menu, MenuItem, Typography, TextField } from "@mui/material";
import { KeyboardArrowDown, Today, DateRange, CalendarMonth, Clear } from "@mui/icons-material";
import type { DateFilterOption, TaskDateRange } from "../types/user";
import { getDateRangeDisplayString } from "../utils";
import styled from "@emotion/styled";
import { ColorPalette } from "../theme/themeConfig";
import { useTheme } from "@emotion/react";

const FilterContainer = styled(Box)`
  background: ${({ theme }) =>
    theme.darkmode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"};
  border: 1px solid
    ${({ theme }) => (theme.darkmode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)")};
  border-radius: 16px;
  padding: 16px;
  margin: 16px 0;
  backdrop-filter: blur(10px);
  box-shadow: ${({ theme }) =>
    theme.darkmode ? "0 4px 20px rgba(0, 0, 0, 0.3)" : "0 4px 20px rgba(0, 0, 0, 0.1)"};
`;

interface FilterBarProps {
  selectedFilter: DateFilterOption;
  onFilterChange: (filter: DateFilterOption) => void;
  customRange: TaskDateRange;
  onCustomRangeChange: (range: TaskDateRange) => void;
}

/**
 * FilterBar component provides date-based filtering options for tasks
 */
export const FilterBar: React.FC<FilterBarProps> = ({
  selectedFilter,
  onFilterChange,
  customRange,
  onCustomRangeChange,
}) => {
  const theme = useTheme();

  // Theme-aware colors using ColorPalette (same as other components)
  const textColor = theme.darkmode ? ColorPalette.fontLight : ColorPalette.fontDark;
  const borderColor = theme.darkmode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.2)";
  const backgroundColor = theme.darkmode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)";
  const hoverBackgroundColor = theme.darkmode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)";
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFilterSelect = (filter: DateFilterOption) => {
    onFilterChange(filter);
    handleClose();
  };

  const handleCustomRangeStartChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const date = event.target.value ? new Date(event.target.value) : null;
    onCustomRangeChange({
      ...customRange,
      start: date,
    });
  };

  const handleCustomRangeEndChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const date = event.target.value ? new Date(event.target.value) : null;
    onCustomRangeChange({
      ...customRange,
      end: date,
    });
  };

  const clearCustomRange = () => {
    onCustomRangeChange({ start: null, end: null });
  };

  const getFilterIcon = (filter: DateFilterOption) => {
    switch (filter) {
      case "today":
        return <Today sx={{ fontSize: "18px", mr: 1 }} />;
      case "thisWeek":
        return <CalendarMonth sx={{ fontSize: "18px", mr: 1 }} />;
      case "customRange":
        return <DateRange sx={{ fontSize: "18px", mr: 1 }} />;
      default:
        return null;
    }
  };

  // Helper function to format date for input value
  const formatDateForInput = (date: Date | null): string => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };

  return (
    <FilterContainer>
      <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Typography
          sx={{
            color: textColor,
            fontSize: "16px",
            fontWeight: 600,
            mr: "8px",
            textShadow: theme.darkmode
              ? "0 1px 2px rgba(0, 0, 0, 0.3)"
              : "0 1px 2px rgba(255, 255, 255, 0.3)",
          }}
        >
          Filter by date:
        </Typography>

        <Button
          onClick={handleClick}
          endIcon={<KeyboardArrowDown />}
          sx={{
            color: textColor,
            border: `2px solid ${borderColor}`,
            borderRadius: "16px",
            textTransform: "none",
            px: "16px",
            py: "8px",
            backgroundColor: backgroundColor,
            textShadow: theme.darkmode
              ? "0 1px 2px rgba(0, 0, 0, 0.3)"
              : "0 1px 2px rgba(255, 255, 255, 0.3)",
            "&:hover": {
              backgroundColor: hoverBackgroundColor,
              borderColor: theme.darkmode ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.3)",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {getFilterIcon(selectedFilter)}
            <Typography
              sx={{
                color: textColor,
                fontSize: "14px",
                textShadow: theme.darkmode
                  ? "0 1px 2px rgba(0, 0, 0, 0.3)"
                  : "0 1px 2px rgba(255, 255, 255, 0.3)",
                fontWeight: 500,
              }}
            >
              {getDateRangeDisplayString(selectedFilter, customRange)}
            </Typography>
          </Box>
        </Button>

        {selectedFilter !== "all" && (
          <Button
            onClick={() => onFilterChange("all")}
            sx={{
              color: textColor,
              opacity: 0.7,
              minWidth: "auto",
              px: "8px",
              "&:hover": {
                opacity: 1,
                backgroundColor: hoverBackgroundColor,
              },
            }}
          >
            <Clear sx={{ fontSize: "18px" }} />
          </Button>
        )}

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
            onClick={() => handleFilterSelect("all")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              p: "12px 16px",
            }}
          >
            <Typography>All Tasks</Typography>
          </MenuItem>

          <MenuItem
            onClick={() => handleFilterSelect("today")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              p: "12px 16px",
            }}
          >
            <Today sx={{ fontSize: "18px" }} />
            <Typography>Today</Typography>
          </MenuItem>

          <MenuItem
            onClick={() => handleFilterSelect("thisWeek")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              p: "12px 16px",
            }}
          >
            <CalendarMonth sx={{ fontSize: "18px" }} />
            <Typography>This Week</Typography>
          </MenuItem>

          <MenuItem
            onClick={() => handleFilterSelect("customRange")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              p: "12px 16px",
            }}
          >
            <DateRange sx={{ fontSize: "18px" }} />
            <Typography>Custom Range</Typography>
          </MenuItem>
        </Menu>

        {selectedFilter === "customRange" && (
          <Box sx={{ display: "flex", alignItems: "center", gap: "8px", ml: "8px" }}>
            <TextField
              type="date"
              label="Start Date"
              size="small"
              value={formatDateForInput(customRange.start)}
              onChange={handleCustomRangeStartChange}
              InputLabelProps={{
                shrink: true,
                style: { color: textColor, fontSize: "14px" },
              }}
              sx={{
                "& .MuiInputBase-input": {
                  color: textColor,
                  fontSize: "14px",
                },
                "& .MuiOutlinedInput-root": {
                  borderColor: borderColor,
                  "& fieldset": {
                    borderColor: borderColor,
                  },
                  "&:hover fieldset": {
                    borderColor: theme.darkmode ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.3)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.darkmode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.5)",
                  },
                },
              }}
            />

            <Typography sx={{ color: textColor, fontSize: "14px" }}>to</Typography>

            <TextField
              type="date"
              label="End Date"
              size="small"
              value={formatDateForInput(customRange.end)}
              onChange={handleCustomRangeEndChange}
              InputLabelProps={{
                shrink: true,
                style: { color: textColor, fontSize: "14px" },
              }}
              sx={{
                "& .MuiInputBase-input": {
                  color: textColor,
                  fontSize: "14px",
                },
                "& .MuiOutlinedInput-root": {
                  borderColor: borderColor,
                  "& fieldset": {
                    borderColor: borderColor,
                  },
                  "&:hover fieldset": {
                    borderColor: theme.darkmode ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.3)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.darkmode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.5)",
                  },
                },
              }}
            />

            {(customRange.start || customRange.end) && (
              <Button
                onClick={clearCustomRange}
                size="small"
                sx={{
                  color: textColor,
                  opacity: 0.7,
                  minWidth: "auto",
                  px: "8px",
                  "&:hover": {
                    opacity: 1,
                    backgroundColor: hoverBackgroundColor,
                  },
                }}
              >
                <Clear sx={{ fontSize: "16px" }} />
              </Button>
            )}
          </Box>
        )}
      </Box>
    </FilterContainer>
  );
};
