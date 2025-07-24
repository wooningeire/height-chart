<script lang="ts">
import {T} from "@threlte/core";

let {
    position,
}: {
    position: [number, number, number],
} = $props();
</script>


<T.Mesh {position}>
    <T.BoxGeometry args={[0.05, 0.05, 0.05]} />
    <T.MeshToonMaterial emissive="#fff" />
</T.Mesh>