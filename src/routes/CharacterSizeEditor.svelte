<script lang="ts">
import type { Character } from "$lib/types/Character";
import { T } from "@threlte/core";
import CharacterReference from "./CharacterReference.svelte";
import {Group, Matrix4, Mesh, Texture} from "three";
import CurveEditor from "./CurveEditor.svelte";
import type { Bezier } from "$/lib/types/Bezier.svelte";
    import { Spring } from "svelte/motion";

let {
    character,
    onReferenceCurveChange,
}: {
    character: Character,
    onReferenceCurveChange?: (referenceCurve: Bezier[]) => void,
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
    return innerGroupRef.matrixWorld.clone().invert();
});
</script>

<T.Group
    scale={scaleFac.current}
>
    <T.Group
        position={[bottomLeftLocalCoords.x, 0, 0]}
        bind:ref={() => undefined, group => innerGroupRef = group!}
    >
        <CharacterReference
            {character}
        />

        <CurveEditor
            curve={character.referenceCurve.segments}
            onCurveChange={onReferenceCurveChange}
            meshLineScaleFac={character.referenceCurve.targetScaleFac}
            groupMatrixInverse={innerGroupMatrix}
        />
    </T.Group>
</T.Group>