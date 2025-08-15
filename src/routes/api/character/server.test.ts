import { describe, it, expect, vi, beforeEach } from 'vitest';

// Dynamic mocks so each test can control behavior
let mockRows: any[] = [];
let mockReturning: any[] = [];
let mockCreateSignedUrlImpl: any;
let mockUploadImpl: any;

vi.mock('$/lib/server/db', () => {
  return {
    db: {
      select: () => ({
        from: async () => mockRows,
      }),
      insert: () => ({
        values: () => ({
          returning: async () => mockReturning,
        }),
      }),
    },
  };
});

vi.mock('$/lib/server/db/schema', () => ({
  userTable: {},
  characterTable: {},
}));

vi.mock('$/lib/server/supabase', () => ({
  supabase: {
    storage: {
      from: () => ({
        createSignedUrl: (...args: any[]) => mockCreateSignedUrlImpl(...args),
        upload: (...args: any[]) => mockUploadImpl(...args),
      }),
    },
  },
}));

// Import after mocks
import { GET, PUT } from './+server';

const makeFile = (name = 'test.png', type = 'image/png') => {
  const data = new Uint8Array([137, 80, 78, 71]);
  return new File([data], name, { type });
};

beforeEach(() => {
  mockRows = [];
  mockReturning = [];
  mockCreateSignedUrlImpl = async () => ({ data: { signedUrl: 'https://example.com/signed.png' }, error: null });
  mockUploadImpl = async () => ({ error: null });
});

describe('api/character', () => {
  it('GET returns characters with signed image URLs', async () => {
    mockRows = [
      {
        id: 1,
        name: 'Alice',
        referenceCurve: [[[0,0,0],[1,1,0],[0,0,0],[1,1,0]]],
        targetLength: 1,
        offsetPos: [0, 0, 0],
        offsetScale: [1, 1, 1],
      },
    ];

    const res = await GET({} as any);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveLength(1);
    expect(body[0]).toMatchObject({ id: 1, name: 'Alice', imageUrl: expect.stringContaining('https://') });
  });

  it('PUT creates a character and returns id and signed URL', async () => {
    mockReturning = [{ id: 42 }];

    const form = new FormData();
    form.set('name', 'Bob');
    form.set('targetLength', String(1));
    form.set('offsetPos', JSON.stringify([0, 0, 0]));
    form.set('offsetScale', JSON.stringify([1, 1, 1]));
    form.set('referenceCurve', JSON.stringify([[[0,0,0],[1,1,0],[0,0,0],[1,1,0]]]));
    form.set('file', makeFile());

    const req = new Request('http://localhost/api/character', { method: 'PUT', body: form });

    const res = await PUT({ request: req } as any);
    expect(res.status).toBe(200);
    const body = JSON.parse(await res.text());
    expect(body).toEqual({ id: 42, imageUrl: expect.stringContaining('https://') });
  });
});

