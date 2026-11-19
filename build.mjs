// index.html 内の画像 / CSS / JS 参照をすべてインラインに埋め込み、dist/index.html を生成
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { extname } from 'node:path';

const mime = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
let html = await readFile('index.html', 'utf8');

// <link rel="stylesheet" href="x.css"> → <style>
for (const m of [...html.matchAll(/<link[^>]+href="([^"]+\.css)"[^>]*>/g)]) {
  html = html.replace(m[0], `<style>\n${await readFile(m[1], 'utf8')}\n</style>`);
}
// <script src="x.js"></script> → inline
for (const m of [...html.matchAll(/<script[^>]+src="([^"]+\.js)"[^>]*><\/script>/g)]) {
  html = html.replace(m[0], `<script>\n${await readFile(m[1], 'utf8')}\n</script>`);
}
// images/xxx を base64 data URI に置換（src / CSS url() 両対応）
const refs = new Set([...html.matchAll(/images\/[\w.-]+\.(?:jpe?g|png|webp|svg)/g)].map((m) => m[0]));
for (const ref of refs) {
  const data = (await readFile(ref)).toString('base64');
  html = html.replaceAll(ref, `data:${mime[extname(ref)]};base64,${data}`);
}

await mkdir('.build', { recursive: true });
await writeFile('.build/index.html', html);
console.log(`.build/index.html (${(html.length / 1024).toFixed(0)} KB, 画像${refs.size}枚埋め込み)`);
