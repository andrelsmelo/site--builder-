import { Node } from "@/types/Node";

export type NodeIndex = {
  [key: string]: Node;
};

function buildNodeIndex(node: Node, nodeIndex: NodeIndex = {}): NodeIndex {
  nodeIndex[node.id] = node;
  node.nodes.forEach(childNode => buildNodeIndex(childNode, nodeIndex));
  return nodeIndex;
}

export function addNodeWithIndex(htmlTree: Node, id: string, newNode: Node): Node | null {
  const nodeIndex = buildNodeIndex(htmlTree);

  const parent = nodeIndex[id];
  if (parent) {
    parent.nodes.push(newNode);
    setNodeHistory(newNode, id);
    clearRedoHistory();
    return { ...htmlTree };
  }
  return null;
}

function setNodeHistory(node: Node, parentId: string) {
  const now = new Date().toISOString();
  const historyKey = 'nodeHistory';

  let history = JSON.parse(localStorage.getItem(historyKey) || '[]');

  history.push({ timestamp: now, node, parentId });

  if (history.length > 10) {
    history = history.slice(history.length - 10);
  }

  localStorage.setItem(historyKey, JSON.stringify(history));
}

function setRedoHistory(node: Node, parentId: string) {
  const now = new Date().toISOString();
  const redoKey = 'redoHistory';

  let history = JSON.parse(localStorage.getItem(redoKey) || '[]');

  history.push({ timestamp: now, node, parentId });

  if (history.length > 10) {
    history = history.slice(history.length - 10);
  }

  localStorage.setItem(redoKey, JSON.stringify(history));
}

function clearRedoHistory() {
  localStorage.removeItem('redoHistory');
}

export function removeLastNode(htmlTree: Node): Node | null {
  const historyKey = 'nodeHistory';
  let history = JSON.parse(localStorage.getItem(historyKey) || '[]');

  if (history.length === 0) {
    return htmlTree;
  }

  const lastEntry = history.pop();
  const { node: nodeToRemove, parentId } = lastEntry;

  const removeNode = (node: Node, nodeId: string): Node | null => {
    node.nodes = node.nodes.filter(child => child.id !== nodeId);
    node.nodes.forEach(child => removeNode(child, nodeId));
    return node;
  };

  const updatedTree = removeNode(htmlTree, nodeToRemove.id);

  setRedoHistory(nodeToRemove, parentId);
  localStorage.setItem(historyKey, JSON.stringify(history));

  return updatedTree ? { ...updatedTree } : null;
}

export function redoLastNode(htmlTree: Node): Node | null {
  const redoKey = 'redoHistory';
  let redoHistory = JSON.parse(localStorage.getItem(redoKey) || '[]');

  if (redoHistory.length === 0) {
    return htmlTree;
  }

  const lastRedoEntry = redoHistory.pop();
  const { node: nodeToAdd, parentId } = lastRedoEntry;

  const nodeIndex = buildNodeIndex(htmlTree);
  const parent = nodeIndex[parentId];

  if (parent) {
    parent.nodes.push(nodeToAdd);
    setNodeHistory(nodeToAdd, parentId);
  }

  localStorage.setItem(redoKey, JSON.stringify(redoHistory));

  return { ...htmlTree };
}
