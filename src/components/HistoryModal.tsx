'use client'

import { Redo } from "@/icons/redo";
import { Undo } from "@/icons/undo";

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: Array<{ timestamp: string; node: any; parentId: string }>;
  redoHistory: Array<{ timestamp: string; node: any; parentId: string }>;
  onUndo: () => void;
  onRedo: () => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, history, redoHistory, onUndo, onRedo }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 w-1/4 h-full bg-white shadow-lg p-4 overflow-y-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">History</h2>
        <button onClick={onClose} className="text-red-500 font-bold">X</button>
      </div>
      <div>
        <h3 className="text-lg font-semibold mt-4">Undo History</h3>
        <ul>
          {history.map((entry, index) => (
            <li key={index} className="p-2 border-b">
              {new Date(entry.timestamp).toLocaleString()} - {entry.node.type}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-semibold mt-4">Redo History</h3>
        <ul>
          {redoHistory.map((entry, index) => (
            <li key={index} className="p-2 border-b">
              {new Date(entry.timestamp).toLocaleString()} - {entry.node.type}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex mt-4">
        <button onClick={onUndo} className="mr-2 bg-blue-500 text-white p-2 rounded">
            <Undo fill="#fff" height={20}/>
        </button>
        <button onClick={onRedo} className="bg-green-500 text-white p-2 rounded">
            <Redo fill="#fff" height={20}/>
        </button>
      </div>
    </div>
  );
};

export default HistoryModal;
