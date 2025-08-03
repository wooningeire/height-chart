import type { Texture } from "three";
import type { CompositeCurve } from "./CompositeCurve.svelte";

export class Character {
    id: string = $state()!;
    name: string = $state()!;
    imageUrl: string = $state()!;
    texture: Texture = $state()!;
    referenceCurve: CompositeCurve = $state()!;

    constructor({
        id,
        name,
        imageUrl,
        texture,
        referenceCurve,
    }: {
        id: string,
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