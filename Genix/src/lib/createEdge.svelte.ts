import {type Edge} from '@xyflow/svelte'


export default function createEdge(whichNodeInitiates:String,sourceNode:string,targetNode:string,handle:string):Edge{   

  if (whichNodeInitiates === 'source')
    return {
            source: sourceNode,
            target: targetNode,
            sourceHandle: handle,
            targetHandle: handle ==='right'? 'left' : 'top',
            id: `${sourceNode}--${targetNode}`
          }
  return {
          source: targetNode,
          target: sourceNode,
          sourceHandle: handle ==='left'? 'right' : 'bottom',
          targetHandle: handle ,
          id: `${targetNode}--${sourceNode}`
          }
    };