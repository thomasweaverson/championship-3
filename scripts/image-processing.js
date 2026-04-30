import chokidar from 'chokidar';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { optimize } from 'svgo';

const VALID_RASTER = ['.jpg', '.jpeg', '.png'];
const VALID_SVG = ['.svg'];

const inputDir = 'src/assets/images/raw';
const outputDir = 'public/assets/images';

// Создаем папку, если её нет
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Функция проверки: нужно ли обновлять файл?
const shouldUpdate = (inputPath, outputPath) => {
  if (!fs.existsSync(outputPath)) {
    return true;
  }
  const inputStat = fs.statSync(inputPath);
  const outputStat = fs.statSync(outputPath);
  return inputStat.mtime > outputStat.mtime;
};

const processImage = async (file) => {
  const inputPath = path.join(inputDir, file);
  const { name, ext } = path.parse(file);
  const lowerExt = ext.toLowerCase();

  // Массив задач для параллельного выполнения
  const tasks = [];

  // 1. Оригинальный формат (jpg/png)
  const mainOutput = path.join(outputDir, `${name}${lowerExt}`);
  if (shouldUpdate(inputPath, mainOutput)) {
    const img = sharp(inputPath);
    tasks.push(
      lowerExt === '.png'
        ? img.png({ quality: 80 }).toFile(mainOutput)
        : img.jpeg({ quality: 75 }).toFile(mainOutput)
    );
  }

  // 2. WebP
  const webpOutput = path.join(outputDir, `${name}.webp`);
  if (shouldUpdate(inputPath, webpOutput)) {
    tasks.push(sharp(inputPath).webp({ quality: 75 }).toFile(webpOutput));
  }

  // 3. AVIF
  const avifOutput = path.join(outputDir, `${name}.avif`);
  if (shouldUpdate(inputPath, avifOutput)) {
    tasks.push(sharp(inputPath).avif({ quality: 50 }).toFile(avifOutput));
  }

  if (tasks.length > 0) {
    await Promise.all(tasks);
    // eslint-disable-next-line no-console
    console.log(`[images] processed: ${file}`);
  }
};

const processSVG = async (file) => {
  const inputPath = path.join(inputDir, file);
  const outputPath = path.join(outputDir, file);

  if (!shouldUpdate(inputPath, outputPath)) {
    return;
  }

  const svgContent = fs.readFileSync(inputPath, 'utf8');
  const result = optimize(svgContent, {
    path: file,
    multipass: true,
    plugins: [
      { name: 'removeViewBox', active: false },
      { name: 'removeMetadata', active: true },
    ],
  });

  fs.writeFileSync(outputPath, result.data);
  // eslint-disable-next-line no-console
  console.log(`[svg] optimized: ${file}`);
};

const cleanOrphans = () => {
  if (!fs.existsSync(outputDir)) {
    return;
  }
  const rawFiles = fs.readdirSync(inputDir).map((file) => path.parse(file).name);
  const readyFiles = fs.readdirSync(outputDir);

  readyFiles.forEach((file) => {
    const name = path.parse(file).name;
    if (!rawFiles.includes(name)) {
      fs.unlinkSync(path.join(outputDir, file));
      // eslint-disable-next-line no-console
      console.log(`[cleanup] deleted: ${file}`);
    }
  });
};

const isWatch = process.argv.includes('--watch');

const run = async () => {
  // eslint-disable-next-line no-console
  console.log('Starting image processing...');
  cleanOrphans();

  const files = fs.readdirSync(inputDir);
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (VALID_RASTER.includes(ext)) {
      await processImage(file);
    } else if (VALID_SVG.includes(ext)) {
      await processSVG(file);
    }
  }

  if (isWatch) {
    const watcher = chokidar.watch(inputDir, { ignoreInitial: true });

    watcher.on('all', async (event, filePath) => {
      const ext = path.extname(filePath).toLowerCase();
      const file = path.basename(filePath);

      if (event === 'add' || event === 'change') {
        if (VALID_RASTER.includes(ext)) {
          await processImage(file);
        } else if (VALID_SVG.includes(ext)) {
          await processSVG(file);
        }
      } else if (event === 'unlink') {
        const name = path.parse(file).name;
        fs.readdirSync(outputDir).forEach((f) => {
          if (f.startsWith(name)) {
            fs.unlinkSync(path.join(outputDir, f));
            // eslint-disable-next-line no-console
            console.log(`[removed] ${f}`);
          }
        });
      }
    });
    // eslint-disable-next-line no-console
    console.log('Watching for changes...');
  } else {
    // eslint-disable-next-line no-console
    console.log('Image processing complete.');
    process.exit(0);
  }
};

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
