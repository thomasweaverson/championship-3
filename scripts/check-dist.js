import { existsSync } from 'fs';

if (!existsSync('dist')) {
  // eslint-disable-next-line no-console
  console.error(
    `
    ❌  Папка dist не найдена. Сначала следует выполнить npm run build
    `);
  process.exit(1);
}
