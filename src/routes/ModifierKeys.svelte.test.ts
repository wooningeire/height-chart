import { render } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import ModifierKeys, { modifierKeys } from "./ModifierKeys.svelte";

describe("./ModifierKeys.svelte", () => {
    it("should update shift key when pressed", () => {
        render(ModifierKeys);

        const keydownEvent = new KeyboardEvent("keydown", {
            key: "Shift",
            code: "ShiftLeft",
            altKey: false,
            ctrlKey: false,
            shiftKey: true,
            metaKey: false,
        });

        window.dispatchEvent(keydownEvent);

        expect(modifierKeys.shift).toBe(true);

        const keyupEvent = new KeyboardEvent("keyup", {
            key: "Shift",
            code: "ShiftLeft",
            altKey: false,
            ctrlKey: false,
            shiftKey: false,
            metaKey: false,
        });

        window.dispatchEvent(keyupEvent);

        expect(modifierKeys.shift).toBe(false);
    });

    it("should update ctrl key when pressed", () => {
        render(ModifierKeys);

        const keydownEvent = new KeyboardEvent("keydown", {
            key: "Control",
            code: "ControlLeft",
            altKey: false,
            ctrlKey: true,
            shiftKey: false,
            metaKey: false,
        });

        window.dispatchEvent(keydownEvent);

        expect(modifierKeys.ctrl).toBe(true);

        const keyupEvent = new KeyboardEvent("keyup", {
            key: "Control",
            code: "ControlLeft",
            altKey: false,
            ctrlKey: false,
            shiftKey: false,
            metaKey: false,
        });

        window.dispatchEvent(keyupEvent);

        expect(modifierKeys.ctrl).toBe(false);
    });

    it("should update alt key when pressed", () => {
        render(ModifierKeys);

        const keydownEvent = new KeyboardEvent("keydown", {
            key: "Alt",
            code: "AltLeft",
            altKey: true,
            ctrlKey: false,
            shiftKey: false,
            metaKey: false,
        });

        window.dispatchEvent(keydownEvent);

        expect(modifierKeys.alt).toBe(true);

        const keyupEvent = new KeyboardEvent("keyup", {
            key: "Alt",
            code: "AltLeft",
            altKey: false,
            ctrlKey: false,
            shiftKey: false,
            metaKey: false,
        });

        window.dispatchEvent(keyupEvent);

        expect(modifierKeys.alt).toBe(false);
    });

    it("should update meta key when pressed", () => {
        render(ModifierKeys);

        const keydownEvent = new KeyboardEvent("keydown", {
            key: "Meta",
            code: "MetaLeft",
            altKey: false,
            ctrlKey: false,
            shiftKey: false,
            metaKey: true,
        });

        window.dispatchEvent(keydownEvent);

        expect(modifierKeys.meta).toBe(true);

        const keyupEvent = new KeyboardEvent("keyup", {
            key: "Meta",
            code: "MetaLeft",
            altKey: false,
            ctrlKey: false,
            shiftKey: false,
            metaKey: false,
        });

        window.dispatchEvent(keyupEvent);

        expect(modifierKeys.meta).toBe(false);
    });
});