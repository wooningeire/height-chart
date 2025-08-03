<script lang="ts">
    import type { Character } from "$/lib/types/Character.svelte";

let {
    character,
}: {
    character: Character,
} = $props();
</script>


<character-list-item>
    <character-name>{character.name}</character-name>

    <img src={character.imageUrl} alt={character.name} />
</character-list-item>

<style lang="scss">
character-list-item {
    display: block;
    background: oklch(1 0 0 / 0.3333333);
}

img {
    width: 100%;
    height: 5rem;
    object-fit: cover;

    border-radius: 0.5rem;

    filter: drop-shadow(0 0.0625rem 0.125rem oklch(0 0 0 / 0.25));
}

character-name {
    display: block;
    padding: 0.5rem;
}
</style>