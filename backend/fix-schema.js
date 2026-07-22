const fs = require('fs');
let c = fs.readFileSync('c:/Users/eduar/OneDrive/Desktop/devmatch-backend/prisma/schema.prisma', 'utf8');

c = c.replace(/\\n\\nmodel Notificacion \{[\s\S]*?\\n\}/g, ''); // Clean up mistake

const notificacionModel = `
model Notificacion {
  id          Int      @id @default(autoincrement())
  usuario_id  Int
  tipo        String
  titulo      String
  meta        String?
  leida       Boolean  @default(false)
  fecha       DateTime @default(now())

  usuario     Usuario  @relation(fields: [usuario_id], references: [id])
}
`;

if (!c.includes('model Notificacion')) {
    c += notificacionModel;
}

fs.writeFileSync('c:/Users/eduar/OneDrive/Desktop/devmatch-backend/prisma/schema.prisma', c);
console.log('Schema fixed');
