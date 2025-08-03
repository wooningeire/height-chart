<script lang="ts">
import "./index.scss";
import {Canvas} from "@threlte/core";
import Scene from "./Scene.svelte";
import { SvelteMap } from "svelte/reactivity";
import {PCFSoftShadowMap} from "three";
import { Character } from "$/lib/types/Character.svelte";
import CharacterAddForm from "./CharacterAddForm.svelte";
    import CharacterListitem from "./CharacterListitem.svelte";


const characters = $state(new SvelteMap<string, Character>());

let addedCharacter = $state<Character | null>(null);
</script>

<main>
    <character-overlay>
        <CharacterAddForm
            onCreate={character => addedCharacter = character}
            onCancel={() => addedCharacter = null}
            onSubmit={character => {
                addedCharacter = null;
                
                character.id = crypto.randomUUID();
                characters.set(character.id, character);
            }}
        />
        
        {#if characters.size > 0}
            <div class="character-list">
                <h3>Characters</h3>
                {#each characters as [id, character] (id)}
                    <CharacterListitem {character} />
                {/each}
            </div>
        {/if}
    </character-overlay>
    
    <scene-container>
        <Canvas shadows={PCFSoftShadowMap}>
            <Scene
                {characters}
                {addedCharacter}
            />
        </Canvas>
    </scene-container>
</main>

<style lang="scss">
main {
    width: 100vw;
    height: 100vh;
    position: relative;
    display: grid;
    place-items: stretch;
}

character-overlay {
    position: fixed;
    padding: 1rem;
    width: 16rem;

    background: oklch(1 0 0 / 0.5);
    backdrop-filter: blur(0.5rem);

    z-index: 1;
}

scene-container {
    grid-area: 1/1;

    user-select: none;
}


img {
    max-height: 10rem;
    object-fit: contain;

    filter: drop-shadow(0 0.0625rem 0.0625rem oklch(0 0 0 / 0.125));
}

.character-list {
    margin-top: 20px;
    
    h3 {
        margin: 0 0 10px 0;
        font-size: 16px;
    }
}

</style>