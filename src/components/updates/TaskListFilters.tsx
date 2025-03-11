
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { UpdateTask } from "@/services/AIAutoUpdater";

interface TaskListFiltersProps {
  filter: string;
  onFilterChange: (filter: string) => void;
  autoImplementEnabled: boolean;
  onToggleAutoImplement: () => void;
  onRefresh: () => void;
}

export const TaskListFilters: React.FC<TaskListFiltersProps> = ({
  filter,
  onFilterChange,
  autoImplementEnabled,
  onToggleAutoImplement,
  onRefresh
}) => {
  return (
    <div className="flex space-x-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onRefresh}
        className="text-xs"
      >
        <RefreshCw size={14} className="mr-1" />
        Refresh
      </Button>
      
      <select
        value={filter}
        onChange={(e) => onFilterChange(e.target.value)}
        className="bg-gray-800 text-gray-300 text-sm rounded-md px-2 py-1 border border-gray-700"
      >
        <option value="all">All Tasks</option>
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
        <option value="failed">Failed</option>
      </select>
      
      <Button 
        size="sm" 
        variant={autoImplementEnabled ? "default" : "outline"}
        onClick={onToggleAutoImplement}
        className="text-xs"
      >
        {autoImplementEnabled ? "Auto-Implement ON" : "Auto-Implement OFF"}
      </Button>
    </div>
  );
};
