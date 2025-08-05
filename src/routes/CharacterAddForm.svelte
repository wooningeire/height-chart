<script lang="ts">
import { Character } from "$/lib/types/Character.svelte";
import Button from "@/Button.svelte";
import Separator from "@/Separator.svelte";
import {Texture, Vector3, TextureLoader, SRGBColorSpace} from "three";
import NumberEntry from "@/NumberEntry.svelte";
import {CompositeCurve} from "$/lib/types/CompositeCurve.svelte";
import { Bezier } from "$/lib/types/Bezier.svelte";
import TextEntry from "@/TextEntry.svelte";

    
let {
    onCreate,
    onCancel,
    onSubmit,
}: {
    onCreate?: (character: Character) => void,
    onCancel?: () => void,
    onSubmit?: (character: Character) => void,
} = $props();

let addedCharacter = $state.raw<Character | null>(null);


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

const createTextureFromUrl = (url: string) => {
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

const createTextureFromFile = async (file: File) => {
    const url = await readAsDataUrl(file);
    const texture = await createTextureFromUrl(url);
    return {url, texture};
};


let fileInputEl = $state<HTMLInputElement>()!;
const handleImageUpload = async () => {
    const files = fileInputEl.files;
    
    if (files === null) return null;
    const file = files[0];

    if (!file.type.startsWith("image/")) return null;

    const {url, texture} = await createTextureFromFile(file);

    if (addedCharacter === null) {
        addedCharacter = new Character({
            name: file.name,
            imageUrl: url,
            file,
            texture,
            referenceCurve: new CompositeCurve({
                segments: [
                    new Bezier({
                        start: new Vector3(0.125, 0.125, 0),
                        end: new Vector3(0.875, 0.875, 0),
                    }),
                ],
                targetLength: 1,
            }),
            offsetPos: new Vector3(texture.width / texture.height / 2, 0, 0),
        });

        onCreate?.(addedCharacter);
    } else {
        addedCharacter.imageUrl = url;
        addedCharacter.texture = texture;
        addedCharacter.offsetPos = new Vector3(texture.width / texture.height / 2, 0, 0);
    }
};

const id = $props.id();

const cancel = () => {
    onCancel?.();
    addedCharacter = null;
};

const submit = async () => {
    if (addedCharacter === null) return;

    const file = addedCharacter.file;
    if (file === null) return;

    const formData = new FormData();
    formData.append('name', addedCharacter.name);
    formData.append('targetLength', addedCharacter.referenceCurve.targetLength.toString());
    formData.append('offsetPos', JSON.stringify(addedCharacter.offsetPos.toArray()));
    formData.append('offsetScale', JSON.stringify([1, 1, 1]));
    formData.append('referenceCurve', JSON.stringify(addedCharacter.referenceCurve.segments.map(segment => {
        return [
            segment.start.toArray(),
            segment.end.toArray(),
            (segment.startDeriv ?? segment.start).toArray(),
            (segment.endDeriv ?? segment.end).toArray(),
        ];
    })));
    formData.append('file', file);

    const response = await fetch("/api/character", {
        method: "PUT",
        body: formData,
    });

    if (!response.ok) return;
    const { imageUrl } = await response.json();

    addedCharacter.imageUrl = imageUrl;
    addedCharacter.texture = await createTextureFromUrl(imageUrl);

    onSubmit?.(addedCharacter);
    addedCharacter = null;
};
</script>


<added-character-details>
    <Button onClick={() => fileInputEl.click()}>
        {#if addedCharacter === null}
            Add a character
        {:else}
            Replace image
        {/if}
    </Button>

    {#if addedCharacter !== null}
        <Button onClick={cancel}>
            Cancel
        </Button>

        <added-character-image>
            <img
                src={addedCharacter.imageUrl}
                alt={addedCharacter.name}
            />
        </added-character-image>

        <Separator />

        <div>
            <TextEntry
                value={addedCharacter.name}
                label="Character name"
                onValueChange={value => {
                    if (addedCharacter === null) return;
                    addedCharacter.name = value;
                }}
            />
        </div>

        <div>
            <NumberEntry
                value={addedCharacter.referenceCurve.targetLength}
                label="Length of reference curve"
                onValueChange={value => {
                    if (addedCharacter === null) return;
                    addedCharacter.referenceCurve.targetLength = value;
                }}
            />
        </div>

        <Separator />

        <Separator />

        <Button onClick={submit}>
            Submit
        </Button>
    {/if}
</added-character-details>
        
<input 
    id="image-upload-{id}"
    type="file" 
    accept="image/*" 
    onchange={handleImageUpload}
    bind:this={fileInputEl}
/>

<style lang="scss">
added-character-details {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

added-character-image {
    display: grid;
    place-items: center;
    width: 100%;
    max-height: 10rem;
}

input[type="file"] {
    display: none;
}


img {
    width: 100%;
    max-height: 10rem;
    object-fit: contain;

    filter: drop-shadow(0 0.0625rem 0.0625rem oklch(0 0 0 / 0.125));
}
</style>