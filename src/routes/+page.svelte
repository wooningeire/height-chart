<script lang="ts">
import "./index.scss";
import {Canvas} from "@threlte/core";
import Scene from "./Scene.svelte";
import { SvelteMap } from "svelte/reactivity";
import {Texture, Vector3, CubicBezierCurve3, PCFSoftShadowMap, TextureLoader, SRGBColorSpace} from "three";
import { Character } from "$/lib/types/Character.svelte";
import NumberEntry from "@/NumberEntry.svelte";
import {CompositeCurve} from "$/lib/types/CompositeCurve.svelte";
import { Bezier } from "$/lib/types/Bezier.svelte";
    import Button from "@/Button.svelte";
    import Separator from "@/Separator.svelte";
    import { sub } from "three/tsl";
    import CharacterAddForm from "./CharacterAddForm.svelte";


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
                characters.set(character.id, character);
            }}
        />
        
        {#if characters.size > 0}
            <div class="character-list">
                <h3>Characters</h3>
                {#each characters as [id, character] (id)}
                    <div class="character">
                        <img src={character.imageUrl} alt={character.name} />
                        <span>{character.name}</span>
                        <!-- <button onclick={() => removeImage(id)}>Remove</button> -->
                    </div>
                {/each}
            </div>
        {/if}
    </character-overlay>
    
    <Canvas shadows={PCFSoftShadowMap}>
        <Scene
            {characters}
            {addedCharacter}
        />
    </Canvas>
</main>

<style lang="scss">
main {
    width: 100vw;
    height: 100vh;
    position: relative;
}

character-overlay {
    position: fixed;
    padding: 1rem;
    width: 16rem;

    background: oklch(1 0 0 / 0.5);
    backdrop-filter: blur(0.5rem);

    z-index: 1;
}


img {
    width: 100%;
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

.character {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
    padding: 8px;
    background: #f8f9fa;
    border-radius: 4px;
    
    img {
        width: 100%;
        max-height: 40px;
        object-fit: cover;
        border-radius: 4px;
    }
    
    span {
        flex: 1;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    
    button {
        padding: 4px 8px;
        background: #dc3545;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        
        &:hover {
            background: #c82333;
        }
    }
}
</style>