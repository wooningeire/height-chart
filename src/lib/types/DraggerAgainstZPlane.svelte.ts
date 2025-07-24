import { SceneState } from "$/lib/types/SceneState.svelte";
import { modifierKeys } from "$/routes/ModifierKeys.svelte";
import { useCursor, type IntersectionEvent } from "@threlte/extras";
import { Camera, Matrix4, Raycaster, Vector2, Vector3 } from "three";


const raycast = (planeNormal: Vector3, planePoint: Vector3, clientX: number, clientY: number, camera: Camera) => {
    const raycaster = new Raycaster();

    // Convert mouse position to normalized device coordinates (-1 to +1)
    const mouse = new Vector2(
        (clientX / innerWidth) * 2 - 1,
        -(clientY / innerHeight) * 2 + 1
    );

    raycaster.setFromCamera(mouse, camera);

    // Calculate intersection with plane
    const denominator = planeNormal.dot(raycaster.ray.direction);
    if (Math.abs(denominator) <= Number.EPSILON) return planePoint;

    const t = -planeNormal.dot(raycaster.ray.origin.clone().sub(planePoint)) / denominator;
    const intersection = raycaster.ray.origin.clone().add(raycaster.ray.direction.clone().multiplyScalar(t));

    return intersection;
};

export class DraggerAgainstZPlane {
    readonly sceneState = $state<SceneState>()!;
    readonly onPositionDrag?: (position: Vector3) => void;
    readonly onPositionChange?: (position: Vector3) => void;

    hovering = $state(false);
    dragging = $state(false);

    readonly isMovingAlongZAxis = $derived(modifierKeys.ctrl);

    readonly onPointerEnter = () => {
        this.hovering = true;
        this.#setEnterCursor();
    };

    readonly onPointerLeave = () => {
        this.hovering = false;
        this.#setLeaveCursor();
    };

    readonly onPointerDown = (event: IntersectionEvent<PointerEvent>) => {
        if (event.nativeEvent.button !== 0) return;

        this.sceneState.cameraControlsEnabled = false;
        this.dragging = true;
    };

    readonly zAxisCoords = (currentPosition: [number, number, number], groupMatrix: Matrix4, event: PointerEvent): Vector3 => {
        const planeNormal = new Vector3(1, 0, 0);
        const planePoint = new Vector3(...currentPosition).applyMatrix4(groupMatrix);
        
        const intersection = raycast(planeNormal, planePoint, event.clientX, event.clientY, this.sceneState.camera);

        return new Vector3(planePoint.x, intersection.y, intersection.z).applyMatrix4(groupMatrix.clone().invert());
    };

    readonly zPlaneCoords = (currentPosition: [number, number, number], groupMatrix: Matrix4, event: PointerEvent): Vector3 => {
        const planeNormal = new Vector3(0, 0, 1);
        const planePoint = new Vector3(...currentPosition).applyMatrix4(groupMatrix);

        const intersection = raycast(planeNormal, planePoint, event.clientX, event.clientY, this.sceneState.camera);

        return new Vector3(intersection.x, intersection.y, planePoint.z).applyMatrix4(groupMatrix.clone().invert());
    };

    readonly onPointerMove = (currentPosition: [number, number, number], groupMatrix: Matrix4, event: PointerEvent) => {
        if (!this.dragging) return;

        const newCoords = this.isMovingAlongZAxis
            ? this.zAxisCoords(currentPosition, groupMatrix, event)
            : this.zPlaneCoords(currentPosition, groupMatrix, event);

        this.onPositionDrag?.(newCoords);
    };

    readonly onPointerUp = (currentPosition: [number, number, number], groupMatrix: Matrix4, event: PointerEvent) => {
        if (!this.dragging || event.button !== 0) return;

        this.sceneState.cameraControlsEnabled = true;
        this.dragging = false;

        const newCoords = this.isMovingAlongZAxis
            ? this.zAxisCoords(currentPosition, groupMatrix, event)
            : this.zPlaneCoords(currentPosition, groupMatrix, event);

        this.onPositionChange?.(newCoords);
    };
    
    readonly #setEnterCursor: () => void;
    readonly #setLeaveCursor: () => void;

    constructor({
        sceneState,
        onPositionDrag,
        onPositionChange,
    }: {
        sceneState: SceneState,
        onPositionDrag?: (position: Vector3) => void,
        onPositionChange?: (position: Vector3) => void,
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