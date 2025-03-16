<script lang="ts">
    import { type Node,SvelteFlowProvider } from '@xyflow/svelte';
    import Flow from '../Flow.svelte'
    import {nodes,edges, trueNodes, updateNodes} from '$lib/nodeStore.svelte'
	  import { onMount } from 'svelte';
    

    let node:Node|undefined
    let newName=''

    $ : updateNodes(newName,node)

    function nodeClicked(clickedNode:Node) {
      node=clickedNode
      document.getElementById("mySidenav").style.width = "250px";
      
    }

    /* Set the width of the side navigation to 0 */
    function closeNav() {
      document.getElementById("mySidenav").style.width = "0";
    }

    function onChanged(e:any){
      if (node===undefined) return;
      node.data = {...node.data,person:node.data.person}
     
    }

    



    
  </script>
   
  <!-- You need the SvelteFlowProvider so you can useSvelteFlow  -->

  {#if node!==undefined}
    <div id="mySidenav" class="sidenav">
      <form>
        <input name='name' type='text' value={newName} oninput={(evt) => (newName = evt.target?.value)}/>
        <input name='dateOfBirth'type='date' bind:value={node.data.person.dateOfBirth} /><br>
        <input id='male'name='gender' type='radio' value='male' bind:group={node.data.person.gender} />
        <label for='male'>male</label>
        <input id='female' name='gender' type='radio' value='female' bind:group={node.data.person.gender} />
        <label for='female' >female</label><br>
        <div>illnesses</div>
      {#each node.data.person.ailments as illness}
        <input name='ailments'type='text' bind:value={illness} />
      {/each}
        <input type='text'/>
        <button type='button'>aggiungi</button>
        <input name='deceased' type='checkbox' bind:checked={node.data.person.deceased} />
        <label for="deceased">deceased</label>
        <p></p>
     </form>

    </div>
  {/if}
    
    <!-- Use any element to open the sidenav -->
  <SvelteFlowProvider>
    <Flow {nodeClicked} />
  </SvelteFlowProvider>

  <style>  
  .sidenav {
  height: 100%; /* 100% Full-height */
  width: 0; /* 0 width - change this with JavaScript */
  position: fixed; /* Stay in place */
  z-index: 1; /* Stay on top */
  top: 0; /* Stay at the top */
  left: 0;
  background-color: #eee; /* Black*/
  overflow-x: hidden; /* Disable horizontal scroll */
  padding-top: 60px; /* Place content 60px from the top */
  transition: 0.5s; /* 0.5 second transition effect to slide in the sidenav */
}
  </style>