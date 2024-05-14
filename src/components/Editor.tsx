'use client'
import React, { useState, useContext, useEffect } from 'react';
import { HtmlTreeContext } from '@/context/HtmlTreeContext';
import { Node, NodeProps } from '@/types/Node';
import NodePropertiesModal from '@/components/NodeModal';
import { Delete } from '@/icons/delete';
import { Edit } from '@/icons/edit';

const Editor = () => {
    const context = useContext(HtmlTreeContext);

    if (!context) {
        throw new Error('Editor must be used within a HtmlTreeProvider');
    }

    const { htmlTree, dispatch } = context;
    const [minimizedNodes, setMinimizedNodes] = useState<Set<string>>(new Set());
    const [editNode, setEditNode] = useState<Node | null>(null);
    const [editProps, setEditProps] = useState<{ [key: string]: string }>({});

    const toggleMinimize = (nodeId: string) => {
        setMinimizedNodes((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(nodeId)) {
                newSet.delete(nodeId);
            } else {
                newSet.add(nodeId);
            }
            return newSet;
        });
    };

    const handleNodeClick = (node: Node) => {
        setEditNode(node);
        setEditProps(node.props || {});
    };

    const handleSave = (props: { [key: string]: string }) => {
        if (editNode) {
            const updatedNode = { ...editNode, props };
            const updateNodeInTree = (node: Node): Node => {
                if (node.id === updatedNode.id) {
                    return updatedNode;
                }
                return { ...node, nodes: node.nodes.map(updateNodeInTree) };
            };
            const updatedTree = updateNodeInTree(htmlTree);
            dispatch({ type: 'UPDATE_TREE', payload: updatedTree });
            setEditNode(null);
            setEditProps({});
        }
    };

    const removeNode = (nodeId: string) => {
        const removeNodeFromTree = (node: Node): Node | null => {
            if (node.id === nodeId) {
                return null;
            }
            return { ...node, nodes: node.nodes.map(removeNodeFromTree).filter(Boolean) as Node[] };
        };
        const updatedTree = removeNodeFromTree(htmlTree);
        if (updatedTree) {
            dispatch({ type: 'UPDATE_TREE', payload: updatedTree });
        }
    };

    const renderNode = (node: Node) => {
        const isMinimized = minimizedNodes.has(node.id);
        return (
            <div key={node.id} className="ml-4">
                <div className="flex justify-between items-center">
                    <span onClick={() => toggleMinimize(node.id)} className="cursor-pointer">
                        {isMinimized ? '+' : '-'} {node.type}
                    </span>
                    <div>
                        <button onClick={() => handleNodeClick(node)} className="ml-2 bg-blue-500 text-white px-2 py-1 rounded">
                            <Edit fill="#fff" height={20}/>
                        </button>
                        <button onClick={() => removeNode(node.id)} className="ml-2 bg-red-500 text-white px-2 py-1 rounded">
                            <Delete fill="#fff" height={20}/>
                        </button>
                    </div>
                </div>
                {!isMinimized && node.props && (
                    <div className="ml-4">
                        {Object.keys(node.props).map((key) => (
                            <div key={key}>
                                <strong>{key}:</strong> {node.props![key as keyof NodeProps]}
                            </div>
                        ))}
                    </div>
                )}
                {!isMinimized && (
                    <div className="ml-4">
                        {node.nodes.map(renderNode)}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="p-4 border rounded-lg border-solid m-2 basis-1/3">
            <h2>Editor</h2>
            <div>
                <h3>Current HTML Tree:</h3>
                <div>
                    {renderNode(htmlTree)}
                </div>
            </div>
            {editNode && (
                <NodePropertiesModal
                    isOpen={Boolean(editNode)}
                    onClose={() => {
                        setEditNode(null);
                        setEditProps({});
                    }}
                    onSave={handleSave}
                    selectedType={editNode.type}
                    nodes={[htmlTree, ...htmlTree.nodes]}
                    initialProps={editProps}
                />
            )}
        </div>
    );
};

export default Editor;
