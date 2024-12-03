<script lang="ts">
    import { writable } from 'svelte/store';
    import {
      SvelteFlow,
      useSvelteFlow,
      Background,
      type Edge,
      type Node,
      type OnConnectEnd,
      type OnConnectStart,
      ConnectionLineType,
      MiniMap,
      Controls,
      } from '@xyflow/svelte';
   
    
    import '@xyflow/svelte/dist/style.css';

    import CustomNode from './Custom/CustomNode.svelte'
    import Person from './types/Person.svelte'
    import NodeData from './types/NodeData.svelte'

    const snapGrid: [number, number] = [25, 25];

    const nodeTypes = {
        customNode : CustomNode
    }

   const base:Person = {
      name:'Nome',
      dateOfBirth:Date(),
      age:undefined,
      gender:'male',
      ailments:[],
      deceased:false
    }

    const initialNodes: Node[] = [
      {
        id: '0',
        type: 'customNode',
        data: { person:base },
        position: { x: 0, y: 0 },
        origin : [0.5,0.5],
      }
    ];

    const nodes = writable<Node[]>(initialNodes);
    const edges = writable<Edge[]>([]);
    const dataArray = writable<NodeData[]>( [{ 
                              id:initialNodes[0].id,
                              position:initialNodes[0].position,
                              person:base}])

    let rect: DOMRectReadOnly;
    let id = 1;
    const getId = () => `${id++}`;
   
    const { screenToFlowPosition } = useSvelteFlow();

    const handleConnectStart: OnConnectStart = (event,params)=> {
      console.log('connection...',event,params)
   

    }
   
    const handleConnectEnd: OnConnectEnd = (event, connectionState) => {
      if (connectionState.isValid) return;
   
      const initiatingNodeId = connectionState.fromNode?.id ?? '1';
      const initiatingHandleId = connectionState.fromHandle?.id ?? 'right';
      const sourceOrTarget = connectionState.fromHandle?.type
      console.log('The Source Node Is ', initiatingNodeId, connectionState)
      const id = getId();
      const { clientX, clientY } = 'changedTouches' in event ? event.changedTouches[0] : event;
   
      const newNode: Node = {
        id,
        type:'customNode',
        data: { person:base },
        // project the screen coordinates to pane coordinates
        position: screenToFlowPosition({
          x: clientX,
          y: clientY
        }),
        // set the origin of the new node so it is centered
        origin: [0.5, 0.5]
      };
      $nodes.push(newNode);
      if (sourceOrTarget === 'source')
        $edges.push({
          source: initiatingNodeId,
          target: id,
          sourceHandle: initiatingHandleId ,
          targetHandle: initiatingHandleId === 'right' ? 'left' : 'top',
          id: `${initiatingNodeId}--${id}`
        });
      else
      $edges.push({
          source: id,
          target: initiatingNodeId,
          sourceHandle: initiatingHandleId==='left' ? 'right' : 'bottom',
          targetHandle: initiatingHandleId,
          id: `${id}--${initiatingNodeId}`
        });
      $nodes = $nodes;
      $edges = $edges;
      $dataArray.push({
		  id: newNode.id,
		  position: newNode.position,
		  connections: $edges[parseInt(newNode.id) - 1].id,
		  person: base,
	  })
      $dataArray=$dataArray
      
      console.log($dataArray)
      console.log($nodes)
    };
  </script>
   
  <svelte:window />
   
  <div class="wrapper" bind:contentRect={rect}>
    <SvelteFlow
      {nodes}
      {edges}
      {nodeTypes}
      {snapGrid}
      fitView={true}
      onconnectend={handleConnectEnd}
      onconnectstart={handleConnectStart}
      connectionLineType={ConnectionLineType.SmoothStep}
      defaultEdgeOptions={{ type: 'smoothstep'}}
      minZoom={0.5}
      maxZoom={5}
      
    >
        <Controls />
        <MiniMap />
      <Background />
    </SvelteFlow>
  </div>
   
  <style>
   
    :global(.svelte-flow .svelte-flow__edge path, .svelte-flow__connectionline path) {
      stroke-width: 2;
    }
   
    .wrapper {
      height: 100vh;
      width: 100vw;

    }

    :global(.svelte-flow__handle) {
      opacity: 0;
      /*TODO Animare Opacità*/
      pointer-events: none;
    }

    :global(.svelte-flow__handle:hover) {
      opacity: 1;
      pointer-events: all;
    }
  </style>