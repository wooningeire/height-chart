<script lang="ts">
import {T} from "@threlte/core";
import { untrack } from "svelte";
import * as THREE from "three";

let {
    url,
    position = [0, 0, 0],
    scale = [1, 1, 1],
    onBottomLeftLocalCoordsChange,
    onTextureChange,
    meshRef = $bindable(),
}: {
    url: string,
    position?: [number, number, number],
    scale?: [number, number, number],
    onBottomLeftLocalCoordsChange?: (coords: {x: number, y: number}) => void,
    onTextureChange?: (texture: THREE.Texture) => void,
    meshRef?: THREE.Mesh,
} = $props();

let texture = $state<THREE.Texture | null>(null);

let aspectRatio = $derived.by(() => {
    if (texture === null) return 1;
    return texture.image.width / texture.image.height;
});

const loadTexture = (url: string) => {
    return new Promise<THREE.Texture>((resolve, reject) => {
        const loader = new THREE.TextureLoader();

        loader.load(
            url,
            loadedTexture => {
                if (loadedTexture === null) return;

                loadedTexture.colorSpace = THREE.SRGBColorSpace;
                loadedTexture.premultiplyAlpha = false;
                resolve(loadedTexture);
            },
            undefined,
            error => {
                reject(error);
            },
        );
    });
};

$effect(() => {
    loadTexture(url).then((loadedTexture) => {
        texture = loadedTexture;
        onTextureChange?.(texture);
    });
});

const bottomLeftLocalCoords = $derived(new THREE.Vector3(-aspectRatio / 2, -0.5));

$effect(() => {
    const point = {
        x: bottomLeftLocalCoords.x,
        y: bottomLeftLocalCoords.y,
    };

    untrack(() => onBottomLeftLocalCoordsChange?.(point));
});
</script>

{#if texture !== null}
    <T.Mesh
        bind:ref={meshRef}
        {position}
        {scale}
        castShadow
        receiveShadow
    >
        <T.PlaneGeometry args={[aspectRatio, 1]} />
        <T.MeshStandardMaterial
            map={texture}
            side={THREE.DoubleSide}
            transparent
            alphaTest={0.01}
        />
    </T.Mesh>
{/if}