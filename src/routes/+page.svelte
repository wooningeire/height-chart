<script lang="ts">
import "./index.scss";
import {Canvas} from "@threlte/core";
import Scene from "./Scene.svelte";
import { SvelteMap } from "svelte/reactivity";
import {Texture, Vector3, CubicBezierCurve3, PCFSoftShadowMap} from "three";
import { type Character } from "$lib/types/Character";
import NumberEntry from "@/NumberEntry.svelte";
import {CompositeCurve} from "$/lib/types/CompositeCurve.svelte";


const characters = $state(new SvelteMap<string, Character>());

let addedCharacter = $state<Character | null>(null);
let addedCharacterTexture = $state<Texture | null>(null);

const handleImageUpload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    
    if (files === null) return;
    const file = files[0];

    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.addEventListener("load", () => {
        addedCharacter = {
            id: file.name,
            name: file.name,
            imageUrl: reader.result as string,
            referenceCurve: new CompositeCurve({
                segments: [
                    new CubicBezierCurve3(
                        new Vector3(0.125, 0.125, 0),
                        new Vector3(0.35, 0.5, 0),
                        new Vector3(0.75, 0.35, 0),
                        new Vector3(0.875, 0.875, 0),
                    ),
                ],
                targetLength: 1,
            }),
        };
    });
    reader.readAsDataURL(file);
};

const id = $props.id();
</script>

<main>
    <div class="controls">
        {#if addedCharacter === null}
            <label for="image-upload" class="upload-btn">
                Add
                <input 
                    id="image-upload"
                    type="file" 
                    accept="image/*" 
                    onchange={handleImageUpload}
                />
            </label>
        {:else}
            <div>
                <img
                    src={addedCharacter.imageUrl}
                    alt={addedCharacter.name}
                />
            </div>

            <div>
                <label for="refcurve-length-{id}">Length of reference curve</label>

                <NumberEntry
                    value={addedCharacter.referenceCurve.targetLength}
                    onValueChange={value => {
                        if (addedCharacter === null) return;
                        addedCharacter.referenceCurve.targetLength = value;
                    }}
                    id="refcurve-length-{id}"
                />
            </div>
        {/if}
        
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
    </div>
    
    <Canvas shadows={PCFSoftShadowMap}>
        <Scene
            {characters}
            {addedCharacter}
            onAddedCharacterReferenceCurveChange={value => {
                if (addedCharacter === null) return;
                addedCharacter.referenceCurve.segments = value;
            }}
            onAddedCharacterTextureChange={value => addedCharacterTexture = value}
        />
    </Canvas>
</main>

<style lang="scss">
main {
    width: 100vw;
    height: 100vh;
    position: relative;
}

.controls {
    position: absolute;
    z-index: 1;
    padding: 1rem;

    background: oklch(1 0 0 / 0.5);
    backdrop-filter: blur(0.5rem);
}

.upload-btn {
    display: inline-block;
    padding: 10px 20px;
    background: #007bff;
    color: white;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: background 0.2s;
    
    &:hover {
        background: #0056b3;
    }
    
    input[type="file"] {
        display: none;
    }
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
        width: 40px;
        height: 40px;
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

img {
    max-width: 8rem;
}
</style>