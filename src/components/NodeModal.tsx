'use client'
import { useState, useEffect } from 'react';
import { Node } from '@/types/Node';
import { Delete } from '@/icons/delete';
import { Plus } from '@/icons/plus';

interface NodePropertiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (props: { [key: string]: string }, parentId: string) => void;
  selectedType: string | null;
  nodes: Node[];
  initialProps: { [key: string]: string };
}

export type NodeProps = {
  class?: string;
  text?: string;
  href?: string;
  rel?: string;
  src?: string;
};

const nodePropsOptions: Array<keyof NodeProps> = ["class", "text", "href", "rel", "src"];

const NodePropertiesModal = ({ isOpen, onClose, onSave, selectedType, nodes, initialProps = {} }: NodePropertiesModalProps) => {
  const [props, setProps] = useState<{ [key: string]: string }>(initialProps);
  const [selectedProp, setSelectedProp] = useState<string | null>(null);
  const [parentId, setParentId] = useState<string>('');

  useEffect(() => {
    if (nodes.length > 0) {
      setParentId(nodes[0].id);
    }
    setProps(initialProps);
  }, [nodes, initialProps]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(props, parentId);
    setProps({});
  };

  const handlePropChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProp(e.target.value);
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>, prop: string) => {
    const { value } = e.target;
    setProps((prevProps) => ({ ...prevProps, [prop]: value }));
  };

  const addProperty = () => {
    if (selectedProp) {
      setProps((prevProps) => ({ ...prevProps, [selectedProp]: '' }));
      setSelectedProp(null);
    }
  };

  const removeProperty = (prop: string) => {
    setProps((prevProps) => {
      const { [prop]: _, ...remainingProps } = prevProps;
      return remainingProps;
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h2>Add Properties for {selectedType}</h2>
        <div>
          <select onChange={handlePropChange} value={selectedProp || ''} className="border p-2 m-2">
            <option value="">Select attribute</option>
            {nodePropsOptions.map((prop) => (
              <option key={prop} value={prop}>
                {prop}
              </option>
            ))}
          </select>
          <button onClick={addProperty} className="bg-green-500 text-white px-4 py-2 rounded">
            <Plus fill="#fff" height={20}/> 
          </button>
        </div>
        <div>
          {Object.keys(props).map((prop) => (
            <div key={prop} className="flex items-center m-2">
              <label className="w-24">{prop}</label>
              <input
                type="text"
                value={props[prop]}
                onChange={(e) => handleValueChange(e, prop)}
                className="border p-2 flex-grow"
              />
              <button onClick={() => removeProperty(prop)} className="ml-2 bg-red-500 text-white px-2 py-1 rounded">
                <Delete fill="#fff" height={20}/>
              </button>
            </div>
          ))}
        </div>
        <div>
          <h3>Select Parent Node</h3>
          <select onChange={(e) => setParentId(e.target.value)} value={parentId} className="border p-2 m-2">
            {nodes.map((node) => (
              <option key={node.id} value={node.id}>
                {node.type} - {node.id}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="mr-2 bg-gray-500 text-white px-4 py-2 rounded">
            Cancel
          </button>
          <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default NodePropertiesModal;
