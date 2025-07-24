import { SceneState } from "$/lib/types/SceneState.svelte";
import { useCursor, type IntersectionEvent } from "@threlte/extras";
import { Raycaster, Vector2, Vector3 } from "three";

export class DraggerAgainstZPlane {
    readonly sceneState = $state<SceneState>()!;
    readonly onPositionDrag?: (position: [number, number, number]) => void;
    readonly onPositionChange?: (position: [number, number, number]) => void;

    hovering = $state(false);
    dragging = $state(false);

    onPointerEnter = () => {
        this.hovering = true;
        this.#setEnterCursor();
    };

    onPointerLeave = () => {
        this.hovering = false;
        this.#setLeaveCursor();
    };

    onPointerDown = (event: IntersectionEvent<PointerEvent>) => {
        if (event.nativeEvent.button !== 0) return;

        this.sceneState.cameraControlsEnabled = false;
        this.dragging = true;
    };

    zPlaneCoords = (event: PointerEvent): [number, number, number] => {
        const planeNormal = new Vector3(0, 0, 1);
        const planePoint = new Vector3(0, 0, 0);
        const raycaster = new Raycaster();

        // Convert mouse position to normalized device coordinates (-1 to +1)
        const mouse = new Vector2(
            (event.clientX / innerWidth) * 2 - 1,
            -(event.clientY / innerHeight) * 2 + 1
        );

        raycaster.setFromCamera(mouse, this.sceneState.camera);

        // Calculate intersection with z=0 plane
        const denominator = planeNormal.dot(raycaster.ray.direction);
        if (Math.abs(denominator) <= Number.EPSILON) return [0, 0, 0];

        const t = -planeNormal.dot(raycaster.ray.origin.clone().sub(planePoint)) / denominator;
        const intersection = raycaster.ray.origin.clone().add(raycaster.ray.direction.clone().multiplyScalar(t));

        return [intersection.x, intersection.y, 0];
    };

    onPointerMove = (event: PointerEvent) => {
        if (!this.dragging) return;

        this.onPositionDrag?.(this.zPlaneCoords(event));
    };

    onPointerUp = (event: PointerEvent) => {
        if (!this.dragging || event.button !== 0) return;

        this.sceneState.cameraControlsEnabled = true;
        this.dragging = false;

        this.onPositionChange?.(this.zPlaneCoords(event));
    };
    
    #setEnterCursor: () => void;
    #setLeaveCursor: () => void;

    constructor({
        sceneState,
        onPositionDrag,
        onPositionChange,
    }: {
        sceneState: SceneState,
        onPositionDrag?: (position: [number, number, number]) => void,
        onPositionChange?: (position: [number, number, number]) => void,
    }) {
        this.sceneState = sceneState;
        this.onPositionDrag = onPositionDrag;
        this.onPositionChange = onPositionChange;
        
        ({
            onPointerEnter: this.#setEnterCursor,
            onPointerLeave: this.#setLeaveCursor,
        } = useCursor());
    }
}