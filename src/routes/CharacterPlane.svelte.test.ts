import { describe, it, expect } from "vitest";
import { render } from "@threlte/test";
import CharacterPlane from "./CharacterPlane.svelte";
import { Character } from "$/lib/client/types/Character.svelte";
import { CompositeCurve } from "$/lib/client/types/CompositeCurve.svelte";
import { Bezier } from "$/lib/client/types/Bezier.svelte";
import { Mesh, Texture, Vector3 } from "three";

function createTexture(width = 100, height = 50): Texture {
    const texture = new Texture();
    texture.image = { width, height };
    texture.needsUpdate = false;
    return texture;
}

function makeCharacter(withTexture = true): Character {
    const curve = new CompositeCurve({
        segments: [
            new Bezier({
                start: new Vector3(0, 0, 0),
                end: new Vector3(1, 0, 0),
            }),
        ],
        targetLength: 1
    });

    return new Character({
        id: "51d03d58-6466-42f6-87b1-beaad8cc5198",
        name: "Silly",
        imageUrl: "",
        texture: withTexture ? createTexture(200, 100) : null,
        referenceCurve: curve,
        offsetPos: new Vector3(0, 0, 0),
    });
}

describe("CharacterPlane", () => {
    it("renders ImagePlane when character has a texture and positions it with aspect", () => {
        const character = makeCharacter(true);
        const { scene } = render(CharacterPlane, { character, showEditor: false });

        const mesh = scene.getObjectByName("image-plane") as Mesh;
        expect(mesh).toBeDefined();
    });

    it("omits ImagePlane when character has no texture", () => {
        const character = makeCharacter(false);
        const { scene } = render(CharacterPlane, { character, showEditor: false });

        const mesh = scene.getObjectByName("image-plane") as Mesh | undefined;
        expect(mesh).toBeUndefined();
    });
});


