'use client';
import React, { useState, useContext, useEffect, useCallback } from 'react';
import { HtmlTreeContext } from '../context/HtmlTreeContext';
import { HTMLNodeType } from "@/types/HTMLNodeTypes";
import NodePropertiesModal from '@/components/NodeModal';
import { addNodeWithIndex, removeLastNode, redoLastNode } from '@/utils/builder';
import { Node } from '@/types/Node';

const Elements = () => {
    const context = useContext(HtmlTreeContext);

    if (!context) {
        throw new Error('Elements must be used within a HtmlTreeProvider');
    }

    const { htmlTree, dispatch } = context;

    const [selectedType, setSelectedType] = useState<keyof typeof HTMLNodeType | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const uniqueElements = new Set(['Html', 'Head', 'Body', 'Scripts', 'Header', 'Main', 'Footer']);

    const handleSelect = (type: keyof typeof HTMLNodeType) => {
        setSelectedType(type);
        setModalOpen(true);
    };

    const handleSave = (props: { [key: string]: string }, parentId: string) => {
        if (selectedType) {
            const newNode: Node = {
                id: `${selectedType}-${Date.now()}`,
                type: selectedType,
                nodes: [],
                props,
            };

            const updatedTree = addNodeWithIndex(htmlTree, parentId, newNode);
            if (updatedTree) {
                dispatch({ type: 'UPDATE_TREE', payload: { ...updatedTree } });
                setModalOpen(false);
            }
        }
    };

    const getAllNodes = (node: Node): Node[] => {
        let nodes = [node];
        node.nodes.forEach(child => {
            nodes = nodes.concat(getAllNodes(child));
        });
        return nodes;
    };

    const checkIfElementExists = (type: string): boolean => {
        const allNodes = getAllNodes(htmlTree);
        return allNodes.some(node => node.type === type);
    };

    const handleUndo = useCallback(() => {
        const updatedTree = removeLastNode(htmlTree);
        if (updatedTree) {
            dispatch({ type: 'UPDATE_TREE', payload: { ...updatedTree } });
        }
    }, [htmlTree, dispatch]);

    const handleRedo = useCallback(() => {
        const updatedTree = redoLastNode(htmlTree);
        if (updatedTree) {
            dispatch({ type: 'UPDATE_TREE', payload: { ...updatedTree } });
        }
    }, [htmlTree, dispatch]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === 'z') {
                event.preventDefault();
                handleUndo();
            } else if (event.ctrlKey && event.key === 'y') {
                event.preventDefault();
                handleRedo();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleUndo, handleRedo]);

    return (
        <div className="p-4 border rounded-lg border-solid m-2 basis-1/3">
            <h3>Elements</h3>
            <ul>
                {(Object.keys(HTMLNodeType) as Array<keyof typeof HTMLNodeType>).map((type) => {
                    const isDisabled = uniqueElements.has(type) && checkIfElementExists(type);
                    return (
                        <li key={type}
                            onClick={() => !isDisabled && handleSelect(type)}
                            className={`cursor-pointer p-1 m-1 bg-white border rounded-md hover:bg-slate-500 hover:text-white ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}`}>
                            {type}
                        </li>
                    );
                })}
            </ul>
            <NodePropertiesModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSave}
                selectedType={selectedType}
                nodes={getAllNodes(htmlTree)}
                initialProps={{}}
            />
        </div>
    );
};

export default Elements;
