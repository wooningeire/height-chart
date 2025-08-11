<script lang="ts">
import {T} from "@threlte/core";
import {DoubleSide, Mesh, Texture} from "three";

let {
    texture,
    position = [0, 0, 0],
    scale = [1, 1, 1],
    meshRef = $bindable(),
}: {
    texture: Texture,
    position?: [number, number, number],
    scale?: [number, number, number],
    meshRef?: Mesh,
} = $props();

let aspectRatio = $derived.by(() => {
    if (texture === null) return 1;
    return texture.image.width / texture.image.height;
});
</script>

{#if texture !== null}
    <T.Mesh
        bind:ref={meshRef}
        {position}
        {scale}
        castShadow
        receiveShadow
        name="image-plane"
    >
        <T.PlaneGeometry args={[aspectRatio, 1]} />
        <T.MeshStandardMaterial
            map={texture}
            side={DoubleSide}
            transparent
            alphaTest={0.01}
        />
    </T.Mesh>
{/if}