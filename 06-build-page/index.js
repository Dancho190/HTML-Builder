const fs = require('fs').promises;
const path = require('path');

const projectDistPath = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const stylesPath = path.join(__dirname, 'styles');
const assetsPath = path.join(__dirname, 'assets');
const distAssetsPath = path.join(projectDistPath, 'assets');

// Create project-dist folder
async function createProjectDist() {
  await fs.mkdir(projectDistPath, { recursive: true });
}

async function replaceTemplateTags() {
  let templateContent = await fs.readFile(templatePath, 'utf-8');
  const tagPattern = /{{\s*([\w]+)\s*}}/g;

  const matches = [...templateContent.matchAll(tagPattern)];
  for (const match of matches) {
    const tagName = match[1];
    const componentPath = path.join(componentsPath, `${tagName}.html`);
    try {
      const componentContent = await fs.readFile(componentPath, 'utf-8');
      templateContent = templateContent.replace(match[0], componentContent);
    } catch (error) {
      console.error(`Component ${tagName} not found:`, error);
    }
  }

  const outputPath = path.join(projectDistPath, 'index.html');
  await fs.writeFile(outputPath, templateContent);
}

// Merge styles
async function mergeStyles() {
  const files = await fs.readdir(stylesPath, { withFileTypes: true });
  const cssFiles = files.filter(file => file.isFile() && path.extname(file.name) === '.css');

  let mergedStyles = '';
  for (const file of cssFiles) {
    const filePath = path.join(stylesPath, file.name);
    const content = await fs.readFile(filePath, 'utf-8');
    mergedStyles += content + '\n';
  }

  const outputPath = path.join(projectDistPath, 'style.css');
  await fs.writeFile(outputPath, mergedStyles);
}

async function copyAssets(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const items = await fs.readdir(src, { withFileTypes: true });

  for (const item of items) {
    const srcPath = path.join(src, item.name);
    const destPath = path.join(dest, item.name);

    if (item.isDirectory()) {
      await copyAssets(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

// Main function
(async () => {
  try {
    await createProjectDist();

    await replaceTemplateTags();

    await mergeStyles();

    await copyAssets(assetsPath, distAssetsPath);

    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
  }
})();
