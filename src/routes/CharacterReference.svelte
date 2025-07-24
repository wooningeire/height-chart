<script lang="ts">
import type { Character } from "$lib/types/Character";
import ImagePlane from "./ImagePlane.svelte";
import {Mesh, Vector3} from "three";

let {
    character,
    meshRef = $bindable(),
}: {
    character: Character,
    meshRef?: Mesh,
} = $props();
</script>

<ImagePlane
    texture={character.texture}
    position={[character.texture.width / character.texture.height / 2, 0.5, 0]}
    bind:meshRef
/>