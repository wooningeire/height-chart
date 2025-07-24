import { CubicBezierCurve3, type Vector3 } from "three";

/**
 * Reactive wrapper for `CubicBezierCurve3`
 */
export class Bezier {
    start = $state<Vector3>()!;
    end = $state<Vector3>()!;
    startDeriv = $state<Vector3>()!;
    endDeriv = $state<Vector3>()!;

    ref = $derived(new CubicBezierCurve3(
        this.start,
        this.startDeriv,
        this.endDeriv,
        this.end,
    ));

    arcLength = $derived(this.ref.getLength());

    constructor({
        start,
        end,
        startDeriv,
        endDeriv,
    }: {
        start: Vector3,
        end: Vector3,
        startDeriv: Vector3,
        endDeriv: Vector3,
    }) {
        this.start = start;
        this.end = end;
        this.startDeriv = startDeriv;
        this.endDeriv = endDeriv;
    }
}