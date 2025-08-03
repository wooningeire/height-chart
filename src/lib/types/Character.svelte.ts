import type { Texture } from "three";
import type { CompositeCurve } from "./CompositeCurve.svelte";

export class Character {
    id: string | null = $state(null);
    name: string = $state()!;
    imageUrl: string = $state()!;
    texture: Texture = $state()!;
    referenceCurve: CompositeCurve = $state()!;

    constructor({
        id = null,
        name,
        imageUrl,
        texture,
        referenceCurve,
    }: {
        id?: string | null,
        name: string,
        imageUrl: string,
        texture: Texture,
        referenceCurve: CompositeCurve,
    }) {
        this.id = id;
        this.name = name;
        this.imageUrl = imageUrl;
        this.texture = texture;
        this.referenceCurve = referenceCurve;
    }
}