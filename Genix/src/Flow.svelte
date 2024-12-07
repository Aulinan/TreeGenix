<script lang="ts">
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

    import getCenterBetweenNodes from './lib/getCenterBetweenNodes.svelte';
    import createNode from '$lib/createNode.svelte';

    import CustomNode from './Custom/CustomNode.svelte'
    import MiddleNode from './Custom/middleNode.svelte';
    import Person from './types/Person.svelte'
	  import createEdge from './lib/createEdge.svelte';
    import {nodes,edges,trueNodes,nodesForEdge} from './shared.svelte';
    import initializeApp from '$lib/initializeApp.svelte';

    /*------------------------------initial declarations----------------------------------*/

    const snapGrid: [number, number] = [40,40];

    const nodeTypes = {
        customNode : CustomNode,
        middleNode : MiddleNode
    }

    let rect: DOMRectReadOnly;
    let id = 1;
    let indexMiddleNode= 0;
    const getId = () => `${id++}`;
    const getindexMiddleNode = () => `${indexMiddleNode++}`
    let edge:boolean = false
   
    const { screenToFlowPosition } = useSvelteFlow();

    initializeApp();


 /*-----------------------------------------end declarations----------------------------------*/

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
      edge=true
      console.log(event)
    }
   
    const handleConnectEnd: OnConnectEnd = (event, connectionState) => {
      edge=false

      if (connectionState.isValid) return;

        const id = getId()
        const initiatingNodeId = connectionState.fromNode?.id ?? '0';
        const initiatingHandleId = connectionState.fromHandle?.id ?? 'right';
        const sourceOrTarget:string = connectionState.fromHandle?.type ?? 'source'
        const { clientX, clientY } = 'changedTouches' in event ? event.changedTouches[0] : event;
        const nodePosition:XYPosition = screenToFlowPosition({x:clientX,y:clientY})
        console.log(indexMiddleNode)


        if (initiatingHandleId === 'right'|| initiatingHandleId=== 'left') {
          const indexMiddleNode = getindexMiddleNode()


          $trueNodes[parseInt(initiatingNodeId)].data.spouse.push(indexMiddleNode) //updateSpouse
          $trueNodes.push(createNode('customNode',nodePosition,id,Array(indexMiddleNode)))
          $edges.push(createEdge(sourceOrTarget,initiatingNodeId,id,initiatingHandleId))

          $nodesForEdge.push(createNode('middleNode',getCenterBetweenNodes(nodePosition,$nodes[parseInt(initiatingNodeId)].position),undefined,Array(initiatingNodeId,id)))

          $nodes=$trueNodes.concat($nodesForEdge)
          $edges = $edges;
          return;
        }
        if (initiatingHandleId === 'top'){
          const indexMiddleNode = getindexMiddleNode()
          const id = getId();
          console.log(id)
          const previousId = (parseInt(id)-1).toString()
          $trueNodes.push(createNode('customNode',{x:nodePosition.x+80,y:nodePosition.y},previousId,Array(indexMiddleNode)))
        
          $trueNodes.push(createNode('customNode',{x:nodePosition.x-80,y:nodePosition.y},id,Array(indexMiddleNode)))
          $edges.push(createEdge(sourceOrTarget,initiatingNodeId,`Node ${previousId}--${id}`,initiatingHandleId))

          $edges.push(createEdge(sourceOrTarget,previousId,id,'left'))
          $nodesForEdge.push(createNode('middleNode',nodePosition,undefined,Array(previousId,id,initiatingNodeId)))

          $nodes=$trueNodes.concat($nodesForEdge)
          $edges = $edges;
          return;
        }
        const newNode = createNode('customNode',nodePosition,id,[])
        $trueNodes.push(newNode)
        $nodes=$trueNodes.concat($nodesForEdge)
        $edges.push(createEdge(sourceOrTarget,initiatingNodeId,id,initiatingHandleId))

        $edges = $edges;
    } 

  

	function onClickedNode(e: CustomEvent<{ node: Node<Record<string, unknown>, string>; event: MouseEvent | TouchEvent; }>): void {
    console.log('open')
    document.getElementsById("sidenav").style.width = "250px";
	}
</script>
   
  <svelte:window {onkeydown} {onmousemove}/>
  <div class="wrapper" bind:contentRect={rect}>
  <div id= 'sidenav' class='sidenav'/>

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
      on:nodeclick={onClickedNode}
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

    :global(.sidenav) {
      height: 100%; /* 100% Full-height */
      width: 0; /* 0 width - change this with JavaScript */
      position: fixed; /* Stay in place */
      z-index: 1; /* Stay on top */
      top: 0; /* Stay at the top */
      left: 0;
      background-color: #111; /* Black*/
      overflow-x: hidden; /* Disable horizontal scroll */
      padding-top: 60px; /* Place content 60px from the top */
      transition: 0.5s; /* 0.5 second transition effect to slide in the sidenav */
    }
  </style>