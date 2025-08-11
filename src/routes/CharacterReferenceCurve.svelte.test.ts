import { describe, it, expect, vi } from "vitest";
import { render } from "@threlte/test";
import CharacterReferenceCurve from "./CharacterReferenceCurve.svelte";
import { Bezier } from "$/lib/types/Bezier.svelte";
import { Matrix4, Vector3 } from "three";

const createCurve = () => [
    new Bezier({ start: new Vector3(0, 0, 0), end: new Vector3(1, 0, 0) })
];

describe("CharacterReferenceCurve", () => {
    it("renders without errors and creates mesh geometry", () => {
        const curve = createCurve();
        const groupMatrix = new Matrix4();

        const { scene } = render(CharacterReferenceCurve, {
            curve,
            groupMatrix,
            meshLineScaleFac: 1,
            showEditor: false
        });

        const mesh = scene.children.find((o: any) => o.type === "Mesh");
        expect(mesh).toBeDefined();
    });
});



