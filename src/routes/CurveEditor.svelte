<script lang="ts">
import {CubicBezierCurve3, Vector3} from "three";
import {T} from "@threlte/core";
import {MeshLineGeometry, MeshLineMaterial} from "@threlte/extras";
    import CurveVertex from "./CurveVertex.svelte";
import CurveHandle from "./CurveHandle.svelte";

let {
    curve,
    onCurveChange,
    meshLineScaleFac = 1,
}: {
    curve: CubicBezierCurve3[],
    onCurveChange?: (curves: CubicBezierCurve3[]) => void,
    meshLineScaleFac?: number,
} = $props();

let curveSegments = $state(curve);

const points = $derived(curveSegments.flatMap(curve => curve.getPoints(32)));
const finalCurveSegment = $derived(curveSegments.at(-1));
</script>

{#each curveSegments as curveSegment}
    <T.Mesh>
        <MeshLineGeometry {points} />
        <MeshLineMaterial
            color="#fff"
            width={0.05 * meshLineScaleFac}
        />
    </T.Mesh>

    <CurveVertex position={curveSegment.v0.toArray()} />
    <CurveHandle position={curveSegment.v1.toArray()} />
    <CurveHandle position={curveSegment.v2.toArray()} />
    
    <T.Mesh>
        <MeshLineGeometry points={[curveSegment.v0, curveSegment.v1]} />
        <MeshLineMaterial
            color="#fff"
            width={0.025 * meshLineScaleFac}
            dashArray={1/32}
            dashRatio={0.5}
            transparent
        />
    </T.Mesh>

    <T.Mesh>
        <MeshLineGeometry points={[curveSegment.v3, curveSegment.v2]} />
        <MeshLineMaterial
            color="#fff"
            width={0.025 * meshLineScaleFac}
            dashArray={1/32}
            dashRatio={0.5}
            transparent
        />
    </T.Mesh>
{/each}


{#if finalCurveSegment}
    <CurveVertex position={finalCurveSegment.v3.toArray()} />
{/if}