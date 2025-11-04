-- CreateEnum
CREATE TYPE "MisionEstado" AS ENUM ('PENDIENTE', 'EN_PROGRESO', 'COMPLETADA');

-- CreateTable
CREATE TABLE "misiones_usuario" (
    "id_mision_usuario" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_mision" INTEGER NOT NULL,
    "estado" "MisionEstado" NOT NULL DEFAULT 'PENDIENTE',
    "progreso" INTEGER DEFAULT 0,
    "fecha_asignacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completada_at" TIMESTAMP(3),

    CONSTRAINT "misiones_usuario_pkey" PRIMARY KEY ("id_mision_usuario")
);

-- CreateIndex
CREATE UNIQUE INDEX "misiones_usuario_id_usuario_id_mision_key" ON "misiones_usuario"("id_usuario", "id_mision");

-- AddForeignKey
ALTER TABLE "misiones_usuario" ADD CONSTRAINT "misiones_usuario_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "misiones_usuario" ADD CONSTRAINT "misiones_usuario_id_mision_fkey" FOREIGN KEY ("id_mision") REFERENCES "misiones"("id_mision") ON DELETE RESTRICT ON UPDATE CASCADE;
