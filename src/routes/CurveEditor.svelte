<script lang="ts">
import {CubicBezierCurve3, Matrix4, Vector3} from "three";
import {T} from "@threlte/core";
import {MeshLineGeometry, MeshLineMaterial} from "@threlte/extras";
import CurveVertex from "./CurveVertex.svelte";
import CurveHandle from "./CurveHandle.svelte";
    import type { Bezier } from "$/lib/types/Bezier.svelte";

let {
    curve,
    onCurveChange,
    meshLineScaleFac = 1,
    groupMatrixInverse,
}: {
    curve: Bezier[],
    onCurveChange?: (curves: Bezier[]) => void,
    meshLineScaleFac?: number,
    groupMatrixInverse: Matrix4,
} = $props();

let curveSegments = $state(curve);

const finalCurveSegment = $derived(curveSegments.at(-1));

let currentDraggedIndex = $state<number | null>(null);
let currentDraggedPosition = $state<Vector3 | null>(null);

const onVertexPositionDrag = (index: number, position: [number, number, number]) => {
    currentDraggedPosition = new Vector3(...position).applyMatrix4(groupMatrixInverse);
    console.log(position, currentDraggedPosition);
    currentDraggedIndex = index;

};

const onVertexPositionChange = (index: number, position: [number, number, number]) => {
    const transformedPosition = new Vector3(...position).applyMatrix4(groupMatrixInverse);

    if (index < curveSegments.length) {
        curveSegments[index].start = transformedPosition;
    }
    if (index > 0) {
        curveSegments[index - 1].end = transformedPosition;
    }

    onCurveChange?.(curveSegments);

    currentDraggedPosition = null;
    currentDraggedIndex = null;
};
</script>

{#each curveSegments as curveSegment, i}
    {@const vertexPosition = currentDraggedIndex === i && currentDraggedPosition !== null
        ? currentDraggedPosition
        : curveSegment.start
    }
    {@const nextVertexPosition = currentDraggedIndex === i + 1 && currentDraggedPosition !== null
        ? currentDraggedPosition
        : curveSegment.end
    }

    <T.Mesh>
        <MeshLineGeometry points={new CubicBezierCurve3(
            vertexPosition,
            curveSegment.startDeriv,
            curveSegment.endDeriv,
            nextVertexPosition,
        ).getPoints(32)} />
        <MeshLineMaterial
            color="#fff"
            width={0.05 * meshLineScaleFac}
        />
    </T.Mesh>

    <CurveVertex
        position={vertexPosition.toArray()}
        onPositionDrag={position => onVertexPositionDrag(i, position)}
        onPositionChange={position => onVertexPositionChange(i, position)}
    />
    <CurveHandle position={curveSegment.startDeriv.toArray()} />
    <CurveHandle position={curveSegment.endDeriv.toArray()} />
    
    <T.Mesh>
        <MeshLineGeometry points={[vertexPosition, curveSegment.startDeriv]} />
        <MeshLineMaterial
            color="#fff"
            width={0.025 * meshLineScaleFac}
            dashArray={1/32}
            dashRatio={0.5}
            transparent
        />
    </T.Mesh>

    <T.Mesh>
        <MeshLineGeometry points={[nextVertexPosition, curveSegment.endDeriv]} />
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
    {@const finalVertexPosition = currentDraggedIndex === curveSegments.length && currentDraggedPosition !== null
        ? currentDraggedPosition
        : finalCurveSegment.end
    }

    <CurveVertex
        position={finalVertexPosition.toArray()}
        onPositionDrag={position => onVertexPositionDrag(curveSegments.length, position)}
        onPositionChange={position => onVertexPositionChange(curveSegments.length, position)}
    />
{/if}