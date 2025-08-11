import { describe, it, expect, vi, beforeEach } from "vitest";
import { DraggerAgainstZPlane } from "$/lib/types/DraggerAgainstZPlane.svelte";
import { SceneState } from "$/lib/types/SceneState.svelte";
import { Matrix4, PerspectiveCamera, Vector3 } from "three";
import { modifierKeys } from "$/routes/ModifierKeys.svelte";

vi.mock("@threlte/extras", () => ({
    useCursor: () => ({ onPointerEnter: () => {}, onPointerLeave: () => {} })
}));

describe("DraggerAgainstZPlane", () => {
    beforeEach(() => {
        modifierKeys.ctrl = false;
        modifierKeys.alt = false;
        modifierKeys.shift = false;
        modifierKeys.meta = false;
    });

    it("invokes drag and change callbacks and toggles dragging state", () => {
        const sceneState = new SceneState();
        sceneState.camera = new PerspectiveCamera(50, 1, 0.1, 100);
        sceneState.camera.position.set(0, 0, 5);
        sceneState.camera.lookAt(0, 0, 0);
        sceneState.camera.updateMatrixWorld();

        const onPositionDrag = vi.fn();
        const onPositionChange = vi.fn();

        const dragger = new DraggerAgainstZPlane({
            sceneState,
            onPositionDrag,
            onPositionChange
        });

        dragger.onPointerDown({ button: 0, clientX: 0, clientY: 0 });
        expect(dragger.pointerDownPosition).toEqual({ x: 0, y: 0 });

        const groupMatrix = new Matrix4();
        dragger.onPointerMove([0, 0, 0], groupMatrix, { clientX: 10, clientY: 10 });
        expect(dragger.dragging).toBe(true);
        expect(onPositionDrag).toHaveBeenCalled();

        dragger.onPointerUp([0, 0, 0], groupMatrix, { button: 0, clientX: 10, clientY: 10 });
        expect(dragger.dragging).toBe(false);
        expect(onPositionChange).toHaveBeenCalled();
        expect(sceneState.cameraControlsEnabled).toBe(true);
    });

    it("switches movement mode based on ctrl (Z-axis vs Z-plane)", () => {
        const sceneState = new SceneState();
        sceneState.camera = new PerspectiveCamera(50, 1, 0.1, 100);
        sceneState.camera.position.set(5, 5, 5);
        sceneState.camera.updateMatrixWorld();

        const loggedPositions: Vector3[] = [];
        const onPositionDrag = (position: Vector3) => {
            loggedPositions.push(position);
        };

        const dragger = new DraggerAgainstZPlane({ sceneState, onPositionDrag });
        const groupMatrix = new Matrix4();
        const base: [number, number, number] = [0, 0, 0];

        dragger.onPointerDown({ button: 0, clientX: 50, clientY: 50 });
        dragger.onPointerMove(base, groupMatrix, { clientX: 100, clientY: 100 });
        dragger.onPointerUp(base, groupMatrix, { button: 0, clientX: 100, clientY: 100 });

        modifierKeys.ctrl = true;

        dragger.onPointerDown({ button: 0, clientX: 50, clientY: 50 });
        dragger.onPointerMove(base, groupMatrix, { clientX: 100, clientY: 100 });
        dragger.onPointerUp(base, groupMatrix, { button: 0, clientX: 100, clientY: 100 });

        expect(loggedPositions.length).toBe(2);
        expect(loggedPositions[0]).not.toEqual(loggedPositions[1]);
    });
});


