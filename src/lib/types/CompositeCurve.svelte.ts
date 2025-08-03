import type { Bezier } from "./Bezier.svelte";

const N_POINTS = 32;

export class CompositeCurve {
    segments = $state<Bezier[]>()!;
    targetLength = $state<number>()!;

    points = $derived(this.segments.flatMap(curve => curve.ref.getPoints(N_POINTS)));
    arcLength = $derived.by(() => {
        let length = 0;

        for (const segment of this.segments) {
            length += segment.arcLength;
        }

        return length;
    });

    targetScaleFacRaw = $derived(this.targetLength / this.arcLength);
    targetScaleFac = $derived(isFinite(this.targetScaleFacRaw) ? this.targetScaleFacRaw : 1);

    constructor({
        segments,
        targetLength,
    }: {
        segments: Bezier[],
        targetLength: number,
    }) {
        this.segments = segments;
        this.targetLength = targetLength;
    }
}