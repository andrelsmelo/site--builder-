
import {HTMLNodeType} from '@/types/HTMLNodeTypes'
import { Node } from '@/types/Node';

function nodeTypeToTag(type: keyof typeof HTMLNodeType): string {
    switch (type) {
      case 'Html':
        return 'html';
      case 'Link':
        return 'link';
      case 'Head':
        return 'head';
      case 'Body':
        return 'body';
      case 'Scripts':
        return 'script';
      case 'Header':
        return 'header';
      case 'Main':
        return 'main';
      case 'Footer':
        return 'footer';
      case 'Section':
        return 'section';
      case 'Article':
        return 'article';
      case 'Div':
        return 'div';
      case 'Paragraph':
        return 'p';
      case 'Title':
        return 'h1';
      case 'List':
        return 'ul';
      default:
        return 'div';
    }
  }
  
  export function serializeHtmlTree(node: Node): string {
    const tag = nodeTypeToTag(node.type);
    let attrs = '';
  
    if (node.props) {
      for (const [key, value] of Object.entries(node.props)) {
        if (key === 'class' || key === 'href' || key === 'rel' || key === 'src') {
          attrs += ` ${key}="${value}"`;
        }
      }
    }
  
    const children = node.nodes.map(serializeHtmlTree).join('');
  
    if (tag === 'link') {
      return `<${tag}${attrs} />`;
    } else if (tag === 'script') {
      return `<${tag}${attrs}></${tag}>`;
    } else if (node.props && node.props.text) {
      return `<${tag}${attrs}>${node.props.text}${children}</${tag}>`;
    } else {
      return `<${tag}${attrs}>${children}</${tag}>`;
    }
  }