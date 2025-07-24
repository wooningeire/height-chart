<script lang="ts">
import type { Character } from "$lib/types/Character";
import ImagePlane from "./ImagePlane.svelte";
import * as THREE from "three";

let {
    character,
    onBottomLeftLocalCoordsChange,
    onTextureChange,
    meshRef = $bindable(),
}: {
    character: Character,
    onBottomLeftLocalCoordsChange?: (coords: {x: number, y: number}) => void,
    onTextureChange?: (texture: THREE.Texture) => void,
    meshRef?: THREE.Mesh,
} = $props();

let bottomLeftLocalCoords = $state({x: 0, y: 0});
</script>

<ImagePlane
    url={character.imageUrl}
    position={[-bottomLeftLocalCoords.x, -bottomLeftLocalCoords.y, 0]}
    onBottomLeftLocalCoordsChange={value => {
        bottomLeftLocalCoords = value;
        onBottomLeftLocalCoordsChange?.(bottomLeftLocalCoords);
    }}
    {onTextureChange}
    bind:meshRef
/>