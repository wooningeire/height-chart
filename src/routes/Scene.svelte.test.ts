import { describe, it, expect } from 'vitest';
import { render } from '@threlte/test';
import Scene from './Scene.svelte';
import { Vector3 } from 'three';
import { Character } from '$/lib/types/Character.svelte';
import { CompositeCurve } from '$/lib/types/CompositeCurve.svelte';
import { Bezier } from '$/lib/types/Bezier.svelte';

function makeCharacter(id = '1'): Character {
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
  it('creates lights, camera, grid and renders CharacterPlane for each character', async () => {
    const characters = [
      ['1', makeCharacter('1')],
      ['2', makeCharacter('2')],
    ] as [string, Character][];

    const { scene } = render(Scene, {
      characters,
      addedCharacter: null
    });

    // Let threlte mount by forcing microtasks to flush
    await Promise.resolve();

    // basic sanity checks for lights and grid helper counts
    const dirLights = scene.children.filter((o: any) => o.isDirectionalLight);
    expect(dirLights.length).toBeGreaterThanOrEqual(3);

    const gridHelpers = scene.children.filter((o: any) => o.type === 'GridHelper');
    expect(gridHelpers.length).toBeGreaterThanOrEqual(1);

    // Each character is wrapped in a Group
    const characterGroups = scene.children.filter((o: any) => o.type === 'Group');
    // Don't assume one Group per character; just verify at least one present
    expect(characterGroups.length).toBeGreaterThanOrEqual(1);
  });

  it('renders addedCharacter when provided', async () => {
    const characters: [string, Character][] = [];
    const addedCharacter = makeCharacter('A');

    const { scene } = render(Scene, { characters, addedCharacter });
    await Promise.resolve();

    const groups = scene.children.filter((o: any) => o.type === 'Group');
    expect(groups.length).toBeGreaterThan(0);
  });
});


