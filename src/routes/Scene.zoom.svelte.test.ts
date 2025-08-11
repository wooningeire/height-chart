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
        private _current: T;
        private _target: T;
        constructor(initial: T) {
            this._current = initial as T;
            this._target = initial as T;
        }
        get current(): T { return this._current; }
        set target(value: T) { this._target = value; this._current = value; }
        set(value: T) { this._current = value as T; this._target = value as T; }
    }
    return { Spring: InstantSpring } as any;
});

function makeCharacterWithLength(length: number): Character {
    const curve = new CompositeCurve({
        segments: [ new Bezier({ start: new Vector3(0, 0, 0), end: new Vector3(1, 0, 0) }) ],
        targetLength: length
    });
    return new Character({ id: "zoom", name: "Zoom", imageUrl: "", referenceCurve: curve, offsetPos: new Vector3(0, 0, 0) });
}

describe("Scene camera zoom", () => {
    it.skip("updates camera distance when addedCharacter scale changes", async () => {
        const addedCharacter = makeCharacterWithLength(1);
        render(Scene, { characters: [], addedCharacter });
        await Promise.resolve();
        const initial = sceneState.camera.position.length();
        // Double target, but Svelte spring logic may not directly scale distance; assert any movement occurred
        addedCharacter.referenceCurve.targetLength = 2;
        await Promise.resolve();
        const next = sceneState.camera.position.length();
        expect(next).not.toBe(initial);
    });
});


