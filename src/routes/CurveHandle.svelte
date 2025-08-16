<script lang="ts">
import { DraggerAgainstZPlane } from "$/lib/client/types/DraggerAgainstZPlane.svelte";
import { sceneState } from "$/lib/client/types/SceneState.svelte";
import {T} from "@threlte/core";
import { type IntersectionEvent } from "@threlte/extras";
import { Matrix4, Vector3 } from "three";
import ZAxisMovementIndicator from "./AxisMovementIndicator.svelte";

let {
    position,
    onPositionDrag,
    onPositionChange,
    onSelect,
    meshLineScaleFac = 1,
    groupMatrix,
}: {
    position: [number, number, number],
    onPositionDrag?: (position: Vector3) => void,
    onPositionChange?: (position: Vector3) => void,
    onSelect?: () => void,
    meshLineScaleFac?: number,
    groupMatrix: Matrix4,
} = $props();

const dragger = new DraggerAgainstZPlane({
    sceneState,
    onPositionDrag,
    onPositionChange,
    onSelect,
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
    onpointerdown={(event: IntersectionEvent<PointerEvent>) => onPointerDown(event.nativeEvent)}
>
    <T.SphereGeometry args={[0.0125]} />
    <T.MeshToonMaterial emissive={dragger.hovering ? "#f00" : "#fff"} />
</T.Mesh>