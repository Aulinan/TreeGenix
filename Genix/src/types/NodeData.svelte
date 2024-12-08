<script lang="ts" context="module">
    import {type Person} from './Person';

    export type NodeData = {
        id:string;
        position:{x:number,y:number};
        connections:string;
        person:Person;
    }

</script>