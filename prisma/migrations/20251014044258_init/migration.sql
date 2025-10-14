-- CreateTable
CREATE TABLE "usuarios" (
    "id_usuario" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT,
    "contrasena" TEXT NOT NULL,
    "rol" TEXT NOT NULL DEFAULT 'usuario',
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "perfil_salud" (
    "id_perfil" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "edad" INTEGER,
    "peso" DECIMAL(65,30),
    "altura" DECIMAL(65,30),
    "objetivo" TEXT,
    "imc" DECIMAL(65,30),
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "perfil_salud_pkey" PRIMARY KEY ("id_perfil")
);

-- CreateTable
CREATE TABLE "progreso" (
    "id_progreso" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "energia" INTEGER NOT NULL DEFAULT 0,
    "salud" INTEGER NOT NULL DEFAULT 0,
    "nivel" INTEGER NOT NULL DEFAULT 1,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "progreso_pkey" PRIMARY KEY ("id_progreso")
);

-- CreateTable
CREATE TABLE "ejercicios" (
    "id_ejercicio" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "met" DECIMAL(65,30),

    CONSTRAINT "ejercicios_pkey" PRIMARY KEY ("id_ejercicio")
);

-- CreateTable
CREATE TABLE "actividades" (
    "id_actividad" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_ejercicio" INTEGER NOT NULL,
    "duracion_min" INTEGER NOT NULL,
    "calorias_quemadas" DECIMAL(65,30),
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "actividades_pkey" PRIMARY KEY ("id_actividad")
);

-- CreateTable
CREATE TABLE "recordatorios" (
    "id_recordatorio" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "hora" TIMESTAMP(3) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "recordatorios_pkey" PRIMARY KEY ("id_recordatorio")
);

-- CreateTable
CREATE TABLE "logros" (
    "id_logro" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "puntos_xp" INTEGER NOT NULL,
    "icono" TEXT,

    CONSTRAINT "logros_pkey" PRIMARY KEY ("id_logro")
);

-- CreateTable
CREATE TABLE "logros_usuario" (
    "id_logro_usuario" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_logro" INTEGER NOT NULL,
    "fecha_obtenido" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logros_usuario_pkey" PRIMARY KEY ("id_logro_usuario")
);

-- CreateTable
CREATE TABLE "configuraciones" (
    "id_config" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "idioma" TEXT NOT NULL DEFAULT 'es',
    "tema" TEXT NOT NULL DEFAULT 'claro',
    "notificaciones" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "configuraciones_pkey" PRIMARY KEY ("id_config")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "perfil_salud_id_usuario_key" ON "perfil_salud"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "configuraciones_id_usuario_key" ON "configuraciones"("id_usuario");

-- AddForeignKey
ALTER TABLE "perfil_salud" ADD CONSTRAINT "perfil_salud_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progreso" ADD CONSTRAINT "progreso_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actividades" ADD CONSTRAINT "actividades_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actividades" ADD CONSTRAINT "actividades_id_ejercicio_fkey" FOREIGN KEY ("id_ejercicio") REFERENCES "ejercicios"("id_ejercicio") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recordatorios" ADD CONSTRAINT "recordatorios_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logros_usuario" ADD CONSTRAINT "logros_usuario_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logros_usuario" ADD CONSTRAINT "logros_usuario_id_logro_fkey" FOREIGN KEY ("id_logro") REFERENCES "logros"("id_logro") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuraciones" ADD CONSTRAINT "configuraciones_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;
