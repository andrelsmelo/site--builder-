'use client'
import { Node } from '@/types/Node';
import { createContext, useReducer, useContext, ReactNode, Dispatch, useEffect } from 'react';

interface HtmlTreeProviderProps {
    children: ReactNode;
}

interface HtmlTreeContextType {
    htmlTree: Node;
    dispatch: Dispatch<HtmlTreeAction>;
}

type HtmlTreeAction =
    | { type: 'ADD_NODE'; payload: Node }
    | { type: 'UPDATE_TREE'; payload: Node };

const initialTree: Node = {
    id: 'root',
    type: 'Html',
    nodes: [
        {
            id: 'head',
            type: 'Head',
            nodes: [
                {
                    id: 'tailwind-css',
                    type: 'Scripts',
                    nodes: [],
                    props: { src: 'https://cdn.tailwindcss.com' },
                },
            ],
        },
        {
            id: 'body',
            type: 'Body',
            nodes: []
        }
    ],
};

interface HtmlTreeState {
    htmlTree: Node;
}

export const HtmlTreeContext = createContext<HtmlTreeContextType>({
    htmlTree: initialTree,
    dispatch: () => {},
});

const htmlTreeReducer = (state: HtmlTreeState, action: HtmlTreeAction): HtmlTreeState => {
    switch (action.type) {
        case 'ADD_NODE':
            return {
                htmlTree: {
                    ...state.htmlTree,
                    nodes: [...state.htmlTree.nodes, action.payload],
                },
            };
        case 'UPDATE_TREE':
            return {
                htmlTree: action.payload,
            };
        default:
            return state;
    }
};

export const HtmlTreeProvider = ({ children }: HtmlTreeProviderProps) => {
    const [state, dispatch] = useReducer(htmlTreeReducer, { htmlTree: initialTree });

    useEffect(() => {
        const savedTree = localStorage.getItem('htmlTree');
        if (savedTree) {
            dispatch({ type: 'UPDATE_TREE', payload: JSON.parse(savedTree) });
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('htmlTree', JSON.stringify(state.htmlTree));
    }, [state.htmlTree]);

    return (
        <HtmlTreeContext.Provider value={{ htmlTree: state.htmlTree, dispatch }}>
            {children}
        </HtmlTreeContext.Provider>
    );
};

export const useHtmlTree = () => useContext(HtmlTreeContext);
