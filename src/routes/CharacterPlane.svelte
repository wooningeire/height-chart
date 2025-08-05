<script lang="ts">
import type { Character } from "$/lib/types/Character.svelte";
import { T } from "@threlte/core";
import {Group, Matrix4, Mesh, Texture, Vector3} from "three";
import CurveEditor from "./CurveEditor.svelte";
import type { Bezier } from "$/lib/types/Bezier.svelte";
    import { Spring } from "svelte/motion";
    import ImagePlane from "./ImagePlane.svelte";
    import CurveVertex from "./CurveVertex.svelte";

let {
    character,
    onReferenceCurveChange,
    showEditor = false,
}: {
    character: Character,
    onReferenceCurveChange?: (referenceCurve: Bezier[]) => void,
    showEditor?: boolean,
} = $props();

let innerGroupRef = $state<Group | null>(null);

const scaleFac = new Spring(character.referenceCurve.targetScaleFac);
$effect(() => {
    scaleFac.target = character.referenceCurve.targetScaleFac;
});

const offsetX = new Spring(character.offsetPos.x);
const offsetY = new Spring(character.offsetPos.y);
const offsetZ = new Spring(character.offsetPos.z);
$effect(() => {
    offsetX.target = character.offsetPos.x;
    offsetY.target = character.offsetPos.y;
    offsetZ.target = character.offsetPos.z;
});
let offsetDrag = $state<Vector3 | null>(null);

let innerGroupMatrix = $derived.by(() => {
    if (innerGroupRef === null) return new Matrix4();

    void scaleFac.current, offsetX.current, offsetY.current, offsetZ.current;
    return innerGroupRef.matrixWorld;
});
</script>

<T.Group
    scale={scaleFac.current}
>
    <T.Group
        position={[-offsetX.current, -offsetY.current, -offsetZ.current]}
        bind:ref={() => undefined, group => innerGroupRef = group!}
    >
        {#if character.texture !== null}
            <ImagePlane
                texture={character.texture}
                position={[character.texture.width / character.texture.height / 2, 0.5, 0]}
            />
        {/if}

        {#if showEditor}
            <CurveEditor
                curve={character.referenceCurve.segments}
                onCurveChange={onReferenceCurveChange}
                meshLineScaleFac={scaleFac.current}
                groupMatrix={innerGroupMatrix}
            />

            {@const offsetPosition = offsetDrag?.toArray() ?? [offsetX.current, offsetY.current, offsetZ.current]}
            <CurveVertex
                position={offsetPosition}
                onPositionDrag={position => {
                    offsetDrag = position;
                }}
                onPositionChange={position => {
                    offsetDrag = null;
                    character.offsetPos = position;
                }}
                meshLineScaleFac={scaleFac.current}
                groupMatrix={innerGroupMatrix}
            />
        {/if}
    </T.Group>
</T.Group>