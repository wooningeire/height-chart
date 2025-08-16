import { SRGBColorSpace, TextureLoader, type Texture } from "three";

export const createTextureFromUrl = (url: string) => {
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


export const createTextureFromFile = async (file: File) => {
    const url = await readAsDataUrl(file);
    const texture = await createTextureFromUrl(url);
    return {url, texture};
};