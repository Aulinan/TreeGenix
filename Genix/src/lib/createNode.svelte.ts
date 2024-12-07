import {type Node, type XYPosition} from '@xyflow/svelte';
import {base} from '../Custom/basePerson.svelte';



export default function createNode(nodeType:string,position:XYPosition,id?:string,spouse?:Array<string>):Node{   
  
return Node = {
  id:id === undefined ? `Node ${spouse[0]}--${spouse[1]}`: id ,
  type:nodeType,
  data: {person:base,spouse:spouse}, //ma devi togliere base per middleNode
  // project the screen coordinates to pane coordinates
  position:position,
  // set the origin of the new node so it is centered
  origin: [0.5, 0.5],

};}
