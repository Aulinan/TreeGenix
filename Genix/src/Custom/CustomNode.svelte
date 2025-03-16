<script lang="ts">
    import { Handle, Position, type NodeProps } from '@xyflow/svelte';

   
    type $$Props = NodeProps;
    export let isConnectable: $$Props['isConnectable'];
    export let data;
    let colors = ["#FF0000", "#00FF00", "#0000FF"]
    

    const {label}:Record<string,unknown> = data
    const {person}:Record<string,unknown> = data


    function getGradient(ailments: string[], colors: string[]): string {
        if (ailments.length < 1) return '#eee 0%, #eee 100%'
        const step = 100 / ailments.length; // Percentuale per ogni colore
        return ailments
            .map((_, i) => `${colors[i]} ${i * step}%, ${colors[i]} ${(i + 1) * step}%`)
            .join(", ");
    }
  
  </script>
  
  <div 
    class='customNode'
    class:male={person.gender==='male'}
    class:female={person.gender==='female'}
    style="--colors: {getGradient(person.ailments, colors)}">
    <span>{label}</span>
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
      height: 80px;
      width: 80px;
      justify-content: center;
      align-items: center;
      display: flex;
      background: conic-gradient(
            from 0deg,
            var(--colors)
        );
    }
      .male {
    border-radius: 0.125rem;
  }

    .female {
      border-radius: 100%;
    }
  </style>