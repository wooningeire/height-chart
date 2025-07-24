<script lang="ts">
import type { Character } from "$lib/types/Character";
import { T } from "@threlte/core";
import CharacterReference from "./CharacterReference.svelte";
import {CubicBezierCurve3, Texture} from "three";
import CurveEditor from "./CurveEditor.svelte";

let {
    character,
    onReferenceCurveChange,
    onTextureChange,
}: {
    character: Character,
    onReferenceCurveChange?: (referenceCurve: CubicBezierCurve3[]) => void,
    onTextureChange?: (texture: Texture) => void,
} = $props();

let bottomLeftLocalCoords = $state({x: 0, y: 0});
</script>

<T.Group
    scale={character.referenceCurve.targetScaleFac}
>
    <T.Group
        position={[bottomLeftLocalCoords.x, 0, 0]}
    >
        <CharacterReference
            {character}
            onBottomLeftLocalCoordsChange={value => bottomLeftLocalCoords = value}
            {onTextureChange}
        />

        <CurveEditor
            curve={character.referenceCurve.segments}
            onCurveChange={onReferenceCurveChange}
            meshLineScaleFac={character.referenceCurve.targetScaleFac}
        />
    </T.Group>
</T.Group>