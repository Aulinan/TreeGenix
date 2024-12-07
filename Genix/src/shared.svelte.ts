import { writable } from 'svelte/store';
import {
  type Edge,
  type Node,
  } from '@xyflow/svelte';


export const nodes = writable<Node[]>();
export const trueNodes = writable<Node[]>([]);
export const nodesForEdge = writable<Node[]>([]);
export const edges = writable<Edge[]>([]);
