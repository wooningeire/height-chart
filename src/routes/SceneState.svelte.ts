import type { Camera } from "three";

export class SceneState {
    cameraControlsEnabled = $state(true);
    camera = $state<Camera>(null!);
}

export const sceneState = new SceneState();