import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getGoogleFontsLink,
  imageFileToBase64Png,
  injectSignatureFonts,
  renderSignatureText,
} from '@/app/sign/logic';

type MockCanvas = {
  width: number;
  height: number;
  getContext: (type: string) => {
    drawImage: (...args: unknown[]) => void;
    font: string;
    fillStyle: string;
    textBaseline: string;
    textAlign: string;
    measureText: (text: string) => { width: number };
    fillText: (...args: unknown[]) => void;
  } | null;
  toDataURL: (type: string) => string;
};

describe('STEP-F2-024 — DOM helper coverage in node', () => {
  const originalDocument = globalThis.document;
  const originalImage = (globalThis as unknown as { Image?: unknown }).Image;
  const originalURL = globalThis.URL;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(() => {
    if (originalDocument === undefined) {
      Reflect.deleteProperty(globalThis, 'document');
    } else {
      Object.defineProperty(globalThis, 'document', {
        configurable: true,
        value: originalDocument,
      });
    }

    (globalThis as unknown as { Image?: unknown }).Image = originalImage;
    globalThis.URL = originalURL;
  });

  it('builds google fonts URL containing all required families', () => {
    const url = getGoogleFontsLink();
    expect(url).toContain('Dancing+Script');
    expect(url).toContain('Caveat');
    expect(url).toContain('Satisfy');
    expect(url).toContain('Pacifico');
    expect(url.endsWith('&display=swap')).toBe(true);
  });

  it('injectSignatureFonts is no-op when document undefined', () => {
    Reflect.deleteProperty(globalThis, 'document');
    expect(() => injectSignatureFonts()).not.toThrow();
  });

  it('injectSignatureFonts inserts stylesheet once', () => {
    const headChildren: Array<{ id?: string; rel?: string; href?: string }> = [];

    const mockDocument = {
      getElementById: vi.fn((id: string) => headChildren.find((child) => child.id === id) ?? null),
      createElement: vi.fn(() => ({ id: '', rel: '', href: '' })),
      head: {
        appendChild: vi.fn((node: { id?: string; rel?: string; href?: string }) => {
          headChildren.push(node);
          return node;
        }),
      },
    };

    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: mockDocument,
    });

    injectSignatureFonts();
    injectSignatureFonts();

    expect(mockDocument.createElement).toHaveBeenCalledWith('link');
    expect(mockDocument.head.appendChild).toHaveBeenCalledTimes(1);
    expect(headChildren).toHaveLength(1);
    expect(headChildren[0]?.id).toBe('signature-fonts-link');
    expect(headChildren[0]?.rel).toBe('stylesheet');
    expect(headChildren[0]?.href).toContain('fonts.googleapis.com/css2?family=');
  });

  it('imageFileToBase64Png converts uploaded image via mocked canvas', async () => {
    const drawImage = vi.fn();
    const mockCtx = {
      drawImage,
      font: '',
      fillStyle: '',
      textBaseline: '',
      textAlign: '',
      measureText: (text: string) => ({ width: text.length * 20 }),
      fillText: vi.fn(),
    };

    const mockCanvas: MockCanvas = {
      width: 0,
      height: 0,
      getContext: vi.fn(() => mockCtx),
      toDataURL: vi.fn(() => 'data:image/png;base64,MOCK_IMAGE'),
    };

    const mockDocument = {
      createElement: vi.fn((tag: string) => {
        if (tag === 'canvas') return mockCanvas;
        return {};
      }),
      getElementById: vi.fn(() => null),
      head: { appendChild: vi.fn() },
    };

    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: mockDocument,
    });

    const createObjectURL = vi.fn(() => 'blob:mock');
    const revokeObjectURL = vi.fn();
    globalThis.URL = {
      ...originalURL,
      createObjectURL,
      revokeObjectURL,
    } as URL & typeof globalThis.URL;

    class MockImage {
      width = 1000;
      height = 600;
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      set src(_value: string) {
        if (this.onload) this.onload();
      }
    }

    (globalThis as unknown as { Image: typeof MockImage }).Image = MockImage;

    const file = { type: 'image/png', size: 200_000 } as File;
    const result = await imageFileToBase64Png(file);

    expect(result).toBe('data:image/png;base64,MOCK_IMAGE');
    expect(createObjectURL).toHaveBeenCalled();
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock');
    expect(mockCanvas.width).toBeGreaterThan(0);
    expect(mockCanvas.height).toBeGreaterThan(0);
    expect(drawImage).toHaveBeenCalled();
    expect(mockCanvas.toDataURL).toHaveBeenCalledWith('image/png');
  });

  it('imageFileToBase64Png throws when canvas context unavailable', async () => {
    const mockCanvas: MockCanvas = {
      width: 0,
      height: 0,
      getContext: vi.fn(() => null),
      toDataURL: vi.fn(() => 'data:image/png;base64,IGNORED'),
    };

    const mockDocument = {
      createElement: vi.fn((tag: string) => {
        if (tag === 'canvas') return mockCanvas;
        return {};
      }),
      getElementById: vi.fn(() => null),
      head: { appendChild: vi.fn() },
    };

    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: mockDocument,
    });

    globalThis.URL = {
      ...originalURL,
      createObjectURL: vi.fn(() => 'blob:no-canvas'),
      revokeObjectURL: vi.fn(),
    } as URL & typeof globalThis.URL;

    class MockImage {
      width = 320;
      height = 120;
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      set src(_value: string) {
        if (this.onload) this.onload();
      }
    }

    (globalThis as unknown as { Image: typeof MockImage }).Image = MockImage;

    const file = { type: 'image/png', size: 10_000 } as File;
    await expect(imageFileToBase64Png(file)).rejects.toThrow('Canvas tidak tersedia.');
  });

  it('imageFileToBase64Png throws when image load fails', async () => {
    const mockDocument = {
      createElement: vi.fn(() => ({
        width: 0,
        height: 0,
        getContext: () => ({ drawImage: vi.fn() }),
        toDataURL: () => 'data:image/png;base64,ANY',
      })),
      getElementById: vi.fn(() => null),
      head: { appendChild: vi.fn() },
    };

    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: mockDocument,
    });

    globalThis.URL = {
      ...originalURL,
      createObjectURL: vi.fn(() => 'blob:bad'),
      revokeObjectURL: vi.fn(),
    } as URL & typeof globalThis.URL;

    class FailingImage {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      set src(_value: string) {
        if (this.onerror) this.onerror();
      }
    }

    (globalThis as unknown as { Image: typeof FailingImage }).Image = FailingImage;

    const file = { type: 'image/jpeg', size: 10_000 } as File;
    await expect(imageFileToBase64Png(file)).rejects.toThrow('Gagal memuat gambar.');
  });

  it('renderSignatureText exports PNG data URL and writes text', async () => {
    const fillText = vi.fn();
    const mockCtx = {
      drawImage: vi.fn(),
      font: '',
      fillStyle: '',
      textBaseline: '',
      textAlign: '',
      measureText: vi.fn(() => ({ width: 180 })),
      fillText,
    };

    const mockCanvas: MockCanvas = {
      width: 0,
      height: 0,
      getContext: vi.fn(() => mockCtx),
      toDataURL: vi.fn(() => 'data:image/png;base64,MOCK_TEXT'),
    };

    const mockDocument = {
      createElement: vi.fn((tag: string) => {
        if (tag === 'canvas') return mockCanvas;
        return {};
      }),
      getElementById: vi.fn(() => null),
      head: { appendChild: vi.fn() },
    };

    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: mockDocument,
    });

    const result = await renderSignatureText('Faizz', "'Dancing Script', cursive", '#000000');

    expect(result).toBe('data:image/png;base64,MOCK_TEXT');
    expect(mockCtx.measureText).toHaveBeenCalledWith('Faizz');
    expect(fillText).toHaveBeenCalled();
    expect(mockCanvas.toDataURL).toHaveBeenCalledWith('image/png');
  });

  it('renderSignatureText throws when canvas context unavailable', async () => {
    const mockCanvas: MockCanvas = {
      width: 0,
      height: 0,
      getContext: vi.fn(() => null),
      toDataURL: vi.fn(() => 'data:image/png;base64,IGNORED'),
    };

    const mockDocument = {
      createElement: vi.fn((tag: string) => {
        if (tag === 'canvas') return mockCanvas;
        return {};
      }),
      getElementById: vi.fn(() => null),
      head: { appendChild: vi.fn() },
    };

    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: mockDocument,
    });

    await expect(renderSignatureText('A', "'Caveat', cursive", '#1E40AF')).rejects.toThrow(
      'Canvas tidak tersedia.',
    );
  });
});
