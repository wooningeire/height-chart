<script lang="ts">
import {T} from "@threlte/core";
import {sceneState} from "../lib/types/SceneState.svelte";
import { DraggerAgainstZPlane } from "$/lib/types/DraggerAgainstZPlane.svelte";

let {
    position,
    onPositionDrag,
    onPositionChange,
}: {
    position: [number, number, number],
    onPositionDrag?: (position: [number, number, number]) => void,
    onPositionChange?: (position: [number, number, number]) => void,
} = $props();

const {onPointerEnter, onPointerLeave, onPointerDown, onPointerMove, onPointerUp, hovering} = new DraggerAgainstZPlane({
    sceneState,
    onPositionDrag,
    onPositionChange,
});
</script>

<svelte:window
    onpointerup={onPointerUp}
    onpointermove={onPointerMove}
/>

<T.Mesh
    {position}
    onpointerenter={onPointerEnter}
    onpointerleave={onPointerLeave}
    onpointerdown={onPointerDown}
>
    <T.BoxGeometry args={[0.05, 0.05, 0.05]} />
    <T.MeshToonMaterial emissive={hovering ? "#f00" : "#fff"} />
</T.Mesh>