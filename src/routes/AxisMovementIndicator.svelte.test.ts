import { describe, it, expect } from "vitest";
import { render } from "@threlte/test";
import AxisMovementIndicator from "./AxisMovementIndicator.svelte";
import type { IDraggerAgainstZPlane } from "$/lib/types/DraggerAgainstZPlane.svelte";
import type { Object3D } from "three";

describe("AxisMovementIndicator", () => {
    it("renders indicators when hovering", () => {
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

        const mesh = scene.children.find((o: Object3D) => o.type === "Mesh");
        expect(mesh).toBeDefined();
    });

    it("renders indicators when not hovering", () => {
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

        const mesh = scene.children.find((o: Object3D) => o.type === "Mesh");
        expect(mesh).toBeDefined();
    });
});



