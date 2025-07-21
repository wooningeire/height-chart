<script lang="ts">
    import type { Character } from "$lib/types/Character";
    import ImagePlane from "./ImagePlane.svelte";

let {
    character,
}: {
    character: Character,
} = $props();
</script>

<ImagePlane
    url={character.imageUrl}
    position={[0, 0.5, 0]}
/>