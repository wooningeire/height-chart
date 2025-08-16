import { Vector3 } from "three";
import { createTextureFromUrl } from "./createTexture";
import { CompositeCurve } from "./types/CompositeCurve.svelte";
import { Bezier } from "./types/Bezier.svelte";
import { Character } from "./types/Character.svelte";
import { CharacterWithOwner } from "./types/CharacterWithOwner.svelte";


export const loadCharacter = (characterData: {
    id: number,
    name: string,
    imageUrl: string,
    targetLength: number,
    offsetPos: number[],
    offsetScale: number[],
    referenceCurve: number[][][],
    ownerUserId: string,
    ownerAvatarUrl: string,
    ownerDisplayName: string,
}) => {
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

    const characterWithOwner = new CharacterWithOwner({
        character: new Character({
            id: characterData.id.toString(),
            name: characterData.name,
            imageUrl: characterData.imageUrl,
            referenceCurve,
            offsetPos: new Vector3(...characterData.offsetPos),
        }),
        ownerUserId: BigInt(characterData.ownerUserId),
        ownerAvatarUrl: characterData.ownerAvatarUrl,
        ownerDisplayName: characterData.ownerDisplayName,
    });

    console.log(characterData);
    (async () => {
        try {
            characterWithOwner.character.texture = await createTextureFromUrl(characterData.imageUrl);
        } catch (error) {
            console.log(characterData);
            console.error("Failed to load character texture", error);
        }
    })();

    return characterWithOwner;
};
