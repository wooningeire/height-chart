<script lang="ts">
import { SceneState } from "$/routes/SceneState.svelte";
import {T} from "@threlte/core";
import { useCursor, type IntersectionEvent } from "@threlte/extras";
import { getContext } from "svelte";
import {sceneState} from "./SceneState.svelte";
    import { Raycaster, Vector2, Vector3 } from "three";

let {
    position,
    onPositionDrag,
    onPositionChange,
}: {
    position: [number, number, number],
    onPositionDrag?: (position: [number, number, number]) => void,
    onPositionChange?: (position: [number, number, number]) => void,
} = $props();


let hovering = $state(false);
let dragging = $state(false);

const onPointerDown = (event: IntersectionEvent<PointerEvent>) => {
    if (event.nativeEvent.button !== 0) return;

    sceneState.cameraControlsEnabled = false;
    dragging = true;
};

const zPlaneCoords = (event: PointerEvent): [number, number, number] => {
    const planeNormal = new Vector3(0, 0, 1);
    const planePoint = new Vector3(0, 0, 0);
    const raycaster = new Raycaster();

    // Convert mouse position to normalized device coordinates (-1 to +1)
    const mouse = new Vector2(
        (event.clientX / innerWidth) * 2 - 1,
        -(event.clientY / innerHeight) * 2 + 1
    );

    raycaster.setFromCamera(mouse, sceneState.camera);

    // Calculate intersection with z=0 plane
    const denominator = planeNormal.dot(raycaster.ray.direction);
    if (Math.abs(denominator) <= Number.EPSILON) return [0, 0, 0];

    const t = -planeNormal.dot(raycaster.ray.origin.clone().sub(planePoint)) / denominator;
    const intersection = raycaster.ray.origin.clone().add(raycaster.ray.direction.clone().multiplyScalar(t));
    console.log(mouse, '\n', intersection);

    return [intersection.x, intersection.y, 0];
};

const onPointerMove = (event: PointerEvent) => {
    onPositionDrag?.(zPlaneCoords(event));
};

const onPointerUp = (event: PointerEvent) => {
    if (event.button !== 0) return;

    sceneState.cameraControlsEnabled = true;
    dragging = false;

    onPositionChange?.(zPlaneCoords(event));
};

const {onPointerEnter: setEnterCursor, onPointerLeave: setLeaveCursor} = useCursor();
</script>

<svelte:window
    onpointerup={event => dragging && onPointerUp(event)}
    onpointermove={event => dragging && onPointerMove(event)}
/>

<T.Mesh
    {position}
    onpointerenter={() => {
        hovering = true;
        setEnterCursor();
    }}
    onpointerleave={() => {
        hovering = false;
        setLeaveCursor();
    }}
    onpointerdown={onPointerDown}
>
    <T.BoxGeometry args={[0.05, 0.05, 0.05]} />
    <T.MeshToonMaterial emissive={hovering ? "#f00" : "#fff"} />
</T.Mesh>