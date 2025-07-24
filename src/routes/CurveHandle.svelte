<script lang="ts">
import {T} from "@threlte/core";

let {
    position,
}: {
    position: [number, number, number],
} = $props();
</script>


<T.Mesh {position}>
    <T.SphereGeometry args={[0.025]} />
    <T.MeshToonMaterial emissive="#fff" />
</T.Mesh>