// picsum.photos からランダム画像を取得して images/ に保存
import { writeFile, mkdir } from 'node:fs/promises';

const files = ['hero', 'card1', 'card2', 'card3', 'card4', 'card5', 'card6'];
await mkdir('images', { recursive: true });

for (const name of files) {
  const size = name === 'hero' ? '1600/700' : '600/400';
  const res = await fetch(`https://picsum.photos/${size}`); // 毎回ランダム（リダイレクト追従）
  if (!res.ok) throw new Error(`${name}: ${res.status}`);
  await writeFile(`images/${name}.jpg`, Buffer.from(await res.arrayBuffer()));
  console.log('saved', `images/${name}.jpg`);
}
