import { CubicBezierCurve3, type Vector3 } from "three";

/**
 * Reactive wrapper for `CubicBezierCurve3`
 */
export class Bezier {
    start = $state<Vector3>()!;
    end = $state<Vector3>()!;
    startDeriv = $state<Vector3 | null>(null);
    endDeriv = $state<Vector3 | null>(null);

    ref = $derived(new CubicBezierCurve3(
        this.start,
        this.startDeriv ?? this.start,
        this.endDeriv ?? this.end,
        this.end,
    ));

    arcLength = $derived(this.ref.getLength());

    constructor({
        start,
        end,
        startDeriv = null,
        endDeriv = null,
    }: {
        start: Vector3,
        end: Vector3,
        startDeriv?: Vector3 | null,
        endDeriv?: Vector3 | null,
    }) {
        this.start = start;
        this.end = end;
        this.startDeriv = startDeriv;
        this.endDeriv = endDeriv;
    }
}