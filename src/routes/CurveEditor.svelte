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
    groupMatrix,
}: {
    curve: Bezier[],
    onCurveChange?: (curves: Bezier[]) => void,
    meshLineScaleFac?: number,
    groupMatrix: Matrix4,
} = $props();

let curveSegments = $state(curve);

const finalCurveSegment = $derived(curveSegments.at(-1));

type DragType = "vertex" | "startDeriv" | "endDeriv";

let currentDrag = $state<{
    index: number,
    position: Vector3,
    type: DragType,
} | null>(null);


const onPositionDrag = (index: number, position: Vector3, type: DragType) => {
    currentDrag = {
        index,
        position,
        type,
    };
};

const onPositionChange = (index: number, position: Vector3, type: DragType) => {
    switch (type) {
        case "vertex":
            if (index < curveSegments.length) {
                curveSegments[index].start = position;
            }
            if (index > 0) {
                curveSegments[index - 1].end = position;
            }
            break;

        case "startDeriv":
            curveSegments[index].startDeriv = position;
            break;

        case "endDeriv":
            curveSegments[index].endDeriv = position;
            break;
    }


    onCurveChange?.(curveSegments);

    currentDrag = null;
};
</script>

{#each curveSegments as curveSegment, i}
    {@const startPosition = currentDrag !== null && currentDrag.type === "vertex" && currentDrag.index === i
        ? currentDrag.position
        : curveSegment.start
    }
    {@const endPosition = currentDrag !== null && currentDrag.type === "vertex" && currentDrag.index === i + 1
        ? currentDrag.position
        : curveSegment.end
    }
    {@const startDerivPosition = currentDrag !== null && currentDrag.type === "startDeriv" && currentDrag.index === i
        ? currentDrag.position
        : curveSegment.startDeriv
    }
    {@const endDerivPosition = currentDrag !== null && currentDrag.type === "endDeriv" && currentDrag.index === i
        ? currentDrag.position
        : curveSegment.endDeriv
    }

    <T.Mesh>
        <MeshLineGeometry points={new CubicBezierCurve3(
            startPosition,
            startDerivPosition,
            endDerivPosition,
            endPosition,
        ).getPoints(32)} />
        <MeshLineMaterial
            color="#fff"
            width={0.05 * meshLineScaleFac}
        />
    </T.Mesh>

    <CurveVertex
        position={startPosition.toArray()}
        onPositionDrag={position => onPositionDrag(i, position, "vertex")}
        onPositionChange={position => onPositionChange(i, position, "vertex")}
        {meshLineScaleFac}
        {groupMatrix}
    />
    <CurveHandle
        position={startDerivPosition.toArray()}
        onPositionDrag={position => onPositionDrag(i, position, "startDeriv")}
        onPositionChange={position => onPositionChange(i, position, "startDeriv")}
        {meshLineScaleFac}
        {groupMatrix}
    />
    <CurveHandle
        position={endDerivPosition.toArray()}
        onPositionDrag={position => onPositionDrag(i, position, "endDeriv")}
        onPositionChange={position => onPositionChange(i, position, "endDeriv")}
        {meshLineScaleFac}
        {groupMatrix}
    />
    
    <T.Mesh>
        <MeshLineGeometry points={[startPosition, startDerivPosition]} />
        <MeshLineMaterial
            color="#fff"
            width={0.025 * meshLineScaleFac}
            dashArray={1/32}
            dashRatio={0.5}
            transparent
        />
    </T.Mesh>

    <T.Mesh>
        <MeshLineGeometry points={[endPosition, endDerivPosition]} />
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
    {@const finalStartPosition = currentDrag !== null && currentDrag.type === "vertex" && currentDrag.index === curveSegments.length
        ? currentDrag.position
        : finalCurveSegment.end
    }

    <CurveVertex
        position={finalStartPosition.toArray()}
        onPositionDrag={position => onPositionDrag(curveSegments.length, position, "vertex")}
        onPositionChange={position => onPositionChange(curveSegments.length, position, "vertex")}
        {meshLineScaleFac}
        {groupMatrix}
    />
{/if}