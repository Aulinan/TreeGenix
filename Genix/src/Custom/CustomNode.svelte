<script lang="ts">
    import { Handle, Position, type NodeProps } from '@xyflow/svelte';
    import Person from '../types/Person.svelte'

   
    type $$Props = NodeProps;
    export let isConnectable: $$Props['isConnectable'];
    export let data: Record<string,Person>;

    const {person}:Record<string,unknown> = data

    console.log(person)
  
  </script>
  
  <div class={`customNode ${person.gender}`}>
      <span>{person.name}</span>
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
      height: 100px;
      width: 100px;
      justify-content: center;
      align-items: center;
      display: flex;
    }
      .male {
    border-radius: 0.125rem;
  }

    .female {
      border-radius: 100%;
    }
  </style>