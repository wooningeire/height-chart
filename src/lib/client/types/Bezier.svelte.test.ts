import { describe, it, expect } from "vitest";
import { Bezier } from "$/lib/client/types/Bezier.svelte";
import { CubicBezierCurve3, Vector3 } from "three";

describe("Bezier", () => {
    it("creates a CubicBezierCurve3 and computes arc length", () => {
        const bezier = new Bezier({
            start: new Vector3(0, 0, 0),
            end: new Vector3(1, 0, 0)
        });

        expect(bezier.ref).toBeInstanceOf(CubicBezierCurve3);
        expect(bezier.arcLength).toBeCloseTo(1);
    });
});


