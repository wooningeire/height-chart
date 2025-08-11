import { describe, it, expect } from "vitest";
import { render } from "@threlte/test";
import AxisMovementIndicator from "./AxisMovementIndicator.svelte";
import type { IDraggerAgainstZPlane } from "$/lib/types/DraggerAgainstZPlane.svelte";
import type { Object3D } from "three";

describe("AxisMovementIndicator", () => {
    it("renders X and Y indicators when hovering", () => {
        const dragger: IDraggerAgainstZPlane = {
            hovering: true,
            dragging: false,
            isMovingAlongZAxis: false,
        };

        const { scene } = render(AxisMovementIndicator, {
            position: [0, 0, 0],
            dragger,
            meshLineScaleFac: 1,
        });

        const meshX = scene.getObjectByName("axis-movement-indicator-x");
        expect(meshX).toBeDefined();

        const meshY = scene.getObjectByName("axis-movement-indicator-y");
        expect(meshY).toBeDefined();

        const meshZ = scene.getObjectByName("axis-movement-indicator-z");
        expect(meshZ).toBeUndefined();
    });

    it("renders Z and Y indicators when hovring while moving along Z axis", () => {
        const dragger: IDraggerAgainstZPlane = {
            hovering: true,
            dragging: false,
            isMovingAlongZAxis: true,
        };

        const { scene } = render(AxisMovementIndicator, {
            position: [0, 0, 0],
            dragger,
            meshLineScaleFac: 1,
        });

        const meshX = scene.getObjectByName("axis-movement-indicator-x");
        expect(meshX).toBeUndefined();

        const meshY = scene.getObjectByName("axis-movement-indicator-y");
        expect(meshY).toBeDefined();

        const meshZ = scene.getObjectByName("axis-movement-indicator-z");
        expect(meshZ).toBeDefined();
    });

    it("renders no indicators when not hovering", () => {
        const dragger: IDraggerAgainstZPlane = {
            hovering: false,
            dragging: false,
            isMovingAlongZAxis: false,
        };

        const { scene } = render(AxisMovementIndicator, {
            position: [0, 0, 0],
            dragger,
            meshLineScaleFac: 1,
        });

        const meshX = scene.getObjectByName("axis-movement-indicator-x");
        expect(meshX).toBeUndefined();

        const meshY = scene.getObjectByName("axis-movement-indicator-y");
        expect(meshY).toBeUndefined();

        const meshZ = scene.getObjectByName("axis-movement-indicator-z");
        expect(meshZ).toBeUndefined();
    });
});



