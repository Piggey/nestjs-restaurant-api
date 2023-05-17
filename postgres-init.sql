-- -- COPY THIS PART FROM `migration.sql` FILE GENERATED FROM COMMAND npm run db:migrate -- --
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CLIENT', 'EMPLOYEE', 'DELIVERY', 'MANAGER', 'BOSS');

-- CreateTable
CREATE TABLE "User" (
    "userId" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userEmail" TEXT NOT NULL,
    "userRole" "Role" NOT NULL DEFAULT 'CLIENT',
    "loyaltyPoints" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Employee" (
    "employeeId" SERIAL NOT NULL,
    "hiredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "firedAt" TIMESTAMP(3),
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "addressId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "restaurantId" INTEGER NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("employeeId")
);

-- CreateTable
CREATE TABLE "Manager" (
    "managerId" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,

    CONSTRAINT "Manager_pkey" PRIMARY KEY ("managerId")
);

-- CreateTable
CREATE TABLE "Menu" (
    "itemId" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ingredients" TEXT NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("itemId")
);

-- CreateTable
CREATE TABLE "Category" (
    "categoryId" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "categoryName" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("categoryId")
);

-- CreateTable
CREATE TABLE "Restaurant" (
    "restaurantId" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "geoLat" DOUBLE PRECISION NOT NULL,
    "geoLong" DOUBLE PRECISION NOT NULL,
    "managerId" INTEGER,
    "addressId" INTEGER NOT NULL,

    CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("restaurantId")
);

-- CreateTable
CREATE TABLE "Address" (
    "addressId" SERIAL NOT NULL,
    "street" TEXT NOT NULL,
    "streetNo" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("addressId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userEmail_key" ON "User"("userEmail");

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("addressId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("restaurantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Manager" ADD CONSTRAINT "Manager_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("employeeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("categoryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Restaurant" ADD CONSTRAINT "Restaurant_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "Manager"("managerId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Restaurant" ADD CONSTRAINT "Restaurant_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("addressId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- -- INSERT YOUR DATA HERE -- --
INSERT INTO "Address" VALUES (1, 'Aleje politechniki', '9', 'Łódź', '93-590', 'Poland');
INSERT INTO "Address" VALUES (2, 'Świętego Ducha', '16/24', 'Gdańsk', '80-834', 'Poland');
INSERT INTO "Address" VALUES (3, 'Stefanowskiego', '17', 'Łódź', '90-537', 'Poland');
INSERT INTO "Address" VALUES (4, 'Złota', '59', 'Warszawa', '00-120', 'Poland');
INSERT INTO "Address" VALUES (5, 'Senatorska', '24/26', 'Łódź', '93-192', 'Poland');
INSERT INTO "Address" VALUES (6, 'Gen. Walerego Wróblewskiego', '16/18', 'Łódź', '93-578', 'Poland');

INSERT INTO "Restaurant" ("restaurantId", "geoLat", "geoLong", "addressId") VALUES (1, 51.751579, 19.452930, 3);
INSERT INTO "Restaurant" ("restaurantId", "geoLat", "geoLong", "addressId") VALUES (2, 52.230652, 21.002310, 4);
INSERT INTO "Restaurant" ("restaurantId", "geoLat", "geoLong", "addressId") VALUES (3, 54.350910, 18.650740, 2);

INSERT INTO "User" ("userId", "userEmail", "userRole") VALUES (1, 'boss@sumatywny.pl', 'BOSS');
INSERT INTO "User" ("userId", "userEmail", "userRole") VALUES (2, 'manager@sumatywny.pl', 'MANAGER');
INSERT INTO "User" ("userId", "userEmail", "userRole") VALUES (3, 'delivery@sumatywny.pl', 'DELIVERY');
INSERT INTO "User" ("userId", "userEmail", "userRole") VALUES (4, 'employee@sumatywny.pl', 'EMPLOYEE');
INSERT INTO "User" ("userId", "userEmail", "userRole") VALUES (5, 'client@sumatywny.pl', 'CLIENT');
INSERT INTO "User" ("userId", "userEmail", "userRole") VALUES (6, '236653@edu.p.lodz.pl', 'BOSS');

INSERT INTO "Employee" ("employeeId", "firstName", "lastName", "addressId", "userId", "restaurantId") VALUES (1, 'Jan', 'Kowalski', 1, 4, 1);
INSERT INTO "Employee" ("employeeId", "firstName", "lastName", "addressId", "userId", "restaurantId") VALUES (2, 'Szymon', 'Rozwoźnik', 6, 3, 1);
INSERT INTO "Employee" ("employeeId", "firstName", "lastName", "addressId", "userId", "restaurantId") VALUES (3, 'Przemysław', 'Zarządzający', 5, 2, 1);

INSERT INTO "Manager" VALUES (1, 3);

