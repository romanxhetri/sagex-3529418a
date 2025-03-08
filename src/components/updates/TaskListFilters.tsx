
import React from "react";
import { RefreshCw, Rocket } from "lucide-react";
import { UpdateTask } from "@/services/AIAutoUpdater";

interface TaskListFiltersProps {
  filter: string;
  autoImplementEnabled: boolean;
  onFilterChange: (value: string) => void;
  onToggleAutoImplement: () => void;
  onRefresh: () => void;
}

export const TaskListFilters: React.FC<TaskListFiltersProps> = ({
  filter,
  autoImplementEnabled,
  onFilterChange,
  onToggleAutoImplement,
  onRefresh
}) => {
  return (
    <div className="flex items-center space-x-2">
      <select
        value={filter}
        onChange={(e) => onFilterChange(e.target.value)}
        className="px-2 py-1 bg-gray-800 border border-gray-700 rounded-md text-sm"
      >
        <option value="all">All Tasks</option>
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
        <option value="failed">Failed</option>
      </select>
      
      <button
        onClick={onToggleAutoImplement}
        className={`p-1 rounded-md text-sm ${
          autoImplementEnabled ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300'
        }`}
        title={autoImplementEnabled ? "Disable auto implementation" : "Enable auto implementation"}
      >
        <Rocket size={16} />
      </button>
      
      <button
        onClick={onRefresh}
        className="p-1 bg-gray-800 hover:bg-gray-700 rounded-md text-sm text-gray-300"
        title="Refresh tasks"
      >
        <RefreshCw size={16} />
      </button>
    </div>
  );
};
