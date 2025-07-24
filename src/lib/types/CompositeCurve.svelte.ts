import type { CubicBezierCurve3 } from "three";

const N_POINTS = 32;

export class CompositeCurve {
    segments = $state<CubicBezierCurve3[]>()!;
    targetLength = $state<number>()!;

    points = $derived(this.segments.flatMap(curve => curve.getPoints(N_POINTS)));
    arcLength = $derived.by(() => {
        let length = 0;

        for (const segment of this.segments) {
            length += segment.getLength();
        }

        return length;
    });

    targetScaleFac = $derived(this.targetLength / this.arcLength);

    constructor({
        segments,
        targetLength,
    }: {
        segments: CubicBezierCurve3[],
        targetLength: number,
    }) {
        this.segments = segments;
        this.targetLength = targetLength;
    }
}