<script lang="ts">
import {T} from "@threlte/core";
import {sceneState} from "$/lib/client/types/SceneState.svelte";
import { DraggerAgainstZPlane } from "$/lib/client/types/DraggerAgainstZPlane.svelte";
    import ZAxisMovementIndicator from "./AxisMovementIndicator.svelte";
    import { Matrix4, Vector3 } from "three";
    import { type IntersectionEvent } from "@threlte/extras";

let {
    position,
    onPositionDrag,
    onPositionChange,
    onExtrude,
    onSelect,
    meshLineScaleFac = 1,
    groupMatrix,
}: {
    position: [number, number, number],
    onPositionDrag?: (position: Vector3) => void,
    onPositionChange?: (position: Vector3) => void,
    onExtrude?: () => void,
    onSelect?: () => void,
    meshLineScaleFac?: number,
    groupMatrix: Matrix4,
} = $props();

const dragger = new DraggerAgainstZPlane({
    sceneState,
    onPositionDrag,
    onPositionChange,
    onSelect: () => {
        selected = true;
        onSelect?.();
    },
});

const {onPointerEnter, onPointerLeave, onPointerDown, onPointerMove, onPointerUp} = dragger;

let selected = $state(false);

const color = $derived.by(() => {
    if (selected) {
        return "#88a";
    }

    if (dragger.hovering) {
        return "#f00";
    }

    return "#fff";
});
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
    <T.BoxGeometry args={[0.025, 0.025, 0.025]} />
    <T.MeshToonMaterial emissive={color} />
</T.Mesh>