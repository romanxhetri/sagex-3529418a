
import React from "react";
import { CopyIcon } from "lucide-react";

interface CodeEditorProps {
  code: string;
  language?: string;
  onCopy?: () => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ 
  code, 
  language = "tsx", 
  onCopy 
}) => {
  return (
    <div className="relative rounded-lg overflow-hidden h-full border border-gray-800">
      <div className="bg-gray-900 py-2 px-4 border-b border-gray-800 flex justify-between items-center">
        <div className="text-sm font-mono text-gray-400">{language.toUpperCase()}</div>
        <button 
          onClick={onCopy}
          className="p-1 hover:bg-gray-800 rounded transition-colors"
          title="Copy code"
        >
          <CopyIcon size={16} className="text-gray-400" />
        </button>
      </div>
      <pre className="p-4 text-sm font-mono bg-gray-950 text-gray-300 overflow-auto h-[calc(100%-40px)]">
        <code className="whitespace-pre-wrap">{code}</code>
      </pre>
    </div>
  );
};
