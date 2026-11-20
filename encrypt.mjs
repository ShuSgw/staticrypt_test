// .env の STATICRYPT_PASSWORD を（ターミナルの環境変数より優先して）使って暗号化する
// .env が無い環境（GitHub Actions）では環境変数 STATICRYPT_PASSWORD を使う
import { readFileSync, existsSync } from 'node:fs';
import { parseEnv } from 'node:util';
import { spawnSync } from 'node:child_process';

const password = existsSync('.env')
  ? parseEnv(readFileSync('.env', 'utf8')).STATICRYPT_PASSWORD
  : process.env.STATICRYPT_PASSWORD;
if (!password) throw new Error('STATICRYPT_PASSWORD が .env にも環境変数にもありません');

const args = [
  'node_modules/staticrypt/cli/index.js', '.build/index.html',
  '-d', 'dist', '--short', '-t', 'password_template.html',
  '--template-title', 'DUMMY STUDIO',
  '--template-instructions', 'パスワードを入力してください',
  '--template-button', 'ENTER',
  '--template-placeholder', 'Password',
  '--template-remember', 'ログイン状態を保存',
  '--template-error', 'パスワードが違います',
  '--template-color-primary', '#e4572e',
  '--template-color-secondary', '#1f2937',
];
const r = spawnSync(process.execPath, args, { stdio: 'inherit', env: { ...process.env, STATICRYPT_PASSWORD: password } });
process.exit(r.status ?? 1);
