<script lang="ts">
import {T} from "@threlte/core";
import {sceneState} from "../lib/types/SceneState.svelte";
import { DraggerAgainstZPlane } from "$/lib/types/DraggerAgainstZPlane.svelte";
    import ZAxisMovementIndicator from "./AxisMovementIndicator.svelte";
    import { Matrix4, Vector3 } from "three";

let {
    position,
    onPositionDrag,
    onPositionChange,
    meshLineScaleFac = 1,
    groupMatrix,
}: {
    position: [number, number, number],
    onPositionDrag?: (position: Vector3) => void,
    onPositionChange?: (position: Vector3) => void,
    meshLineScaleFac?: number,
    groupMatrix: Matrix4,
} = $props();

const dragger = new DraggerAgainstZPlane({
    sceneState,
    onPositionDrag,
    onPositionChange,
});

const {onPointerEnter, onPointerLeave, onPointerDown, onPointerMove, onPointerUp} = dragger;
</script>

<svelte:window
    onpointerup={event => onPointerUp(position, groupMatrix, event)}
    onpointermove={event => onPointerMove(position, groupMatrix, event)}
/>

<ZAxisMovementIndicator
    {position}
    {dragger}
    {meshLineScaleFac}
/>

<T.Mesh
    {position}
    onpointerenter={onPointerEnter}
    onpointerleave={onPointerLeave}
    onpointerdown={onPointerDown}
>
    <T.BoxGeometry args={[0.025, 0.025, 0.025]} />
    <T.MeshToonMaterial emissive={dragger.hovering ? "#f00" : "#fff"} />
</T.Mesh>