import type { CubicBezierCurve3 } from "three";
import type { CompositeCurve } from "./CompositeCurve.svelte";

export type Character = {
    id: string,
    name: string,
    imageUrl: string,
    referenceCurve: CompositeCurve,
};