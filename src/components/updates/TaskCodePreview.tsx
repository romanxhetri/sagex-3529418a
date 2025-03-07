
import React from "react";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { LivePreview } from "./LivePreview";
import { UpdateTask } from "@/services/AIAutoUpdater";

interface TaskCodePreviewProps {
  task: UpdateTask | null;
  isImplementing: boolean;
  onImplement: (task: UpdateTask) => void;
}

export const TaskCodePreview: React.FC<TaskCodePreviewProps> = ({
  task,
  isImplementing,
  onImplement
}) => {
  if (!task) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <p>Select a task to view generated code</p>
      </div>
    );
  }

  if (!task.code) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <p>No code available for this task</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Generated Code</h3>
        {task.status !== 'completed' && (
          <Button 
            size="sm"
            onClick={() => onImplement(task)}
            className="flex items-center gap-1"
            disabled={isImplementing}
          >
            {isImplementing ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-t-transparent border-white rounded-full mr-1" />
                Implementing...
              </>
            ) : (
              <>
                <Play size={14} className="mr-1" />
                Implement Now
              </>
            )}
          </Button>
        )}
      </div>
      
      <div className="bg-gray-900 rounded-lg p-3 overflow-auto max-h-60 custom-scrollbar">
        <pre className="text-xs text-gray-300 whitespace-pre-wrap">
          <code>{task.code}</code>
        </pre>
      </div>
      
      <div>
        <h4 className="text-md font-semibold text-white mb-2">Preview</h4>
        <div className="h-[200px] bg-gray-900 rounded-lg overflow-hidden">
          <LivePreview code={task.code} />
        </div>
      </div>
    </div>
  );
};
