<script lang="ts">
import {setContext, untrack} from "svelte";
import {T} from "@threlte/core";
import {ContactShadows, interactivity, OrbitControls, SoftShadows} from "@threlte/extras";
import type { SvelteMap } from "svelte/reactivity";
import type { Character } from "$/lib/types/Character.svelte";
import CharacterReference from "./CharacterReference.svelte";
import CharacterSizeEditor from "./CharacterSizeEditor.svelte";
import {Texture, CubicBezierCurve3, PerspectiveCamera, Vector3} from "three";
import {sceneState} from "$/lib/types/SceneState.svelte";
import type { Bezier } from "$/lib/types/Bezier.svelte";
    import type { OrbitControls as OrbitControlsType } from "three/examples/jsm/Addons.js";
    import { spring, Spring } from "svelte/motion";

let {
    characters,
    addedCharacter,
    onAddedCharacterReferenceCurveChange,
}: {
    characters: SvelteMap<string, Character>,
    addedCharacter: Character | null,
    onAddedCharacterReferenceCurveChange?: (referenceCurve: Bezier[]) => void,
} = $props();


interactivity();


let controls: OrbitControlsType | null = $state(null);
let oldScale: number | null = null;
$effect(() => {
    const newScale = addedCharacter?.referenceCurve.targetScaleFac ?? null;

    if (newScale !== null && oldScale !== null) {
        untrack(() => {
            if (controls === null) return;

            cameraZoom.set(1);
            oldCameraDirection = sceneState.camera.position.clone().sub(controls.target);
            cameraZoom.target = newScale / oldScale!;
        });
    }

    oldScale = newScale;
});

let oldCameraDirection: Vector3 | null = null;
const cameraZoom = new Spring(1);
$effect(() => {
    void cameraZoom.current;

    untrack(() => {
        if (controls === null || oldCameraDirection === null) return;
        sceneState.camera.position.set(...controls.target.clone().addScaledVector(oldCameraDirection, cameraZoom.current).toArray());
    });
});
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
        bind:ref={() => undefined, value => controls = value!}
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
        <CharacterSizeEditor {character} />
    {/each}
</T.Group>


{#if addedCharacter !== null}
    <CharacterSizeEditor
        character={addedCharacter}
        onReferenceCurveChange={onAddedCharacterReferenceCurveChange}
        showCurve
    />
{/if}

<T.Mesh position={[0, 0.5, -5]} castShadow receiveShadow>
    <T.BoxGeometry args={[1, 1, 1]} />
    <T.MeshStandardMaterial
        color="#007bff"
    />
</T.Mesh>