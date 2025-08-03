<script lang="ts">
import type { Character } from "$/lib/types/Character.svelte";
import { T } from "@threlte/core";
import {Group, Matrix4, Mesh, Texture} from "three";
import CurveEditor from "./CurveEditor.svelte";
import type { Bezier } from "$/lib/types/Bezier.svelte";
    import { Spring } from "svelte/motion";
    import ImagePlane from "./ImagePlane.svelte";

let {
    character,
    onReferenceCurveChange,
    showCurve = false,
}: {
    character: Character,
    onReferenceCurveChange?: (referenceCurve: Bezier[]) => void,
    showCurve?: boolean,
} = $props();

let innerGroupRef = $state<Group | null>(null);

const scaleFac = new Spring(character.referenceCurve.targetScaleFac);
$effect(() => {
    scaleFac.target = character.referenceCurve.targetScaleFac;
});

let bottomLeftLocalCoords = $derived({
    x: -character.texture.width / character.texture.height / 2,
    y: -0.5,
});

let innerGroupMatrix = $derived.by(() => {
    if (innerGroupRef === null) return new Matrix4();

    void bottomLeftLocalCoords, scaleFac.current;
    return innerGroupRef.matrixWorld;
});
</script>

<T.Group
    scale={scaleFac.current}
>
    <T.Group
        position={[bottomLeftLocalCoords.x, 0, 0]}
        bind:ref={() => undefined, group => innerGroupRef = group!}
    >
        <ImagePlane
            texture={character.texture}
            position={[character.texture.width / character.texture.height / 2, 0.5, 0]}
        />

        {#if showCurve}
            <CurveEditor
                curve={character.referenceCurve.segments}
                onCurveChange={onReferenceCurveChange}
                meshLineScaleFac={character.referenceCurve.targetScaleFac}
                groupMatrix={innerGroupMatrix}
            />
        {/if}
    </T.Group>
</T.Group>