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
	  type XYPosition,
      } from '@xyflow/svelte';
   
    
    import '@xyflow/svelte/dist/style.css';

    import getCenterBetweenNodes from './Custom/getCenterBetweenNodes.svelte';
    import createNode from './Custom/createNode.svelte';

    import CustomNode from './Custom/CustomNode.svelte'
    import MiddleNode from './Custom/middleNode.svelte';
    import Person from './types/Person.svelte'
    import NodeData from './types/NodeData.svelte'
	import createEdge from './Custom/createEdge.svelte';

    /*------------------------------initial declarations----------------------------------*/

    const snapGrid: [number, number] = [40,40];

    const nodeTypes = {
        customNode : CustomNode,
        middleNode : MiddleNode
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
        data: { index:0,person:base,spouse:[]},
        position: { x: 0, y: 0 },
        origin : [0.5,0.5],
      }
    ];

    const nodes = writable<Node[]>();
    const trueNodes = writable<Node[]>(initialNodes);
    const nodesForEdge = writable<Node[]>([]);
    const edges = writable<Edge[]>([]);
    const dataArray = writable<NodeData[]>( [{ 
                              id:initialNodes[0].id,
                              position:initialNodes[0].position,
                              person:base}])

    let rect: DOMRectReadOnly;
    let id = 1;
    let indexMiddleNode= 0;
    const getId = () => `${id++}`;
    const getindexMiddleNode = () => `${indexMiddleNode++}`
   
    const { screenToFlowPosition } = useSvelteFlow();
 /*-----------------------------------------end declarations----------------------------------*/

    $nodes=$trueNodes

    const onChangedPosition = (event:CustomEvent) => {
      if (event.detail.targetNode.type === 'middleNode') return;
      if (event.detail.targetNode.data.spouse.length < 1) return;
      for (let i = 0; i <= event.detail.targetNode.data.spouse.length; i++) {
        const indexMiddleNode = event.detail.targetNode.data.spouse[i]
        const idNode1=$nodesForEdge[parseInt(indexMiddleNode)].data.spouse[0]
        const idNode2=$nodesForEdge[parseInt(indexMiddleNode)].data.spouse[1]
        $nodesForEdge[parseInt(indexMiddleNode)].position=getCenterBetweenNodes($trueNodes[parseInt(idNode1)].position, $trueNodes[parseInt(idNode2)].position)
        $nodes=$trueNodes.concat($nodesForEdge)

      }
    }
  

    const handleConnectStart: OnConnectStart = (event,params)=> {
   

    }
   
    const handleConnectEnd: OnConnectEnd = (event, connectionState) => {

      if (connectionState.isValid) return;

        const id = getId()
        const initiatingNodeId = connectionState.fromNode?.id ?? '0';
        const initiatingHandleId = connectionState.fromHandle?.id ?? 'right';
        const sourceOrTarget:string = connectionState.fromHandle?.type ?? 'source'
        const { clientX, clientY } = 'changedTouches' in event ? event.changedTouches[0] : event;
        const nodePosition:XYPosition = screenToFlowPosition({x:clientX,y:clientY})


        if (connectionState.fromHandle?.id === 'right'|| connectionState.fromHandle?.id === 'left') {
          const indexMiddleNode = getindexMiddleNode()

          $trueNodes[parseInt(initiatingNodeId)].data.spouse.push(indexMiddleNode) //updateSpouse
          const newNode = createNode('customNode',nodePosition,base,id,Array(indexMiddleNode))
          $trueNodes.push(newNode);
          $edges.push(createEdge(sourceOrTarget,initiatingNodeId,id,initiatingHandleId))

          const middleNode = createNode('middleNode',getCenterBetweenNodes(nodePosition,$nodes[parseInt(initiatingNodeId)].position),undefined,'',Array(initiatingNodeId,id))
          $nodesForEdge.push(middleNode)
          $nodesForEdge = $nodesForEdge;

          $dataArray.push({
          id: newNode.id,
          position: newNode.position,
          connections: $edges[parseInt(newNode.id)-1].id,
          person: base,})

          $nodes=$trueNodes.concat($nodesForEdge)
          $edges = $edges;
          return;}

        const newNode =createNode('customNode',nodePosition,base,id,[])
        $trueNodes.push(newNode);
        $edges.push(createEdge(sourceOrTarget,initiatingNodeId,id,initiatingHandleId))
        $dataArray.push({
        id: newNode.id,
        position: newNode.position,
        connections: $edges[parseInt(newNode.id)-1].id,
        person: base,
      })
        $nodes=$trueNodes.concat($nodesForEdge)
        $edges = $edges;
    } 

  </script>
   
   
  <div class="wrapper" bind:contentRect={rect}>
    <SvelteFlow
      {nodes}
      {edges}
      {nodeTypes}
      {snapGrid}
      fitView={true}
      onconnectend={handleConnectEnd}
      onconnectstart={handleConnectStart}
      connectionLineType={ConnectionLineType.Step}
      defaultEdgeOptions={{ type: 'smoothstep'}}
      on:nodedrag={onChangedPosition}
     
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