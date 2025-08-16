import { describe, it, expect } from 'vitest';
import { render } from '@threlte/test';
import Scene from './Scene.svelte';
import { Vector3 } from 'three';
import { Character } from '$/lib/client/types/Character.svelte';
import { CompositeCurve } from '$/lib/client/types/CompositeCurve.svelte';
import { Bezier } from '$/lib/client/types/Bezier.svelte';
import type { Object3D } from 'three';

const createCharacter = (id = '1'): Character => {
  const curve = new CompositeCurve({
    segments: [
      new Bezier({
        start: new Vector3(0, 0, 0),
        end: new Vector3(1, 0, 0)
      })
    ],
    targetLength: 1
  });

  return new Character({
    id,
    name: `C${id}`,
    imageUrl: '',
    referenceCurve: curve,
    offsetPos: new Vector3(0, 0, 0)
  });
}

describe('Scene', () => {
    it('renders basic scene elements without errors', () => {
        const characters: [string, Character][] = [
            ['1', createCharacter('1')]
        ];

        const { scene } = render(Scene, { characters, addedCharacter: null });

        const dirLights = scene.children.filter((o: Object3D) => o.type === 'DirectionalLight');
        expect(dirLights.length).toBeGreaterThanOrEqual(1);
    });
});


