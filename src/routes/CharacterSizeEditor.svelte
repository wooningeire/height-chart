<script lang="ts">
import type { Character } from "$lib/types/Character";
import { T } from "@threlte/core";
import { type ImagePlaneClickEvent } from "./ImagePlane.svelte";
    import CharacterReference from "./CharacterReference.svelte";
    import { MeshLineGeometry, MeshLineMaterial } from "@threlte/extras";
    import * as THREE from "three";

let {
    character,
    onSetStart,
    onSetEnd,
}: {
    character: Character,
    onSetStart?: (point: {x: number, y: number}) => void,
    onSetEnd?: (point: {x: number, y: number}) => void,
} = $props();

let isSelectingSegmentStart = $state(true);
let bottomLeftLocalCoords = $state({x: 0, y: 0});

const handleImageClick = (coords: ImagePlaneClickEvent) => {
    if (isSelectingSegmentStart) {
        onSetStart?.({
            x: coords.localX,
            y: coords.localY,
        });
    } else {
        onSetEnd?.({
            x: coords.localX,
            y: coords.localY,
        });
    }

    isSelectingSegmentStart = !isSelectingSegmentStart;
};
</script>

<T.Group>
    <CharacterReference
        {character}
        onClick={handleImageClick}
        onBottomLeftLocalCoordsChange={value => bottomLeftLocalCoords = value}
    />

    {#if character.sizeBaseline.start}
        <T.Mesh position={[character.sizeBaseline.start.x, character.sizeBaseline.start.y, 0]}>
            <T.SphereGeometry args={[0.02]} />
            <T.MeshBasicMaterial color="#fff" />
        </T.Mesh>
    {/if}

    {#if character.sizeBaseline.end}
        <T.Mesh position={[character.sizeBaseline.end.x, character.sizeBaseline.end.y, 0]}>
            <T.SphereGeometry args={[0.02]} />
            <T.MeshBasicMaterial color="#fff" />
        </T.Mesh>
    {/if}

    {#if character.sizeBaseline.start && character.sizeBaseline.end}
        <T.Mesh>
            <MeshLineGeometry
                points={[
                    new THREE.Vector3(character.sizeBaseline.start.x, character.sizeBaseline.start.y, 0),
                    new THREE.Vector3(character.sizeBaseline.end.x, character.sizeBaseline.end.y, 0),
                ]}
            />
            <MeshLineMaterial
                color="#fff"
                width={0.02}
            />
        </T.Mesh>
    {/if}
</T.Group>
