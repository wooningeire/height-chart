<script lang="ts">
import {T} from "@threlte/core";
import * as THREE from "three";

let {
    url,
    position = [0, 0, 0],
}: {
    url: string,
    position?: [number, number, number],
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
            texture => {
                if (texture === null) return;

                texture.colorSpace = THREE.SRGBColorSpace;
                texture.premultiplyAlpha = false;
                resolve(texture);
            },
            undefined,
            error => {
                reject(error);
            },
        );
    });
}

$effect(() => {
    loadTexture(url).then((loadedTexture) => {
        texture = loadedTexture;
    });
});
</script>

{#if texture !== null}
    <T.Mesh
        {position}
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