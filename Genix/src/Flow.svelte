<script lang="ts">
    import {
		nodes,
		trueNodes,
		middleNodes,
		edges,
		initializeApplication,
		createSpouseNode,
		createParentsNode,
		createChildNode
	} from '$lib/nodeStore.svelte';

    import { isMiddleNode, getCenterBetweenNodes, getMiddleNodeIndexFromId } from '$lib/nodeUtils';
    import { hasSpouses } from '$lib/personUtils';
    
    import {
      SvelteFlow,
      useSvelteFlow,
      Background,
      type Node,
      type OnConnectEnd,
      type OnConnectStart,
      ConnectionLineType,
      MiniMap,
      Controls,
      } from '@xyflow/svelte';
   
    
    import '@xyflow/svelte/dist/style.css';


    import CustomNode from './Custom/CustomNode.svelte'
    import MiddleNode from './Custom/middleNode.svelte';  

    /*------------------------------initial declarations----------------------------------*/

    const snapGrid: [number, number] = [40,40];

    const nodeTypes = {
        customNode : CustomNode,
        middleNode : MiddleNode
    };

    let rect: DOMRectReadOnly;
   
    const { screenToFlowPosition } = useSvelteFlow();

    initializeApplication();

 /*-----------------------------------------end declarations----------------------------------*/

    const onChangedPosition = (event:CustomEvent) => {
      if (
			isMiddleNode(event.detail.targetNode) ||
			event.detail.targetNode.data.spouses === undefined ||
			hasSpouses(event.detail.targetNode.data) === false
		)
			return;

      event.detail.targetNode.data.spouses.forEach((middleNodeId:string) => {
			const middleNodeIndex = getMiddleNodeIndexFromId(middleNodeId);
			const middleNode: Node = $middleNodes[middleNodeIndex];
			const parentIndexes = [...(middleNode.data.spouses as ReadonlyArray<string>)].map(
				(indexAsString) => parseInt(indexAsString)
			);

      const firstParentNodeIndex = parentIndexes[0];
			const secondParentNodeIndex = parentIndexes[1];

			const firstParent = $trueNodes[firstParentNodeIndex];
			const secondParent = $trueNodes[secondParentNodeIndex];

			$middleNodes = $middleNodes.map((currentMiddleNode, index) => {
				if (index !== middleNodeIndex) {
					return currentMiddleNode;
				}

				return {
					...currentMiddleNode,
					position: getCenterBetweenNodes(firstParent.position, secondParent.position)
				};
			});
		});
	};

    const handleConnectStart: OnConnectStart = (event,params)=> {
      console.log(event)
    }
   
    const handleConnectEnd: OnConnectEnd = (event, connectionState) => {

      if (connectionState.isValid) return;

        const startingNodeId = connectionState.fromNode?.id;
        const initiatingHandleId = connectionState.fromHandle?.id;
        const sourceOrTarget = connectionState.fromHandle?.type;

      if (
        startingNodeId === undefined ||
        initiatingHandleId === undefined ||
        sourceOrTarget === undefined
		  ) return;

        const { clientX, clientY } = 'changedTouches' in event ? event.changedTouches[0] : event;
        const newNodePosition = screenToFlowPosition({x:clientX,y:clientY})
        
        const startingNode = $trueNodes[parseInt(startingNodeId)];

      switch(initiatingHandleId) {
        case 'right':
        case 'left' :
          createSpouseNode(startingNode, newNodePosition, sourceOrTarget);
        break;
        case 'top':
          createParentsNode(startingNodeId,newNodePosition)
        break;
        case 'bottom':
          createChildNode(startingNodeId,newNodePosition)
        break;
      }}
  

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