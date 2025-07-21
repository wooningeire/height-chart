<script lang="ts">
import {T} from "@threlte/core";
import * as THREE from "three";

let {
    url,
    position = [0, 0, 0],
}: {
    url: string;
    position?: [number, number, number];
} = $props();

let texture = $state<THREE.Texture | null>(null);
let aspectRatio = $state<number>(1);

const loadTexture = (url: string) => {
    return new Promise<THREE.Texture>((resolve, reject) => {
        const loader = new THREE.TextureLoader();

        loader.load(
            url,
            texture => {
                if (texture === null) return;

                texture.colorSpace = THREE.SRGBColorSpace;
                resolve(texture);
            },
            undefined,
            error => {
                console.error("Failed to load texture:", error);
                reject(error);
            },
        );
    });
}

// Load texture when component mounts or URL changes
$effect(() => {
    loadTexture(url).then((loadedTexture) => {
        texture = loadedTexture;
        // Calculate aspect ratio from the actual image dimensions
        aspectRatio = loadedTexture.image.width / loadedTexture.image.height;
    });
});
</script>

{#if texture !== null}
    <T.Mesh {position} castShadow receiveShadow>
        <T.PlaneGeometry args={[aspectRatio, 1]} />
        <T.MeshStandardMaterial
            map={texture}
            side={THREE.DoubleSide}
        />
    </T.Mesh>
{/if}