<script lang="ts">
    import { Handle, Position, type NodeProps } from '@xyflow/svelte';

    //put is not selectable
   
    type $$Props = NodeProps;
    export let isConnectable: $$Props['isConnectable'];
    export let data:$$Props['data'];

    const {index} = data
  </script>
  
 <div class="nodrag">
  <div class="customNode">
    <Handle
      type="source"
      position={Position.Bottom}
      id="bottom"
      style="background: #555;"
      {isConnectable}
    />
  </div>
</div> 
   
  <style>

    .customNode {
      background: #eee;
      height: 10px;
      width: 10px;
      justify-content: center;
      align-items: center;
      display: flex;
    }
  </style>