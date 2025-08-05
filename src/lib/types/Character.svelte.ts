import { Vector3, type Texture } from "three";
import type { CompositeCurve } from "./CompositeCurve.svelte";

export class Character {
    id: string | null = $state(null);
    name: string = $state()!;
    imageUrl: string = $state()!;
    file: File | null = $state(null);
    texture: Texture = $state()!;

    referenceCurve: CompositeCurve = $state()!;
    offsetPos: Vector3 = $state()!;

    constructor({
        id = null,
        name,
        imageUrl,
        file = null,
        texture,
        referenceCurve,
        offsetPos = new Vector3(),
    }: {
        id?: string | null,
        name: string,
        imageUrl: string,
        file?: File | null,
        texture: Texture,
        referenceCurve: CompositeCurve,
        offsetPos?: Vector3,
    }) {
        this.id = id;
        this.name = name;
        this.imageUrl = imageUrl;
        this.file = file;
        this.texture = texture;
        this.referenceCurve = referenceCurve;
        this.offsetPos = offsetPos;
    }
}