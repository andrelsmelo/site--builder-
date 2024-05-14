'use client';
import React, { useState, useContext, useEffect, useCallback } from 'react';
import { HtmlTreeContext } from '../context/HtmlTreeContext';
import { HTMLNodeType } from "@/types/HTMLNodeTypes";
import NodePropertiesModal from '@/components/NodeModal';
import HistoryModal from '@/components/HistoryModal';
import { addNodeWithIndex, removeLastNode, redoLastNode } from '@/utils/builder';
import { Node } from '@/types/Node';
import { History } from '@/icons/history';

const Elements = () => {
    const context = useContext(HtmlTreeContext);

    if (!context) {
        throw new Error('Elements must be used within a HtmlTreeProvider');
    }

    const { htmlTree, dispatch } = context;

    const [selectedType, setSelectedType] = useState<keyof typeof HTMLNodeType | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [historyModalOpen, setHistoryModalOpen] = useState(false);
    const [history, setHistory] = useState([]);
    const [redoHistory, setRedoHistory] = useState([]);

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

            setHistory(JSON.parse(localStorage.getItem('nodeHistory') || '[]'));
            setRedoHistory(JSON.parse(localStorage.getItem('redoHistory') || '[]'));
        }
    }, [htmlTree, dispatch]);

    const handleRedo = useCallback(() => {
        const updatedTree = redoLastNode(htmlTree);
        if (updatedTree) {
            dispatch({ type: 'UPDATE_TREE', payload: { ...updatedTree } });

            setHistory(JSON.parse(localStorage.getItem('nodeHistory') || '[]'));
            setRedoHistory(JSON.parse(localStorage.getItem('redoHistory') || '[]'));
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

    useEffect(() => {
        const storedHistory = JSON.parse(localStorage.getItem('nodeHistory') || '[]');
        const storedRedoHistory = JSON.parse(localStorage.getItem('redoHistory') || '[]');
        setHistory(storedHistory);
        setRedoHistory(storedRedoHistory);
    }, []);

    return (
        <div className="relative h-screen">
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

            <div className="fixed top-4 w-full flex items-center justify-center">
                <button
                    onClick={() => setHistoryModalOpen(true)}
                    className="bg-blue-500 text-white p-2 rounded"
                >
                    <History fill="#fff" height={20} />
                </button>
            </div>
            <HistoryModal
                isOpen={historyModalOpen}
                onClose={() => setHistoryModalOpen(false)}
                history={history}
                redoHistory={redoHistory}
                onUndo={handleUndo}
                onRedo={handleRedo}
            />
        </div>
    );
};

export default Elements;
