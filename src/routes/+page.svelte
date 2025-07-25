<script lang="ts">
import "./index.scss";
import {Canvas} from "@threlte/core";
import Scene from "./Scene.svelte";
import { SvelteMap } from "svelte/reactivity";
import {Texture, Vector3, CubicBezierCurve3, PCFSoftShadowMap, TextureLoader, SRGBColorSpace} from "three";
import { type Character } from "$lib/types/Character";
import NumberEntry from "@/NumberEntry.svelte";
import {CompositeCurve} from "$/lib/types/CompositeCurve.svelte";
import { Bezier } from "$/lib/types/Bezier.svelte";
    import Button from "@/Button.svelte";


const characters = $state(new SvelteMap<string, Character>());

let addedCharacter = $state<Character | null>(null);

const readAsDataUrl = (file: File) => {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            resolve(reader.result as string);
        });
        reader.addEventListener("error", reject);
        reader.readAsDataURL(file);
    });
};

const createTexture = (url: string) => {
    return new Promise<Texture>((resolve, reject) => {
        const loader = new TextureLoader();

        loader.load(
            url,
            loadedTexture => {
                if (loadedTexture === null) return;

                loadedTexture.colorSpace = SRGBColorSpace;
                loadedTexture.premultiplyAlpha = false;
                resolve(loadedTexture);
            },
            undefined,
            error => {
                reject(error);
            },
        );
    });
};

const loadTexture = async (file: File) => {
    const dataUrl = await readAsDataUrl(file);
    const texture = await createTexture(dataUrl);
    return {dataUrl, texture};
};

let fileInputEl = $state<HTMLInputElement>()!;
const handleImageUpload = async () => {
    const files = fileInputEl.files;
    
    if (files === null) return null;
    const file = files[0];

    if (!file.type.startsWith("image/")) return null;

    const {dataUrl, texture} = await loadTexture(file);

    if (addedCharacter === null) {
        addedCharacter = {
            id: file.name,
            name: file.name,
            imageUrl: dataUrl,
            texture,
            referenceCurve: new CompositeCurve({
                segments: [
                    new Bezier({
                        start: new Vector3(0.125, 0.125, 0),
                        end: new Vector3(0.875, 0.875, 0),
                        startDeriv: new Vector3(0.35, 0.5, 0),
                        endDeriv: new Vector3(0.75, 0.35, 0),
                    }),
                ],
                targetLength: 1,
            }),
        };
    } else {
        addedCharacter.id = file.name;
        addedCharacter.name = file.name;
        addedCharacter.imageUrl = dataUrl;
        addedCharacter.texture = texture;
    }
};

const id = $props.id();

</script>

<main>
    <div class="controls">
        <Button onClick={() => fileInputEl.click()}>
            {#if addedCharacter === null}
                Add a character
            {:else}
                Use a different image
            {/if}
        </Button>

        {#if addedCharacter !== null}
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
        />
    </Canvas>
</main>
        
<input 
    id="image-upload-{id}"
    type="file" 
    accept="image/*" 
    onchange={handleImageUpload}
    bind:this={fileInputEl}
/>

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
input[type="file"] {
    display: none;
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