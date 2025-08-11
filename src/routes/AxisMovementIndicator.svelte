<script lang="ts">
import { type IDraggerAgainstZPlane } from "$/lib/types/DraggerAgainstZPlane.svelte";
import { sceneState } from "$/lib/types/SceneState.svelte";
import {T} from "@threlte/core";
    import { MeshLineGeometry, MeshLineMaterial } from "@threlte/extras";
    import { Vector3 } from "three";

let {
    position,
    dragger,
    meshLineScaleFac = 1,
}: {
    position: [number, number, number],
    dragger: IDraggerAgainstZPlane,
    meshLineScaleFac?: number,
} = $props();

const N_SEGMENTS = 16;

const offset = (i: number) => (i * 2 / (N_SEGMENTS - 1) - 1) * 0.25;
</script>


{#if dragger.hovering || dragger.dragging}
    {#if dragger.isMovingAlongZAxis}
        <T.Mesh>
            <MeshLineGeometry
                points={Array(N_SEGMENTS).fill(0).map((_, i) => new Vector3(
                    position[0],
                    position[1],
                    position[2] + offset(i),
                ))}
                shape="taper"
            />
            <MeshLineMaterial
                color="#aaf"
                width={0.025 * meshLineScaleFac}
            />
        </T.Mesh>
    {:else}
        <T.Mesh>
            <MeshLineGeometry
                points={Array(N_SEGMENTS).fill(0).map((_, i) => new Vector3(
                    position[0] + offset(i),
                    position[1],
                    position[2],
                ))}
                shape="taper"
            />
            <MeshLineMaterial
                color="#faa"
                width={0.025 * meshLineScaleFac}
            />
        </T.Mesh>
    {/if}

    <T.Mesh>
        <MeshLineGeometry
            points={Array(N_SEGMENTS).fill(0).map((_, i) => new Vector3(
                position[0],
                position[1] + offset(i),
                position[2],
            ))}
            shape="taper"
        />
        <MeshLineMaterial
            color="#afa"
            width={0.025 * meshLineScaleFac}
        />
    </T.Mesh>
{/if}
