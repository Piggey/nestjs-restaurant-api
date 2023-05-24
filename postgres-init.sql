-- -- COPY THIS PART FROM `migration.sql` FILE GENERATED FROM COMMAND npm run db:migrate -- --
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CLIENT', 'EMPLOYEE', 'DELIVERY', 'MANAGER', 'BOSS');

-- CreateEnum
CREATE TYPE "Weekday" AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');

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
    "jobId" INTEGER NOT NULL,
    "salary" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("employeeId")
);

-- CreateTable
CREATE TABLE "Job" (
    "jobId" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "minSalary" DOUBLE PRECISION NOT NULL,
    "maxSalary" DOUBLE PRECISION NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("jobId")
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
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "rating" DOUBLE PRECISION,
    "numberOfRatings" INTEGER,
    "ingredients" TEXT,
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
    "available" BOOLEAN NOT NULL DEFAULT true,
    "geoLat" DOUBLE PRECISION NOT NULL,
    "geoLon" DOUBLE PRECISION NOT NULL,
    "managerId" INTEGER,
    "addressId" INTEGER NOT NULL,

    CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("restaurantId")
);

-- CreateTable
CREATE TABLE "OpeningHours" (
    "openingHoursId" SERIAL NOT NULL,
    "weekday" "Weekday" NOT NULL,
    "startHourUtc" TIME NOT NULL,
    "endHourUtc" TIME NOT NULL,
    "restaurantId" INTEGER NOT NULL,

    CONSTRAINT "OpeningHours_pkey" PRIMARY KEY ("openingHoursId")
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
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("jobId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Manager" ADD CONSTRAINT "Manager_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("employeeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("categoryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Restaurant" ADD CONSTRAINT "Restaurant_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "Manager"("managerId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Restaurant" ADD CONSTRAINT "Restaurant_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("addressId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpeningHours" ADD CONSTRAINT "OpeningHours_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("restaurantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- -- INSERT YOUR DATA HERE -- --
INSERT INTO "Address" VALUES (1, 'Aleje politechniki', '9', 'Łódź', '93-590', 'Poland');
INSERT INTO "Address" VALUES (2, 'Świętego Ducha', '16/24', 'Gdańsk', '80-834', 'Poland');
INSERT INTO "Address" VALUES (3, 'Stefanowskiego', '17', 'Łódź', '90-537', 'Poland');
INSERT INTO "Address" VALUES (4, 'Złota', '59', 'Warszawa', '00-120', 'Poland');
INSERT INTO "Address" VALUES (5, 'Senatorska', '24/26', 'Łódź', '93-192', 'Poland');
INSERT INTO "Address" VALUES (6, 'Gen. Walerego Wróblewskiego', '16/18', 'Łódź', '93-578', 'Poland');

INSERT INTO "Restaurant" ("restaurantId", "geoLat", "geoLon", "addressId") VALUES (1, 51.751579, 19.452930, 3);
INSERT INTO "Restaurant" ("restaurantId", "geoLat", "geoLon", "addressId") VALUES (2, 52.230652, 21.002310, 4);
INSERT INTO "Restaurant" ("restaurantId", "geoLat", "geoLon", "addressId") VALUES (3, 54.350910, 18.650740, 2);

INSERT INTO "OpeningHours" ("openingHoursId", "weekday", "startHourUtc", "endHourUtc", "restaurantId")
VALUES (1, 'Monday', '10:00', '23:00', 1);

INSERT INTO "OpeningHours" ("openingHoursId", "weekday", "startHourUtc", "endHourUtc", "restaurantId")
VALUES (2, 'Tuesday', '10:00', '23:00', 1);

INSERT INTO "OpeningHours" ("openingHoursId", "weekday", "startHourUtc", "endHourUtc", "restaurantId")
VALUES (3, 'Wednesday', '10:00', '23:00', 1);

INSERT INTO "OpeningHours" ("openingHoursId", "weekday", "startHourUtc", "endHourUtc", "restaurantId")
VALUES (4, 'Thursday', '10:00', '23:00', 1);

INSERT INTO "OpeningHours" ("openingHoursId", "weekday", "startHourUtc", "endHourUtc", "restaurantId")
VALUES (5, 'Friday', '12:00', '23:00', 1);

INSERT INTO "OpeningHours" ("openingHoursId", "weekday", "startHourUtc", "endHourUtc", "restaurantId")
VALUES (6, 'Saturday', '12:00', '23:00', 1);

INSERT INTO "OpeningHours" ("openingHoursId", "weekday", "startHourUtc", "endHourUtc", "restaurantId")
VALUES (7, 'Sunday', '12:00', '22:00', 1);

INSERT INTO "User" ("userId", "userEmail", "userRole") VALUES (1, 'boss@sumatywny.pl', 'BOSS');
INSERT INTO "User" ("userId", "userEmail", "userRole") VALUES (2, 'manager@sumatywny.pl', 'MANAGER');
INSERT INTO "User" ("userId", "userEmail", "userRole") VALUES (3, 'delivery@sumatywny.pl', 'DELIVERY');
INSERT INTO "User" ("userId", "userEmail", "userRole") VALUES (4, 'employee@sumatywny.pl', 'EMPLOYEE');
INSERT INTO "User" ("userId", "userEmail", "userRole") VALUES (5, 'client@sumatywny.pl', 'CLIENT');
INSERT INTO "User" ("userId", "userEmail", "userRole") VALUES (6, '236653@edu.p.lodz.pl', 'BOSS');

INSERT INTO "Job" ("jobId", "updatedAt", "jobTitle", "minSalary", "maxSalary", "role")
VALUES (1, CURRENT_TIMESTAMP, 'Chef', 50, 100, 'EMPLOYEE');

INSERT INTO "Job" ("jobId", "updatedAt", "jobTitle", "minSalary", "maxSalary", "role")
VALUES (2, CURRENT_TIMESTAMP, 'Chef''s assistant', 24, 40, 'EMPLOYEE');

INSERT INTO "Job" ("jobId", "updatedAt", "jobTitle", "minSalary", "maxSalary", "role")
VALUES (3, CURRENT_TIMESTAMP, 'Food Delivery Driver', 24, 40, 'DELIVERY');

INSERT INTO "Job" ("jobId", "updatedAt", "jobTitle", "minSalary", "maxSalary", "role")
VALUES (4, CURRENT_TIMESTAMP, 'Manager', 80, 150, 'MANAGER');

INSERT INTO "Employee" ("employeeId", "firstName", "lastName", "addressId", "userId", "restaurantId", "jobId", "salary") 
VALUES (1, 'Jan', 'Pracownik', 1, 4, 1, 1, 85.25);

INSERT INTO "Employee" ("employeeId", "firstName", "lastName", "addressId", "userId", "restaurantId", "jobId", "salary") 
VALUES (2, 'Szymon', 'Rozwoźnik', 6, 3, 1, 3, 30.13);

INSERT INTO "Employee" ("employeeId", "firstName", "lastName", "addressId", "userId", "restaurantId", "jobId", "salary") 
VALUES (3, 'Przemysław', 'Zarządzający', 5, 2, 1, 4, 100);

INSERT INTO "Manager" VALUES (1, 3);
UPDATE "Restaurant" SET "managerId" = 1 WHERE "restaurantId" = 1;

INSERT INTO "Category" ("categoryId", "categoryName") VALUES (1, 'Burgers');
INSERT INTO "Category" ("categoryId", "categoryName") VALUES (2, 'Pizza');
INSERT INTO "Category" ("categoryId", "categoryName") VALUES (3, 'Pasta');
INSERT INTO "Category" ("categoryId", "categoryName") VALUES (4, 'Burrito');
INSERT INTO "Category" ("categoryId", "categoryName") VALUES (5, 'Salads');
INSERT INTO "Category" ("categoryId", "categoryName") VALUES (6, 'Starters');
INSERT INTO "Category" ("categoryId", "categoryName") VALUES (7, 'Drinks');
INSERT INTO "Category" ("categoryId", "categoryName") VALUES (8, 'Desserts');

INSERT INTO "Menu" ("itemId", "updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (1, CURRENT_TIMESTAMP, 'Hamburger', 'https://drive.google.com/uc?id=1Lkshkjd8i1VVSj-gWYPod6Nh8lUo2Lbm',
    'Juicy, grilled hamburger with succulent meat, crunchy bun, and flavorful toppings',
    25.99, 4.46, 128, 'bun,beef,cucumber,tomato,onion,lettuce,original sauce', 1);

INSERT INTO "Menu" ("itemId", "updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (2, CURRENT_TIMESTAMP, 'Cheeseburger', 'https://drive.google.com/uc?id=1ffnvNbbUMtddRwzxhCA26MYvA8GAt-bH',
    'Tender, mouthwatering cheeseburger with juicy meat, perfectly melted cheese, and flavorful toppings',
    28.99, 4.24, 96, 'bun,beef,cucumber,tomato,onion,lettuce,cheese,original sauce', 1);

INSERT INTO "Menu" ("itemId", "updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (3, CURRENT_TIMESTAMP, 'Spicy Hamburger', 'https://drive.google.com/uc?id=19hI2eLhqt9uIJXu-ou9zHcV_tdtb0JaH',
    'Spicy and sizzling hamburger packed with fiery flavor, tender meat, and a kick of heat that will ignite your taste buds!',
    28.99, 4.87, 152, 'bun,beef,cucumber,tomato,onion,lettuce,chilli,spicy sauce', 1);

INSERT INTO "Menu" ("itemId", "updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (4, CURRENT_TIMESTAMP, 'Spicy Cheeseburger', 'https://drive.google.com/uc?id=13h71tmXDF1Je0B2mj0jZnCBPrmE3dbpw',
    'Very yummy! Spicy! Cheeseburger! Yummies :DD',
    29.99, 2.62, 152231, 'bun,beef,cucumber,tomato,onion,lettuce,cheese,chilli,hot sauce', 1);

INSERT INTO "Menu" ("itemId", "updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (5, CURRENT_TIMESTAMP, 'Chickburger', 'https://drive.google.com/uc?id=1a4EIYzc7MD0zgD_VX2PvIEe-Ujz1NWnK',
    'Crispy, succulent chickburger with a golden-brown coating and tender chicken',
    25.99, 3.52, 234, 'bun,breaded chicken,cucumber,tomato,onion,lettuce,homemade sauce', 1);

INSERT INTO "Menu" ("itemId", "updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (6, CURRENT_TIMESTAMP, 'Veganburger', 'https://drive.google.com/uc?id=1udxaPNaQHXPOzkz51DRDKh5OdAESdImK',
    'Indulge in a mouthwatering vegan burger with a juicy plant-based patty, fresh vegetables, and savory seasonings',
    29.99, 4.20, 69, 'bun,BeyondMeat,cucumber,tomato,onion,lettuce,vegan sauce', 1);

INSERT INTO "Menu" ("itemId", "updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (7, CURRENT_TIMESTAMP, 'Margherita', 'https://drive.google.com/uc?id=10-eVF6x_M_xHvOWbxg11VIlNDpg6EFdu',
    'Deliciously simple Margherita pizza with a thin, crispy crust, tangy tomato sauce, melted mozzarella cheese, and fragrant basil leaves',
    21.99, 4.97, 215, 'tomato sauce,mozzarella cheese,basil', 2);

INSERT INTO "Menu" ("itemId", "updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (8, CURRENT_TIMESTAMP, 'Capriciosa', 'https://drive.google.com/uc?id=11PJu2IoU7cwJ-hHm9ZwkrVTJtm865sKT',
    'Exquisite Carpricosa pizza, with a medley of flavors of savory ham, fresh mushrooms, tangy olives, and gooey melted cheese',
    25.99, 4.65, 321, 'tomato sauce,mozzarella cheese,ham,mushrooms', 2);

INSERT INTO "Menu" ("itemId", "updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (9, CURRENT_TIMESTAMP, 'Diavola', 'https://drive.google.com/uc?id=1yR8PVv3GVszjhggu1g6a8TSsDcbOViJs',
    'Diavola pizza, topped with spicy pepperoni, zesty tomato sauce, melted mozzarella cheese, and a hint of chili flakes',
    27.99, 3.55, 192, 'tomato sauce,mozzarella cheese,chorizo,chilli', 2);

INSERT INTO "Menu" ("itemId", "updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (10, CURRENT_TIMESTAMP, 'Hawaiian', 'https://drive.google.com/uc?id=1e8WfEKEXiPPqmzBgIzTJx70D1Pkw3_U-',
    'Transport your taste buds to a tropical paradise with the Hawaiian pizza',
    25.99, 1.00, 168, 'tomato sauce,mozzarella cheese,ham,pineapple', 2);

INSERT INTO "Menu" ("itemId", "updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (11, CURRENT_TIMESTAMP, 'Vegetarian', 'https://drive.google.com/uc?id=1E3iCM6UNQOo8SsId4UHfCZd9QGFF2Rks',
    'Savor the flavors of a delightful vegetarian pizza, topped with a colorful array of fresh vegetables',
    29.99, 4.02, 10, 'tomato sauce,vegan cheese,paprika,Beyond Meat', 2);

INSERT INTO "Menu" ("itemId", "updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (12, CURRENT_TIMESTAMP, 'Pomodoro', 'https://drive.google.com/uc?id=1Y-fCkPET2SWtLUO6Zx2eAmolufjoDCIP',
    'Classic dish featuring al dente pasta tossed in a rich tomato sauce infused with aromatic herbs, garlic, and a hint of olive oil',
    25.99, 4.34, 102, 'pasta,tomato sauce,garlic,basil', 3);

INSERT INTO "Menu" ("itemId", "updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (13, CURRENT_TIMESTAMP, 'Arrabiata', 'https://drive.google.com/uc?id=1lm4RAIXDjW_rK0hj9Rnx8eQt5lyKpg9y',
    'Bold and spicy Arrabiata pasta, with perfectly cooked pasta smothered in a fiery tomato sauce, infused with garlic, chili flakes, and a hint of fresh herbs',
    25.99, 4.00, 152, 'pasta,tomato sauce,chilli,garlic,basil', 3);

INSERT INTO "Menu" ("itemId", "updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (14, CURRENT_TIMESTAMP, 'Carbonara', 'https://drive.google.com/uc?id=1Nfutj6OyyDO6t9nH1bzVcH1nIzF6ty6N',
    'Al dente spaghetti coated in a velvety sauce made with eggs, Parmesan cheese, crispy bacon',
    28.99, 4.76, 432, 'pasta,eggs,bacon,garlic,cheese', 3);

INSERT INTO "Menu" ("itemId", "updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (15, CURRENT_TIMESTAMP, 'Primavera', 'https://drive.google.com/uc?id=1Bi2vxgtvmM2Z73pqujdzVALmP2vI6CNj',
    'A vibrant dish filled with al dente pasta tossed with bell peppers, broccoli, cherry tomatoes, and a light, herb-infused sauce',
    32.99, 4.23, 211, 'rice noodles,pepper,onion,garlic,cherry tomatoes,zucchini,mushrooms,soy sauce', 3);

INSERT INTO "Menu" ("itemId", "updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (16, CURRENT_TIMESTAMP, 'Burrito de pollo', 'https://drive.google.com/uc?id=1bGB8MU9_6WuVA7OL-SXODYh4QsWVjPJI',
    'Chicken burrito, filled with tender chicken, melted cheese, beans, lettuce, tomatoes, and a zesty salsa',
    32.99, 3.98, 125, 'tortilla,chicken,beans,cheese,rice,hot sauce', 4);

INSERT INTO "Menu" ("itemId", "updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (17, CURRENT_TIMESTAMP, 'Vegan burrito', 'https://drive.google.com/uc?id=1z2pt9hktySZERO9fLYVYWu7_SIvhB_f5',
    'Packed with flavorful plant-based protein, black beans, fragrant herbs, and a zingy salsa',
    35.99, 4.12, 521, 'tortilla,jackfruit,beans,vegan cheese,rice,vegan sauce', 4);

INSERT INTO "Menu" ("itemId", "updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (18, CURRENT_TIMESTAMP, 'Burrito con carne', 'https://drive.google.com/uc?id=1ykLijrtSeByFPzytgfHh7X4VYhYHmSDN',
    'Tender, seasoned beef, melted cheese, savory beans, crisp lettuce, juicy tomatoes, and a smoky salsa',
    35.99, 4.92, 467, 'tortilla,beef,beans,cheese,rice,hot sauce', 4);

INSERT INTO "Menu" ("itemId", "updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (19, CURRENT_TIMESTAMP, 'Greek salad', 'https://drive.google.com/uc?id=1k-NhXX_kZd_b5KmVHUE2JeleUfnKmVmp',
    'Crisp lettuce, juicy tomatoes, cucumbers, tangy Kalamata olives, crumbled feta cheese, and a zesty dressing',
    25.99, 4.21, 658, 'iceberg lettuce,tomato,olives,cucumber,feta cheese,sauce', 5);

INSERT INTO "Menu" ("itemId", "updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (20, CURRENT_TIMESTAMP, 'Italian salad', 'https://drive.google.com/uc?id=1czZRiZFBTEO6BPeFcq_B0Keut38ytA_l',
    'Combining crisp lettuce, ripe tomatoes, fresh mozzarella cheese, tangy olives, and a drizzle of balsamic vinaigrette',
    28.99, 4.61, 145, 'iceberg lettuce,arugula,dried tomatoes,olives,cucumber,feta cheese,vinaigrette sauce', 5);

INSERT INTO "Menu" ("itemId", "updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (21, CURRENT_TIMESTAMP, 'Falafel', 'https://drive.google.com/uc?id=1Z2r_0kBIK12N4ck5oJ6Wonq7dh8isCSo',
    'Blend of chickpeas, herbs, and spices, served in a warm pita bread with fresh vegetables and a creamy tahini sauce',
    28.99, 3.81, 423, 'iceberg lettuce,falafel,tomato,cucumber,sauce', 5);

INSERT INTO "Menu" ("itemId", "updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (22, CURRENT_TIMESTAMP, 'French fries', 'https://drive.google.com/uc?id=1K8Z2FgtNevOjs9i-u0xa1yJKyubCuRQr',
    NULL, 8.99, NULL, NULL, NULL, 6);

INSERT INTO "Menu" ("itemId", "updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (23, CURRENT_TIMESTAMP, 'Nachos', 'https://drive.google.com/uc?id=1TqHe8gxXfcO8P3Qfo9XB4CvS1ZLVAqTK',
    NULL, 12.99, NULL, NULL, NULL, 6);

INSERT INTO "Menu" ("itemId", "updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (24, CURRENT_TIMESTAMP, 'Sauce (tomato/spicy/vegan)', 'https://drive.google.com/uc?id=1mdBzJVArv5soKC7GUpbRbk_GKZnrjB-7',
    NULL, 2.99, NULL, NULL, NULL, 6);

INSERT INTO "Menu" ("itemId", "updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (25, CURRENT_TIMESTAMP, 'Mozzarella sticks', 'https://drive.google.com/uc?id=1zX94bddG3QwVrcUkmXNGNI7Nzy8Yei-a',
    NULL, 9.99, NULL, NULL, NULL, 6);

INSERT INTO "Menu" ("itemId", "updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (26, CURRENT_TIMESTAMP, 'Coca Cola (500ml)', 'https://drive.google.com/uc?id=1M6IDChF6vJ-nS5ewSUveTDx8-mjSB31x',
    NULL, 9.99, NULL, NULL, NULL, 7);

INSERT INTO "Menu" ("itemId", "updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (27, CURRENT_TIMESTAMP, 'Cappy (orange/apple) (250ml)', 'https://drive.google.com/uc?id=11rd2ZraiZ478lpx9dtq8EUrRTiuvONnD',
    NULL, 6.99, NULL, NULL, NULL, 7);

INSERT INTO "Menu" ("itemId", "updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (28, CURRENT_TIMESTAMP, 'Mineral water (250ml)', 'https://drive.google.com/uc?id=1yZPJMwSVCEQo1lhqeqFrvjDyFq-WV8aD',
    NULL, 4.99, NULL, NULL, NULL, 7);

INSERT INTO "Menu" ("itemId", "updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (29, CURRENT_TIMESTAMP, 'Tea', 'https://drive.google.com/uc?id=1b7bggJOHnuQg2D_dKW4-aMENNJWrqTPg',
    NULL, 9.99, NULL, NULL, NULL, 7);

INSERT INTO "Menu" ("itemId", "updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (30, CURRENT_TIMESTAMP, 'Latte', 'https://drive.google.com/uc?id=1lVsRxvVONjIYMcGvrKj8gAhgSEqfHS0B',
    NULL, 12.99, NULL, NULL, NULL, 7);

INSERT INTO "Menu" ("itemId", "updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (31, CURRENT_TIMESTAMP, 'Cappuccino', 'https://drive.google.com/uc?id=1p9VpJa8_1oqqkoWlJUMRcR-1KeP9zOtA',
    NULL, 14.99, NULL, NULL, NULL, 7);

INSERT INTO "Menu" ("itemId", "updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (32, CURRENT_TIMESTAMP, 'Shake (250ml)', 'https://drive.google.com/uc?id=1yjr_TXe_UfkFHqk618Vi6sMeHHIEqtCm',
    NULL, 16.99, NULL, NULL, NULL, 7);

INSERT INTO "Menu" ("itemId", "updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (33, CURRENT_TIMESTAMP, 'Brownie', 'https://drive.google.com/uc?id=1zEeV8q6bA2GVCRJ8XghJS9cRRIlW64Md',
    NULL, 14.99, NULL, NULL, NULL, 8);

INSERT INTO "Menu" ("itemId", "updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (34, CURRENT_TIMESTAMP, 'Apple pie', 'https://drive.google.com/uc?id=1kvxJ82PWOqLSZnK_CvqbF0Dc2zCjV7G7',
    NULL, 14.99, NULL, NULL, NULL, 8);

INSERT INTO "Menu" ("itemId", "updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (35, CURRENT_TIMESTAMP, 'Chocolate cake', 'https://drive.google.com/uc?id=1Hlj9if0QdWj6n3MMRbWqUJ6zsEOK0Yvd',
    NULL, 12.99, NULL, NULL, NULL, 8);
