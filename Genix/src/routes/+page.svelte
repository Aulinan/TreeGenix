<script lang="ts">
    import { SvelteFlowProvider } from '@xyflow/svelte';
    import Flow from '../Flow.svelte'

    function openNav() {
      document.getElementById("mySidenav").style.width = "250px";
    }

    /* Set the width of the side navigation to 0 */
    function closeNav() {
      document.getElementById("mySidenav").style.width = "0";
    }
  </script>
   
  <!-- You need the SvelteFlowProvider so you can useSvelteFlow  -->


    <div id="mySidenav" class="sidenav">
    </div>
    
    <!-- Use any element to open the sidenav -->
  <button onclick={openNav}>open</button>
  <SvelteFlowProvider>
    <Flow {openNav} />
  </SvelteFlowProvider>

  <style>
  .sidenav {
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