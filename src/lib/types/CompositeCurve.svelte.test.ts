import { describe, it, expect } from "vitest";
import { CompositeCurve } from "$/lib/types/CompositeCurve.svelte";
import { Bezier } from "$/lib/types/Bezier.svelte";
import { Vector3 } from "three";

describe("CompositeCurve", () => {
    it("computes arcLength correctly", () => {
        const segments = [
            new Bezier({ start: new Vector3(0, 0, 0), end: new Vector3(1, 0, 0) }),
            new Bezier({ start: new Vector3(1, 0, 0), end: new Vector3(1, 1, 1) }),
        ];
        const curve = new CompositeCurve({ segments, targetLength: 2 });

        expect(curve.arcLength).toBeCloseTo(1 + Math.sqrt(2));
    });

    it("computes targetScaleFac correctly", () => {
        const segments = [
            new Bezier({ start: new Vector3(0, 0, 0), end: new Vector3(1, 0, 0) }),
            new Bezier({ start: new Vector3(1, 0, 0), end: new Vector3(1, 1, 1) }),
        ];
        const curve = new CompositeCurve({ segments, targetLength: 2 });

        expect(curve.targetScaleFac).toBeCloseTo(2 / (1 + Math.sqrt(2)));
    });

    it("falls back to 1 if targetScaleFac is NaN", () => {
        const segments = [
            new Bezier({ start: new Vector3(0, 0, 0), end: new Vector3(0, 0, 0) }),
        ];
        const curve = new CompositeCurve({ segments, targetLength: 3 });

        expect(curve.targetScaleFac).toBe(1);
    });
});


