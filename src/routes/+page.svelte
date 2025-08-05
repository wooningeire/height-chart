<script lang="ts">
import "./index.scss";
import {Canvas} from "@threlte/core";
import Scene from "./Scene.svelte";
import { SvelteMap } from "svelte/reactivity";
import {PCFSoftShadowMap} from "three";
import { Character } from "$/lib/types/Character.svelte";
import CharacterAddForm from "./CharacterAddForm.svelte";
    import CharacterListitem from "./CharacterListitem.svelte";
    import Separator from "@/Separator.svelte";


const characters = $state(new SvelteMap<string, Character>());

const sortedCharacters = $derived(
    characters.entries()
        .toArray()
        .sort((a, b) => a[1].referenceCurve.targetScaleFac - b[1].referenceCurve.targetScaleFac)
);

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
            <character-list>
                <h3>Characters</h3>
                {#each sortedCharacters as [id, character] (id)}
                    <CharacterListitem {character} />
                {/each}
            </character-list>
        {/if}
    </character-overlay>
    
    <scene-container>
        <Canvas shadows={PCFSoftShadowMap}>
            <Scene
                characters={sortedCharacters}
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
    display: flex;
    flex-direction: column;
    gap: 1rem;

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

character-list {
    display: flex;
    gap: 0.5rem;
    flex-direction: column;
    align-items: stretch;
}

</style>