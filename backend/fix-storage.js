const fs = require('fs');

function addUserNameToStorage(file) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/localStorage\.setItem\('currentUserId',\s*datos\.usuario\.id\);/g, 
        "localStorage.setItem('currentUserId', datos.usuario.id);\n        localStorage.setItem('userName', datos.usuario.nombre);");
    fs.writeFileSync(file, content);
}

addUserNameToStorage('c:/Users/eduar/Downloads/DevMatch-main (1)/DevMatch-main/src/main/webapp/views/registro.js');
addUserNameToStorage('c:/Users/eduar/Downloads/DevMatch-main (1)/DevMatch-main/src/main/webapp/views/login.html');
console.log('Storage fixed!');
