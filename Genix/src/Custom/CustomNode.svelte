<script lang="ts">
    import { Handle, Position, type NodeProps } from '@xyflow/svelte';
   
    type $$Props = NodeProps;
   
    export let isConnectable: $$Props['isConnectable'];
    export let data: $$Props['data'];
  

    const {label} = data
  
    
  </script>
  
  <div class='customNode'>
      <span>{label}</span>
  <Handle type='source' position={Position.Right} id='right'  style="background: #555;" {isConnectable} />
    <Handle
      type="target"
      position={Position.Left}
      id="left"
      style="background: #555;"
      {isConnectable}
    />
    <Handle
      type="target"
      position={Position.Top}
      id="top"
      style="background: #555;"
      {isConnectable}
    />
    <Handle
    type="source"
    position={Position.Bottom}
    id="bottom"
    style="background: #555;"
    {isConnectable}
    />
  </div>

   
  <style>
      .customNode {
    background: #eee;
    border-radius: 0.125rem;
    height: 100px;
    width: 100px;
    justify-content: center;
    align-items: center;
    display: flex;
  
  }
  </style>