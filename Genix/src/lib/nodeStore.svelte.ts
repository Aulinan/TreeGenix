import { writable, get } from 'svelte/store';
import { type Node, type Edge, type NodeTypes, type XYPosition } from '@xyflow/svelte';
import { type Person } from '../types/Person'
import { getCenterBetweenNodes } from './nodeUtils'
import MiddleNode from '../Custom/middleNode.svelte';

export const nodes = writable<Node[]>([]);
export const trueNodes = writable<Node[]>([]);
export const middleNodes = writable<Node[]>([]);
export const edges = writable<Edge[]>([]);

const id = writable(0);
const indexMiddleNode = writable(0);

const getId = () => {
  const currentId = `${get(id)}`;
  id.update(oldId => oldId + 1);
  return currentId;
}

const getindexMiddleNode = () => {
  const currentId = `m${get(indexMiddleNode)}`;
  indexMiddleNode.update(oldMiddleNodeId => oldMiddleNodeId + 1)
  return currentId
}

const BASE_PERSON: Person = {
  name: 'Nome',
  dateOfBirth: new Date(),
  age: undefined,
  gender: 'male',
  ailments: [],
  deceased: false
} as const;

export const initializeApplication = (): void => {
  const initialNode = createNode('customNode')

  middleNodes.subscribe((newMiddleNodes) => nodes.set([...get(trueNodes), ...newMiddleNodes])); // subscribe ci permette di aggiornare automaticamente nodes se vi è una modifca a trueNodes o middleNodes
  trueNodes.subscribe((newTrueNodes) => nodes.set([...newTrueNodes, ...get(middleNodes)]));
  trueNodes.set([initialNode]);
}

const addNode = (newNode: Node): void => trueNodes.update(oldNodes => [...oldNodes, newNode])
const addMiddleNode = (newMiddleNode: Node): void => middleNodes.update(oldMiddleNodes => [...oldMiddleNodes, newMiddleNode])

export const createSpouseNode = (startingNode: Node, spouseNodePosition: XYPosition, handleType: string): void => {
  const spouseNode = createNode('customNode', spouseNodePosition,[],startingNode.data.person.gender ==='male'? {...BASE_PERSON,gender:'female'}:BASE_PERSON);
  createMiddleNode(startingNode, spouseNode)

  const newEdge: Edge = {
    id: `${startingNode.id}--${spouseNode.id}`,
    source: handleType === 'source' ? startingNode.id : spouseNode.id,
    target: handleType === 'source' ? spouseNode.id : startingNode.id,
    sourceHandle: 'right',
    targetHandle: 'left'
  }

  edges.update(oldEdges => [...oldEdges, newEdge])
}

export const createChildNode = (middleNodeId:string,nodePosition:XYPosition):void => {
  const childNode = createNode('customNode',nodePosition)

  const newEdge: Edge = {
    id: `${middleNodeId}--${childNode.id}`,
    source: middleNodeId,
    target: childNode.id,
    sourceHandle: 'bottom',
    targetHandle: 'top'
  }
  edges.update(oldEdges => [...oldEdges, newEdge])
}

export const createParentsNode = (startingNodeId:string,pointerPosition:XYPosition):void =>{
  const fatherNode = createNode('customNode',{x:pointerPosition.x-80,y:pointerPosition.y})
  const motherNode = createNode('customNode',{x:pointerPosition.x+80,y:pointerPosition.y},[],{...BASE_PERSON,gender:'female'})

  const newEdgeParents: Edge = {
    id: `${fatherNode.id}--${motherNode.id}`,
    source: fatherNode.id,
    target: motherNode.id,
    sourceHandle: 'right',
    targetHandle: 'left'
  }

  const middleNode =createMiddleNode(fatherNode,motherNode)

  const newEdgeChild: Edge = {
    id: `${middleNode.id}--${startingNodeId}`,
    source: middleNode.id,
    target: startingNodeId,
    sourceHandle: 'bottom',
    targetHandle: 'top'
  }

  edges.update(oldEdges => [...oldEdges, newEdgeParents,newEdgeChild])

}

const createMiddleNode = (startingNode: Node, spouseNode: Node): Node => {
  const middleNode = createNode(
    'middleNode',
    getCenterBetweenNodes(startingNode.position, spouseNode.position),
    [startingNode.id, spouseNode.id], undefined)

  startingNode.data.spouses = [...(startingNode.data.spouses as ReadonlyArray<string>), middleNode.id] //id che indica il middleNode, utilizzato per spostare il middle node onchange
  spouseNode.data.spouses = [...(spouseNode.data.spouses as ReadonlyArray<string>), middleNode.id]

  return middleNode
}

const createNode = (type: keyof NodeTypes, position: XYPosition = { x: 0, y: 0 },spouses: ReadonlyArray<string> = [], person: Person = BASE_PERSON): Node => {
  const isMiddleNode = type === 'middleNode';
  const id = (isMiddleNode ? getindexMiddleNode : getId)()

  const newNode: Node = {
    id,
    type,
    position,
    origin: [0.5, 0.5],
    data: {label:person.name, person:{...person}, spouses:[...spouses] }
  };

  (isMiddleNode ? addMiddleNode : addNode)(newNode)

  return newNode
}

export const updateNodes = (nodeName:string,node:Node) => {
  if (node===undefined) return;
  const id = parseInt(node.id)
  node.data={...node.data,label:nodeName}


  trueNodes.set([node])
  console.log(get(trueNodes))
}