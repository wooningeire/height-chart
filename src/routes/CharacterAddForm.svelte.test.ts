import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import CharacterAddForm from './CharacterAddForm.svelte';

vi.mock('$/lib/createTexture', () => ({
  createTextureFromFile: vi.fn(async (_file: File) => ({
    url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB',
    texture: { width: 100, height: 200 },
  })),
  createTextureFromUrl: vi.fn(async (_url: string) => ({ width: 100, height: 200 })),
}));



const createFile = (name = 'avatar.png', type = 'image/png') => new File([new Uint8Array([1, 2, 3])], name, { type });

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('CharacterAddForm.svelte', () => {
  it('shows Add a character initially and becomes Replace image after upload', async () => {
    const onCreate = vi.fn();
    const { container } = render(CharacterAddForm, { onCreate });

    // Initially shows Add a character button
    expect(screen.getByRole('button', { name: "Add a character" })).toBeInTheDocument();

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = createFile();

    // Create a proper FileList mock
    const fileList = {
      0: file,
      length: 1,
      item: (_: number) => file,
      [Symbol.iterator]: function* () {
        yield file;
      }
    };

    Object.defineProperty(input, 'files', {
      configurable: true,
      value: fileList,
    });

    // Trigger the change event with bubbles: true
    input.dispatchEvent(new Event('change', { bubbles: true }));

    // Wait for onCreate to be called (this means the file was processed)
    await vi.waitFor(() => {
      expect(onCreate).toHaveBeenCalledTimes(1);
    }, { timeout: 3000 });

    // After upload, onCreate is called and button label changes
    expect(screen.getByRole('button', { name: "Replace image" })).toBeInTheDocument();

    // Image preview should be visible
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('submits form and calls backend', async () => {
    const onSubmit = vi.fn();
    const { container } = render(CharacterAddForm, { onSubmit });

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = createFile();

    // Create a proper FileList mock
    const fileList = {
      0: file,
      length: 1,
      item: (_: number) => file,
      [Symbol.iterator]: function* () {
        yield file;
      }
    };

    Object.defineProperty(input, 'files', {
      configurable: true,
      value: fileList,
    });

    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ id: 7, imageUrl: 'https://example.com/img.png' }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    // Trigger the change event with bubbles: true
    input.dispatchEvent(new Event('change', { bubbles: true }));

    // Wait for Submit button to appear (this means file was processed)
    await vi.waitFor(() => {
      expect(screen.getByRole('button', { name: "Submit" })).toBeInTheDocument();
    }, { timeout: 3000 });

    // Click Submit
    const submitButton = screen.getByRole('button', { name: "Submit" });
    submitButton.click();

    // Backend called with PUT
    await vi.waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
    });

    expect(fetchMock).toHaveBeenCalledWith('/api/character', expect.objectContaining({
      method: 'PUT',
      body: expect.any(FormData)
    }));

    // onSubmit called
    await vi.waitFor(() => expect(onSubmit).toHaveBeenCalled());
  });
});

