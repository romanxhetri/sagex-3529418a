
import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Clock, ArrowUpCircle, Code, Play, Trash } from "lucide-react";
import { UpdateTask } from "@/services/AIAutoUpdater";

interface TaskCardProps {
  task: UpdateTask;
  isSelected: boolean;
  onSelect: (task: UpdateTask) => void;
  onDelete: (taskId: string, e: React.MouseEvent) => void;
  onProcess: (task: UpdateTask, e: React.MouseEvent) => void;
  onViewCode: (task: UpdateTask, e: React.MouseEvent) => void;
  onImplement: (task: UpdateTask, e: React.MouseEvent) => void;
  isImplementing: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  isSelected,
  onSelect,
  onDelete,
  onProcess,
  onViewCode,
  onImplement,
  isImplementing
}) => {
  const getStatusIcon = (status: UpdateTask['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-400" />;
      case 'failed':
        return <XCircle size={16} className="text-red-400" />;
      case 'in-progress':
        return <Clock size={16} className="text-yellow-400 animate-pulse" />;
      case 'pending':
        return <ArrowUpCircle size={16} className="text-blue-400" />;
    }
  };

  const getTypeColor = (type: UpdateTask['type']) => {
    switch (type) {
      case 'feature':
        return 'bg-purple-500/20 text-purple-300';
      case 'bugfix':
        return 'bg-red-500/20 text-red-300';
      case 'enhancement':
        return 'bg-blue-500/20 text-blue-300';
      case 'refactor':
        return 'bg-yellow-500/20 text-yellow-300';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gray-800 border border-gray-700 rounded-lg p-3 hover:border-purple-500/50 transition-all ${
        isSelected ? 'border-purple-500' : ''
      }`}
      onClick={() => onSelect(task)}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center">
            {getStatusIcon(task.status)}
            <span className="ml-2 text-sm font-medium text-white">{task.description}</span>
          </div>
          
          <div className="flex items-center mt-2">
            <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(task.type)}`}>
              {task.type}
            </span>
            <span className="ml-2 text-xs text-gray-400">
              Priority: {task.priority}
            </span>
            <span className="ml-2 text-xs text-gray-400">
              {new Date(task.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
        
        <div className="flex space-x-1">
          {task.code && (
            <button 
              className="text-xs bg-blue-600 hover:bg-blue-700 p-1 rounded text-white"
              onClick={(e) => onViewCode(task, e)}
            >
              <Code size={14} />
            </button>
          )}
          
          {task.code && task.status !== 'completed' && (
            <button 
              className="text-xs bg-purple-600 hover:bg-purple-700 p-1 rounded text-white"
              onClick={(e) => onImplement(task, e)}
              disabled={isImplementing}
            >
              {isImplementing ? (
                <div className="animate-spin h-3 w-3 border-2 border-t-transparent border-white rounded-full" />
              ) : (
                <Play size={14} />
              )}
            </button>
          )}
          
          {task.status === 'pending' && (
            <button 
              className="text-xs bg-purple-600 hover:bg-purple-700 px-2 py-0.5 rounded text-white"
              onClick={(e) => onProcess(task, e)}
            >
              Process
            </button>
          )}
          
          <button 
            className="text-xs bg-red-600 hover:bg-red-700 p-1 rounded text-white"
            onClick={(e) => onDelete(task.id, e)}
          >
            <Trash size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
