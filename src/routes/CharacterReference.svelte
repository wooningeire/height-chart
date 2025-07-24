<script lang="ts">
import type { Character } from "$lib/types/Character";
import ImagePlane, { type ImagePlaneClickEvent } from "./ImagePlane.svelte";
import * as THREE from "three";

let {
    character,
    onClick,
    onBottomLeftLocalCoordsChange,
    onTextureChange,
}: {
    character: Character,
    onPointerDown?: (coords: ImagePlaneClickEvent) => void,
    onBottomLeftLocalCoordsChange?: (coords: {x: number, y: number}) => void,
    onTextureChange?: (texture: THREE.Texture) => void,
} = $props();

let bottomLeftLocalCoords = $state({x: 0, y: 0});
</script>

<ImagePlane
    url={character.imageUrl}
    position={[-bottomLeftLocalCoords.x, -bottomLeftLocalCoords.y, 0]}
    {onClick}
    onBottomLeftLocalCoordsChange={value => {
        bottomLeftLocalCoords = value;
        onBottomLeftLocalCoordsChange?.(bottomLeftLocalCoords);
    }}
    {onTextureChange}
/>