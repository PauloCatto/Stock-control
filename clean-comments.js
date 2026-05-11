const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.resolve(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            if (!file.includes('node_modules') && !file.includes('.git')) {
                results = results.concat(walk(file));
            }
        } else {
            if (file.endsWith('.ts') || file.endsWith('.scss') || file.endsWith('.html') || file.endsWith('.js')) {
                results.push(file);
            }
        }
    });
    return results;
}

const targetDir = process.argv[2] || './src';
const files = walk(targetDir);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/\/\*[\s\S]*?\*\//g, '');
    content = content.replace(/(^|[^\:])\/\/.*$/gm, '$1');
    fs.writeFileSync(file, content);
    console.log(`Cleaned: ${path.basename(file)}`);
});
