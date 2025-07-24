import type { Texture } from "three";
import type { CompositeCurve } from "./CompositeCurve.svelte";

export type Character = {
    id: string,
    name: string,
    imageUrl: string,
    texture: Texture,
    referenceCurve: CompositeCurve,
};