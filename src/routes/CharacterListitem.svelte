<script lang="ts">
    import type { Character } from "$/lib/types/Character.svelte";
    import Button from "@/Button.svelte";

let {
    character,
    onClick,
}: {
    character: Character,
    onClick?: () => void,
} = $props();
</script>


<Button
    {onClick}
    ariaLabel={`Character ${character.name}`}
>
    <character-name>{character.name}</character-name>

    <img src={character.imageUrl} alt={character.name} />
</Button>

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