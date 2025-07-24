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
    onTextureChange,
}: {
    character: Character,
    onSetStart?: (point: {x: number, y: number}) => void,
    onSetEnd?: (point: {x: number, y: number}) => void,
    onTextureChange?: (texture: THREE.Texture) => void,
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

<T.Group position={[bottomLeftLocalCoords.x, 0, 0]}>
    <CharacterReference
        {character}
        onClick={handleImageClick}
        onBottomLeftLocalCoordsChange={value => bottomLeftLocalCoords = value}
        {onTextureChange}
    />

    {#if character.referenceSegment.start}
        <T.Mesh position={[character.referenceSegment.start.x, character.referenceSegment.start.y, 0]}>
            <T.SphereGeometry args={[0.02]} />
            <T.MeshToonMaterial emissive="#fff" />
        </T.Mesh>
    {/if}

    {#if character.referenceSegment.end}
        <T.Mesh position={[character.referenceSegment.end.x, character.referenceSegment.end.y, 0]}>
            <T.SphereGeometry args={[0.02]} />
            <T.MeshToonMaterial emissive="#fff" />
        </T.Mesh>
    {/if}

    {#if character.referenceSegment.start && character.referenceSegment.end}
        <T.Mesh>
            <MeshLineGeometry
                points={[
                    new THREE.Vector3(character.referenceSegment.start.x, character.referenceSegment.start.y, 0),
                    new THREE.Vector3(character.referenceSegment.end.x, character.referenceSegment.end.y, 0),
                ]}
            />
            <MeshLineMaterial
                color="#fff"
                width={0.02}
            />
        </T.Mesh>
    {/if}
</T.Group>
