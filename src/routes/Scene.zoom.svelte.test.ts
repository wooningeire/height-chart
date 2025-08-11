import { describe, it, expect, vi } from "vitest";
import { render } from "@threlte/test";
import Scene from "./Scene.svelte";
import { Character } from "$/lib/types/Character.svelte";
import { CompositeCurve } from "$/lib/types/CompositeCurve.svelte";
import { Bezier } from "$/lib/types/Bezier.svelte";
import { Vector3 } from "three";
import { sceneState } from "$/lib/types/SceneState.svelte";

vi.mock("svelte/motion", () => {
    class InstantSpring<T = number> {
        target: T = $state()!;
        current: T = $derived(this.target);

        constructor(initial: T) {
            this.target = initial;
        }

        set(value: T) {
            this.target = value;
        }
    }

    return { Spring: InstantSpring };
});

function createCharacterWithLength(length: number): Character {
    const curve = new CompositeCurve({
        segments: [ new Bezier({ start: new Vector3(0, 0, 0), end: new Vector3(1, 0, 0) }) ],
        targetLength: length
    });
    return new Character({ id: "zoom", name: "Zoom", imageUrl: "", referenceCurve: curve, offsetPos: new Vector3(0, 0, 0) });
}

describe("Scene camera zoom", () => {
    it("updates camera distance when addedCharacter scale changes", async () => {
        const addedCharacter = createCharacterWithLength(1);

        render(Scene, { characters: [], addedCharacter });

        await Promise.resolve();
        const initialPosition = sceneState.camera.position.length();
        
        addedCharacter.referenceCurve.targetLength = 2;

        await Promise.resolve();
        const finalPosition = sceneState.camera.position.length();

        expect(finalPosition).not.toBe(initialPosition);
    });
});
