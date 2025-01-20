import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const glob = require('glob');
import gettextParser from 'gettext-parser';
import fs from 'fs';

// Ruta a tus plantillas .twig
const twigFiles = glob.sync('src/**/*.twig');

let potContent = '';

twigFiles.forEach((file) => {
    const content = fs.readFileSync(file, 'utf8');
    const matches = content.match(/__\('(.*?)'\)/g); // Ajusta este regex si usas otra función
    if (matches) {
        matches.forEach((match) => {
            const text = match.replace(/__\('|'\)/g, '');
            potContent += `msgid "${text}"\nmsgstr ""\n\n`;
        });
    }
});

fs.writeFileSync('./src/languages/app.pot', potContent);
console.log('Translation strings extracted from Twig templates.');

