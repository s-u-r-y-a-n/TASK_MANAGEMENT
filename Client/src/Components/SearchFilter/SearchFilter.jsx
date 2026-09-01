import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "../../store/taskSlice.js";
import { setTasks } from "../../store/taskSlice.js";
import "./styles/SearchFilter.scss";

const initialFilters = {
  search: "",
  priority: "",
  status: "",
  dueDate: "",
};

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const accessToken = localStorage.getItem("accessToken");

const SearchFilter = ({ onApplyFilters }) => {
  // const [filters, setFilters] = useState(initialFilters);
  const { selectedListIds, taskLists } = useSelector((state) => state.task);
  const selectedListNames = taskLists
    .filter((list) => selectedListIds.includes(list._id || list.id))
    .map((list) => list.listName || list.name || list.title || "Unnamed List");
  const { filters } = useSelector((state) => state.task);
  const { search, priority, status, dueDate } = useSelector(
    (state) => state.task.filters,
  );

  console.log("SELECTED LIST IDS FROM SEARCH FILTER:", selectedListIds);

  const dispatch = useDispatch();
  const buildFilterPayload = () => ({
    listId: selectedListIds,
    search: filters.search.trim(),
    priority: filters.priority,
    status: filters.status,
    dueDate: filters.dueDate,
  });

  const handleFilterChange = (field, value) => {
    dispatch(
      setFilters({
        ...filters,
        [field]: value,
      }),
    );
  };

  const fetchTasks = async (
    customFilters = filters,
    listId = selectedListIds,
  ) => {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await axios.get(
        `${API_BASE_URL}/search-and-filter-tasks`,
        { listId },
        {
          params: {
            search: customFilters.search.trim(),
            priority: customFilters.priority,
            status: customFilters.status,
            dueDate: customFilters.dueDate,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      dispatch(setTasks(response.data.data));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const applyFilters = (event) => {
    event?.preventDefault();
    fetchTasks(filters, selectedListIds);
    onApplyFilters?.(buildFilterPayload());
  };

  const clearFilters = () => {
    dispatch(setFilters(initialFilters));
    fetchTasks(initialFilters, selectedListIds);
    onApplyFilters?.({
      listId: selectedListIds,
      ...initialFilters,
    });
  };

  return (
    <Box
      component="section"
      className="search-filter"
      aria-label="Search tasks"
    >
      <Box className="search-filter__heading">
        <Box>
          <Typography component="h2" variant="h6" fontWeight={700}>
            Find tasks
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Search and filter tasks across your selected lists.
          </Typography>
        </Box>
        <Chip
          icon={<FilterAltOutlinedIcon />}
          label={
            selectedListIds.length
              ? `${selectedListIds.length} list${selectedListIds.length === 1 ? "" : "s"} selected`
              : "All lists"
          }
          variant="outlined"
          className="search-filter__list-count"
        />
      </Box>

      {selectedListNames.length > 0 && (
        <Box
          className="search-filter__selected-lists"
          aria-label="Selected lists"
        >
          {selectedListNames.map((name) => (
            <Chip key={name} label={name} size="small" />
          ))}
        </Box>
      )}

      <Box
        component="form"
        className="search-filter__form"
        onSubmit={applyFilters}
      >
        <TextField
          fullWidth
          label="Search tasks"
          placeholder="Search by title or description"
          value={search}
          onChange={(event) => handleFilterChange("search", event.target.value)}
          slotProps={{
            input: { startAdornment: <SearchIcon fontSize="small" /> },
          }}
        />

        <FormControl fullWidth>
          <InputLabel id="filter-priority-label">Priority</InputLabel>
          <Select
            labelId="filter-priority-label"
            label="Priority"
            value={priority}
            onChange={(event) =>
              handleFilterChange("priority", event.target.value)
            }
          >
            <MenuItem value="">All priorities</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="filter-status-label">Status</InputLabel>
          <Select
            labelId="filter-status-label"
            label="Status"
            value={status}
            onChange={(event) =>
              handleFilterChange("status", event.target.value)
            }
          >
            <MenuItem value="">All statuses</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Due on or before"
          type="date"
          value={dueDate}
          onChange={(event) =>
            handleFilterChange("dueDate", event.target.value)
          }
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <Box className="search-filter__actions">
          <Button
            type="button"
            variant="text"
            startIcon={<RestartAltIcon />}
            onClick={clearFilters}
          >
            Clear
          </Button>
          <Button type="submit" variant="contained" startIcon={<SearchIcon />}>
            Search
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SearchFilter;
