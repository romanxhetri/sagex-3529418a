
import React from "react";
import { 
  RefreshCw, 
  Filter, 
  Check, 
  CircleX 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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
    <div className="flex items-center space-x-4">
      <Select
        value={filter}
        onValueChange={onFilterChange}
      >
        <SelectTrigger className="w-[140px] h-8 text-xs bg-gray-800 border-gray-700">
          <div className="flex items-center">
            <Filter size={12} className="mr-1 text-gray-400" />
            <SelectValue placeholder="Filter" />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700 text-white">
          <SelectItem value="all">All Tasks</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="in-progress">In Progress</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="failed">Failed</SelectItem>
        </SelectContent>
      </Select>
      
      <div className="flex items-center space-x-2">
        <Switch
          checked={autoImplementEnabled}
          onCheckedChange={onToggleAutoImplement}
          id="auto-implement"
          className="data-[state=checked]:bg-green-600"
        />
        <Label htmlFor="auto-implement" className="text-xs cursor-pointer">
          {autoImplementEnabled ? (
            <span className="flex items-center text-green-400">
              <Check size={12} className="mr-1" />
              Auto
            </span>
          ) : (
            <span className="flex items-center text-gray-400">
              <CircleX size={12} className="mr-1" />
              Auto
            </span>
          )}
        </Label>
      </div>
      
      <Button
        onClick={onRefresh}
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
        title="Refresh tasks"
      >
        <RefreshCw size={14} />
      </Button>
    </div>
  );
};
