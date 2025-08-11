import { describe, it, expect } from 'vitest';
import { render } from '@threlte/test';
import ImagePlane from './ImagePlane.svelte';
import { Mesh, Texture } from 'three';

const createTexture = (width = 100, height = 50): Texture => {
    const texture = new Texture();
    texture.image = { width, height };
    texture.needsUpdate = false;

    return texture;
}

describe('ImagePlane', () => {
    it('renders a mesh with plane geometry sized by aspect ratio', () => {
        const texture = createTexture(200, 100);
        const { scene } = render(ImagePlane, { texture });

        const mesh = scene.getObjectByName("image-plane") as Mesh;
        expect(mesh).toBeDefined();

        // @ts-expect-error
        const params = mesh.geometry.parameters;
        expect(params.width).toBeCloseTo(2); // width is the aspect ratio
        expect(params.height).toBeCloseTo(1); // height is always 1
    });

    it('applies provided position and scale props to mesh', () => {
        const texture = createTexture(100, 100);
        const position: [number, number, number] = [1, 2, 3];
        const scale: [number, number, number] = [0.5, 0.5, 0.5];

        const { scene } = render(ImagePlane, {
            texture,
            position,
            scale,
        });

        const mesh = scene.getObjectByName("image-plane") as Mesh;
        expect(mesh.position.toArray()).toEqual(position);
        expect(mesh.scale.toArray()).toEqual(scale);
    });
});


