-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "cuatrimestre" INTEGER NOT NULL,
    "horas_semanales" INTEGER,
    "horario_preferido" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Habilidad" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Habilidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsuarioHabilidad" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "habilidad_id" INTEGER NOT NULL,
    "nivel" TEXT,

    CONSTRAINT "UsuarioHabilidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proyecto" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "creador_id" INTEGER NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'Abierto',
    "horario_requerido" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Proyecto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProyectoHabilidad" (
    "id" SERIAL NOT NULL,
    "proyecto_id" INTEGER NOT NULL,
    "habilidad_id" INTEGER NOT NULL,

    CONSTRAINT "ProyectoHabilidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Postulacion" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "proyecto_id" INTEGER NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'Pendiente',
    "fecha_postulacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Postulacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evaluacion" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,

    CONSTRAINT "Evaluacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pregunta" (
    "id" SERIAL NOT NULL,
    "evaluacion_id" INTEGER NOT NULL,
    "texto" TEXT NOT NULL,

    CONSTRAINT "Pregunta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Opcion" (
    "id" SERIAL NOT NULL,
    "pregunta_id" INTEGER NOT NULL,
    "texto_opcion" TEXT NOT NULL,
    "valor_peso" INTEGER NOT NULL,
    "categoria_asociada" TEXT,

    CONSTRAINT "Opcion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResultadoEvaluacion" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "evaluacion_id" INTEGER NOT NULL,
    "nivel_dominio" TEXT,
    "rol_psicometrico" TEXT,
    "fecha_realizacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResultadoEvaluacion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Habilidad_nombre_key" ON "Habilidad"("nombre");

-- AddForeignKey
ALTER TABLE "UsuarioHabilidad" ADD CONSTRAINT "UsuarioHabilidad_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioHabilidad" ADD CONSTRAINT "UsuarioHabilidad_habilidad_id_fkey" FOREIGN KEY ("habilidad_id") REFERENCES "Habilidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proyecto" ADD CONSTRAINT "Proyecto_creador_id_fkey" FOREIGN KEY ("creador_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProyectoHabilidad" ADD CONSTRAINT "ProyectoHabilidad_proyecto_id_fkey" FOREIGN KEY ("proyecto_id") REFERENCES "Proyecto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProyectoHabilidad" ADD CONSTRAINT "ProyectoHabilidad_habilidad_id_fkey" FOREIGN KEY ("habilidad_id") REFERENCES "Habilidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Postulacion" ADD CONSTRAINT "Postulacion_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Postulacion" ADD CONSTRAINT "Postulacion_proyecto_id_fkey" FOREIGN KEY ("proyecto_id") REFERENCES "Proyecto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pregunta" ADD CONSTRAINT "Pregunta_evaluacion_id_fkey" FOREIGN KEY ("evaluacion_id") REFERENCES "Evaluacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opcion" ADD CONSTRAINT "Opcion_pregunta_id_fkey" FOREIGN KEY ("pregunta_id") REFERENCES "Pregunta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResultadoEvaluacion" ADD CONSTRAINT "ResultadoEvaluacion_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResultadoEvaluacion" ADD CONSTRAINT "ResultadoEvaluacion_evaluacion_id_fkey" FOREIGN KEY ("evaluacion_id") REFERENCES "Evaluacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
