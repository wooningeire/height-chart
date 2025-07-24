<script lang="ts">
import {setContext} from "svelte";
import {T} from "@threlte/core";
import {ContactShadows, interactivity, OrbitControls, SoftShadows} from "@threlte/extras";
import type { SvelteMap } from "svelte/reactivity";
import type { Character } from "$lib/types/Character";
import CharacterReference from "./CharacterReference.svelte";
import CharacterSizeEditor from "./CharacterSizeEditor.svelte";
import {Texture, CubicBezierCurve3} from "three";
import {sceneState} from "$/routes/SceneState.svelte";
    import type { Bezier } from "$/lib/types/Bezier.svelte";

let {
    characters,
    addedCharacter,
    onAddedCharacterReferenceCurveChange,
    onAddedCharacterTextureChange,
}: {
    characters: SvelteMap<string, Character>,
    addedCharacter: Character | null,
    onAddedCharacterReferenceCurveChange?: (referenceCurve: Bezier[]) => void,
    onAddedCharacterTextureChange?: (texture: Texture) => void,
} = $props();


interactivity();
</script>

<T.DirectionalLight
    position={[-0.25, 1, -0.5]}
    intensity={0.8}
    castShadow
/>

<T.DirectionalLight
    position={[0.125, 1, 1]}
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
    position={[2, 2, 3]}
    fov={30}
    bind:ref={() => undefined, camera => sceneState.camera = camera!}
>
    <OrbitControls 
        enableDamping
        dampingFactor={0.05}
        enabled={sceneState.cameraControlsEnabled}
    />
</T.PerspectiveCamera>


<T.Mesh
    position.y={-0.01}
    rotation.x={-Math.PI / 2}
    receiveShadow
>
    <T.PlaneGeometry args={[20, 20]} />
    <T.MeshPhysicalMaterial color="#fff" />
</T.Mesh>

<T.GridHelper
    args={[20, 20, "#999", "#eee"]}
/>



<T.Group>
    {#each characters as [id, character] (id)}
        <CharacterReference {character} />
    {/each}
</T.Group>


{#if addedCharacter !== null}
    <CharacterSizeEditor
        character={addedCharacter}
        onReferenceCurveChange={onAddedCharacterReferenceCurveChange}
        onTextureChange={onAddedCharacterTextureChange}
    />
{/if}

<T.Mesh position={[0, 0.5, -5]} castShadow receiveShadow>
    <T.BoxGeometry args={[1, 1, 1]} />
    <T.MeshStandardMaterial
        color="#007bff"
    />
</T.Mesh>