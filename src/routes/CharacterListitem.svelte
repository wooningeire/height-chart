<script lang="ts">
import type { Character } from "$/lib/client/types/Character.svelte";
    import type { CharacterWithOwner } from "$/lib/client/types/CharacterWithOwner.svelte";
import Button from "@/Button.svelte";
    import UserBadge from "@/UserBadge.svelte";

let {
    characterWithOwner,
    onClick,
}: {
    characterWithOwner: CharacterWithOwner,
    onClick?: () => void,
} = $props();

const character = $derived(characterWithOwner.character);
</script>


<Button
    {onClick}
    ariaLabel={`Character ${character.name}`}
>
    <character-name>
        {character.name}
    </character-name>

    <img src={character.imageUrl} alt={character.name} />
</Button>

<UserBadge
    avatarUrl={characterWithOwner.ownerAvatarUrl}
    displayName={characterWithOwner.ownerDisplayName}
/>


<style lang="scss">
img {
    width: 100%;
    height: 5rem;
    object-fit: cover;

    border-radius: 0.5rem;

    filter: drop-shadow(0 0.0625rem 0.25rem oklch(0 0 0 / 0.125));
}

character-name {
    display: block;
    padding: 0.5rem;
}
</style>