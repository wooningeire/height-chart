<script lang="ts" module>
export type ImagePlaneClickEvent = {
    localX: number,
    localY: number,
    pixelX: number,
    pixelY: number,
};
</script>

<script lang="ts">
import {T} from "@threlte/core";
import {type IntersectionEvent} from "@threlte/extras";
import { untrack } from "svelte";
import * as THREE from "three";

let {
    url,
    position = [0, 0, 0],
    scale = [1, 1, 1],
    onClick,
    onBottomLeftLocalCoordsChange,
    onTextureChange,
}: {
    url: string,
    position?: [number, number, number],
    scale?: [number, number, number],
    onClick?: (coords: ImagePlaneClickEvent) => void,
    onBottomLeftLocalCoordsChange?: (coords: {x: number, y: number}) => void,
    onTextureChange?: (texture: THREE.Texture) => void,
} = $props();

let meshRef = $state<THREE.Mesh>();
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
const inverseMeshMatrix = $derived(meshRef?.matrixWorld.clone().invert() ?? null);


const handleClick = (event: IntersectionEvent<PointerEvent>) => {
    if (!inverseMeshMatrix || !texture) return;

    const clickLocalCoords = event.point.clone().applyMatrix4(inverseMeshMatrix);

    const localX = clickLocalCoords.x - bottomLeftLocalCoords.x;
    const localY = clickLocalCoords.y - bottomLeftLocalCoords.y;

    onClick?.({
        localX,
        localY,
        pixelX: localX * texture.image.height,
        pixelY: localY * texture.image.height,
    });
};

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
        onclick={handleClick}
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