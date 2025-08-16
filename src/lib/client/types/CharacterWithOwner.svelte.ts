import type { Character } from "./Character.svelte";

export class CharacterWithOwner {
    readonly character: Character;
    readonly ownerUserId: bigint;
    ownerAvatarUrl: string = $state()!;
    ownerDisplayName: string = $state()!;

    constructor({
        character,
        ownerUserId,
        ownerAvatarUrl,
        ownerDisplayName,
    }: {
        character: Character,
        ownerUserId: bigint,
        ownerAvatarUrl: string,
        ownerDisplayName: string,
    }) {
        this.character = character;
        this.ownerUserId = ownerUserId;
        this.ownerAvatarUrl = ownerAvatarUrl;
        this.ownerDisplayName = ownerDisplayName;
    }
}