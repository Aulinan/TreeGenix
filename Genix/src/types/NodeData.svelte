<script lang="ts" context="module">
    import Person from './Person.svelte';

    export type NodeData = {
        id:string;
        position:{x:number,y:number};
        connections:string;
        person:Person;
    }

</script>