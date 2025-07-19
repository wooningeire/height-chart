<script lang="ts">
import "./index.scss";
import {Canvas} from "@threlte/core";
import Scene from "./Scene.svelte";
</script>

<main>
    <Canvas>
        <Scene />
    </Canvas>
</main>

<style lang="scss">
main {
    width: 100vw;
    height: 100vh;
}
</style>