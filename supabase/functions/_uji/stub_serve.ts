// Stub uji: menangkap handler serve() tanpa membuka port.
export let handler: ((req: Request) => Promise<Response> | Response) | null = null;
export function serve(h: (req: Request) => Promise<Response> | Response) { handler = h; }
