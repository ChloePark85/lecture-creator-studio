## Video Rendering

Uses FFmpeg.wasm for client-side video rendering.

**Performance:**
- Rendering happens in browser
- ~1-2 minutes for 30 second video
- Requires modern browser with WebAssembly support

**Storage:**
- Videos uploaded to Supabase Storage
- Public bucket: `videos`
