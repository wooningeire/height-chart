import { Vector3, type Texture } from "three";
import type { CompositeCurve } from "./CompositeCurve.svelte";

export class Character {
    id: string | null = $state(null);
    name: string = $state()!;
    imageUrl: string = $state()!;
    texture: Texture = $state()!;

    referenceCurve: CompositeCurve = $state()!;
    offsetPos: Vector3 = $state()!;

    constructor({
        id = null,
        name,
        imageUrl,
        texture,
        referenceCurve,
        offsetPos = new Vector3(),
    }: {
        id?: string | null,
        name: string,
        imageUrl: string,
        texture: Texture,
        referenceCurve: CompositeCurve,
        offsetPos?: Vector3,
    }) {
        this.id = id;
        this.name = name;
        this.imageUrl = imageUrl;
        this.texture = texture;
        this.referenceCurve = referenceCurve;
        this.offsetPos = offsetPos;
    }
}