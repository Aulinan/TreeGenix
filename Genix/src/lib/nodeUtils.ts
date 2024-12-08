import { type Node, type XYPosition } from "@xyflow/svelte";

export const isMiddleNode = (node: Node): boolean => node.type === 'middleNode'

export const getCenterBetweenNodes = (target: XYPosition, source: XYPosition): XYPosition => ({ x: (target.x + source.x) / 2, y: (target.y + source.y) / 2 })

export const getMiddleNodeIndexFromId = (middleNodeId: string): number => parseInt(middleNodeId.replace('m', ''))
