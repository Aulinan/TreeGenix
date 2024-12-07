import type { XYPosition } from "@xyflow/svelte"
export default function getCenterBetweenNodes(target:XYPosition,source:XYPosition):XYPosition{
    const position:XYPosition= {x:(target.x+source.x)/2,y:(target.y+source.y)/2}
    return position
}