<script lang='ts'>
import {
    type Node,
    } from '@xyflow/svelte';

import {nodes,trueNodes} from '../shared.svelte';
import {base} from '../Custom/basePerson.svelte'

const initialNode: Node = 
      {
        id: '0',
        type: 'customNode',
        data: { index:0,person:base ,spouse:[]},
        position: { x: 0, y: 0 },
        origin : [0.5,0.5],
      };

$trueNodes.push(initialNode)
$nodes=$trueNodes
</script>