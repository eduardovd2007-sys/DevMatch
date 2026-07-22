const fs = require('fs');
let stackHtml = fs.readFileSync('src/main/webapp/views/stack.html', 'utf8');
let liderHtml = fs.readFileSync('src/main/webapp/views/lider-proyecto.html', 'utf8');

const stackStart = stackHtml.indexOf('<div class="tech-category">');
const stackEnd = stackHtml.indexOf('</div>\n\n            <div class="action-footer">');
let newContent = stackHtml.substring(stackStart, stackEnd).trim();

// Replace tech-tag with stack-tag for lider-proyecto
newContent = newContent.replace(/class="tech-tag"/g, 'type="button" class="stack-tag"');

const liderStart = liderHtml.indexOf('<div class="stack-picker" id="stack-picker">') + '<div class="stack-picker" id="stack-picker">'.length;
const liderEnd = liderHtml.indexOf('  </div>\n  <input type="hidden" name="stack" id="stack-hidden" required>');

if (liderStart !== -1 && liderEnd !== -1) {
    const finalHtml = liderHtml.substring(0, liderStart) + '\n    \n    ' + newContent + '\n\n' + liderHtml.substring(liderEnd);
    fs.writeFileSync('src/main/webapp/views/lider-proyecto.html', finalHtml, 'utf8');
    console.log('Successfully updated lider-proyecto.html');
} else {
    console.log('Failed to find boundaries in lider-proyecto.html');
}
