
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, CheckCircle, XCircle, Clock, ArrowUpCircle } from "lucide-react";
import { aiAutoUpdater, UpdateTask } from "@/services/AIAutoUpdater";

export const AIUpdateFeatureList: React.FC = () => {
  const [tasks, setTasks] = useState<UpdateTask[]>([]);
  const [filter, setFilter] = useState<UpdateTask['status'] | 'all'>('all');

  useEffect(() => {
    // Initial load
    setTasks(aiAutoUpdater.getTasks());
    
    // Subscribe to updates
    const unsubscribe = aiAutoUpdater.subscribe((updatedTasks) => {
      setTasks(updatedTasks);
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  const filteredTasks = filter === 'all' 
    ? tasks 
    : tasks.filter(task => task.status === filter);

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
    <div className="bg-glass-dark backdrop-blur-lg border border-glass-border rounded-lg overflow-hidden p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Zap className="text-purple-400 mr-2" size={20} />
          AI Auto Updates
        </h3>
        
        <div className="flex space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as UpdateTask['status'] | 'all')}
            className="bg-gray-800 text-gray-300 text-sm rounded-md px-2 py-1 border border-gray-700"
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>
      
      {filteredTasks.length === 0 ? (
        <div className="text-center py-6 text-gray-400">
          <p>No AI update tasks found</p>
          <button 
            onClick={() => aiAutoUpdater.addTask('Improve app performance', 'enhancement', 'medium')}
            className="mt-2 px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded-md text-white text-sm"
          >
            Create Sample Task
          </button>
        </div>
      ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
          {filteredTasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 border border-gray-700 rounded-lg p-3"
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
                      {task.createdAt.toLocaleString()}
                    </span>
                  </div>
                </div>
                
                {task.status === 'pending' && (
                  <button 
                    className="text-xs bg-purple-600 hover:bg-purple-700 px-2 py-0.5 rounded text-white"
                    onClick={() => {
                      const updatedTasks = tasks.map(t => 
                        t.id === task.id 
                          ? { ...t, status: 'in-progress' as const } 
                          : t
                      );
                      setTasks(updatedTasks);
                      // Would trigger processing in a real system
                    }}
                  >
                    Process
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
