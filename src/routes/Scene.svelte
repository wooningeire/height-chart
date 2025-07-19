<script lang="ts">
import {T} from "@threlte/core";
import {OrbitControls} from "@threlte/extras";
</script>

<T.DirectionalLight position={[0.25, 1, 0.5]} />
<T.AmbientLight color="#abcabc" />

<T.PerspectiveCamera
    makeDefault
    position={[5, 5, 5]}
>
    <OrbitControls />
</T.PerspectiveCamera>

<T.Mesh>
    <T.BoxGeometry />
    <T.MeshStandardMaterial />
</T.Mesh>

<T.Mesh>
    <T.PlaneGeometry />
    <T.MeshStandardMaterial />
</T.Mesh>