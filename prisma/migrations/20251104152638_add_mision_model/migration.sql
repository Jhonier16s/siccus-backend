-- CreateTable
CREATE TABLE "misiones" (
    "id_mision" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "completada" BOOLEAN NOT NULL DEFAULT false,
    "xp" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "misiones_pkey" PRIMARY KEY ("id_mision")
);
