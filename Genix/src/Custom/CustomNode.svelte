<script lang="ts">
    import { Handle, Position, type NodeProps } from '@xyflow/svelte';
    import type {Person} from '../types/Person.'

   
    type $$Props = NodeProps;
    export let isConnectable: $$Props['isConnectable'];
    export let data;

    const {index}:number = data
    const {person}:Record<string,unknown> = data
    const {spouse}:Array<string> = data

    console.log(person)
  
  </script>
  
  <div 
    class='customNode'
    class:male={person.gender==='male'}
    class:female={person.gender==='female'}>
      <span>{person.name}</span>
    <Handle
      type='source' 
      position={Position.Right} 
      id='right'  
      style="background: #555;" 
      {isConnectable} />
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

  </div>

   
  <style>

    .customNode {
      background: #eee;
      height: 80px;
      width: 80px;
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