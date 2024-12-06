import type Person from "../types/Person.svelte";
import {type Node, useSvelteFlow, type XYPosition} from '@xyflow/svelte';



export default function createNode(nodeType:string,position:XYPosition,person?:Person,id?:string,spouse?:Array<string>):Node{   
  
return Node = {
  id:id === '' ? `Node ${spouse[0]}--${spouse[1]}`: id ,
  type:nodeType,
  data: {person:person,spouse:spouse},
  // project the screen coordinates to pane coordinates
  position:position,
  // set the origin of the new node so it is centered
  origin: [0.5, 0.5],

};}
