import { Vector3 } from "three";
import { createTextureFromUrl } from "./createTexture";
import { CompositeCurve } from "./types/CompositeCurve.svelte";
import { Bezier } from "./types/Bezier.svelte";
import { Character } from "./types/Character.svelte";


export const loadCharacter = (characterData: any) => {
    const segments = characterData.referenceCurve.map((segmentData: number[][]) => {
        const [start, end, startDeriv, endDeriv] = segmentData;
        return new Bezier({
            start: new Vector3(...start),
            end: new Vector3(...end),
            startDeriv: new Vector3(...startDeriv),
            endDeriv: new Vector3(...endDeriv),
        });
    });

    const referenceCurve = new CompositeCurve({
        segments,
        targetLength: characterData.targetLength,
    });

    const character = new Character({
        id: characterData.id.toString(),
        name: characterData.name,
        imageUrl: characterData.imageUrl,
        referenceCurve,
        offsetPos: new Vector3(...characterData.offsetPos),
    });

    (async () => {
        character.texture = await createTextureFromUrl(characterData.imageUrl);
    })();

    return character;
};
