import { HTMLNodeType } from '@/types/HTMLNodeTypes';

export type NodeProps = {
  class?: string;
  text?: string;
  href?: string;
  rel?: string;
  src?: string;
};

export type Node = {
  id: string;
  type: keyof typeof HTMLNodeType;
  nodes: Node[];
  props?: NodeProps;
};
