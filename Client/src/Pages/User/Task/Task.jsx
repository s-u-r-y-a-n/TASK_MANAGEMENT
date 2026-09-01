import { CreateTask } from "./CreateTask.jsx";
import { FetchTasks } from "./FetchTasks.jsx";
import SearchFilter from "../../../Components/SearchFilter/SearchFilter.jsx";

export const Task = ({ selectedList }) => {
  return (
    <div>
      <SearchFilter />
      <FetchTasks selectedList={selectedList} />
    </div>
  );
};
