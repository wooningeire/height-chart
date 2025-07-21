<script lang="ts">
import {T} from "@threlte/core";
import {OrbitControls} from "@threlte/extras";
import ImagePlane from "./ImagePlane.svelte";
import type { SvelteMap, SvelteSet } from "svelte/reactivity";
    import type { Character } from "$lib/types/Character";
    import CharacterReference from "./CharacterReference.svelte";

let {
    characters,
    uploadedImage,
}: {
    characters: SvelteMap<string, Character>,
    uploadedImage: {url: string, file: File} | null,
} = $props();

</script>

<T.DirectionalLight
    position={[0.25, 1, 0.5]}
    intensity={0.8}
    castShadow
/>

<T.DirectionalLight
    position={[0.5, 1, -0.5]}
    intensity={1.5}
    castShadow
/>

<T.DirectionalLight
    position={[0, 0, -1]}
    intensity={1}
    castShadow
/>

<T.AmbientLight
    intensity={1}
/>

<T.PerspectiveCamera
    makeDefault
    position={[5, 5, 5]}
    fov={30}
>
    <OrbitControls 
        enableDamping
        dampingFactor={0.05}
    />
</T.PerspectiveCamera>


<T.Mesh
    position.y={-0.01}
    rotation.x={-Math.PI / 2}
    receiveShadow
>
    <T.PlaneGeometry args={[20, 20]} />
    <T.MeshStandardMaterial color="#fff" />
</T.Mesh>

<T.GridHelper args={[20, 20, "#999999", "#cccccc"]} />

{#each characters as [id, character] (id)}
    <CharacterReference {character} />
{/each}


{#if uploadedImage !== null}
    <ImagePlane
        url={uploadedImage.url}
        position={[0, 0.5, 0]} 
    />
{/if}

<T.Mesh position={[0, 0.5, -5]} castShadow receiveShadow>
    <T.BoxGeometry args={[1, 1, 1]} />
    <T.MeshStandardMaterial
        color="#007bff"
    />
</T.Mesh>