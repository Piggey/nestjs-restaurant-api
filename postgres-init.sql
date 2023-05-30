-- -- COPY THIS PART FROM `migration.sql` FILE GENERATED FROM COMMAND npm run db:migrate -- --
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CLIENT', 'EMPLOYEE', 'DELIVERY', 'MANAGER', 'BOSS');

-- CreateEnum
CREATE TYPE "Weekday" AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');

-- CreateTable
CREATE TABLE "User" (
    "userId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userEmail" TEXT NOT NULL,
    "userRole" "Role" NOT NULL DEFAULT 'CLIENT',
    "loyaltyPoints" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Employee" (
    "employeeId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "hiredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "firedAt" TIMESTAMP(3),
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "addressId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "restaurantId" UUID NOT NULL,
    "jobId" UUID NOT NULL,
    "salary" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("employeeId")
);

-- CreateTable
CREATE TABLE "Job" (
    "jobId" UUID NOT NULL DEFAULT gen_random_uuid(),
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
    "managerId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "employeeId" UUID NOT NULL,

    CONSTRAINT "Manager_pkey" PRIMARY KEY ("managerId")
);

-- CreateTable
CREATE TABLE "Menu" (
    "itemId" UUID NOT NULL DEFAULT gen_random_uuid(),
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
    "categoryId" UUID NOT NULL,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("itemId")
);

-- CreateTable
CREATE TABLE "Category" (
    "categoryId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "categoryName" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("categoryId")
);

-- CreateTable
CREATE TABLE "Restaurant" (
    "restaurantId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "geoLat" DOUBLE PRECISION NOT NULL,
    "geoLon" DOUBLE PRECISION NOT NULL,
    "managerId" UUID,
    "addressId" UUID NOT NULL,

    CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("restaurantId")
);

-- CreateTable
CREATE TABLE "OpeningHours" (
    "openingHoursId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "weekday" "Weekday" NOT NULL,
    "startHourUtc" TIME(6) NOT NULL,
    "endHourUtc" TIME(6) NOT NULL,
    "restaurantId" UUID NOT NULL,

    CONSTRAINT "OpeningHours_pkey" PRIMARY KEY ("openingHoursId")
);

-- CreateTable
CREATE TABLE "Address" (
    "addressId" UUID NOT NULL DEFAULT gen_random_uuid(),
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
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("jobId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("restaurantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Manager" ADD CONSTRAINT "Manager_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("employeeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("categoryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Restaurant" ADD CONSTRAINT "Restaurant_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("addressId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Restaurant" ADD CONSTRAINT "Restaurant_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "Manager"("managerId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpeningHours" ADD CONSTRAINT "OpeningHours_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("restaurantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- -- INSERT YOUR DATA HERE -- --
INSERT INTO "Address" VALUES ('4aa52767-8aa9-4352-8200-639cd8334b99', 'Aleje politechniki', '9', 'Łódź', '93-590', 'Poland');
INSERT INTO "Address" VALUES ('b60d396f-50df-4aac-84dd-86bb05375fb7', 'Świętego Ducha', '16/24', 'Gdańsk', '80-834', 'Poland');
INSERT INTO "Address" VALUES ('182f153d-f29d-4ebc-9826-a24c13c66251', 'Stefanowskiego', '17', 'Łódź', '90-537', 'Poland');
INSERT INTO "Address" VALUES ('7d2b0aa9-000c-423f-a3d5-c5d97ec8a940', 'Złota', '59', 'Warszawa', '00-120', 'Poland');
INSERT INTO "Address" VALUES ('b96813fc-ca3a-4ba1-87ef-4ed7913a544a', 'Senatorska', '24/26', 'Łódź', '93-192', 'Poland');
INSERT INTO "Address" VALUES ('504594ec-8e4d-4391-82fa-02680ee6ad4d', 'Gen. Walerego Wróblewskiego', '16/18', 'Łódź', '93-578', 'Poland');

INSERT INTO "Restaurant" ("restaurantId", "geoLat", "geoLon", "addressId") VALUES ('35bfa561-c4fa-4e27-8789-c3387ee16e39', 51.751579, 19.452930, '182f153d-f29d-4ebc-9826-a24c13c66251');
INSERT INTO "Restaurant" ("restaurantId", "geoLat", "geoLon", "addressId") VALUES ('54ff5ab8-24db-4c67-8929-9ad5ba75735e', 52.230652, 21.002310, '7d2b0aa9-000c-423f-a3d5-c5d97ec8a940');
INSERT INTO "Restaurant" ("restaurantId", "geoLat", "geoLon", "addressId") VALUES ('00e21682-6ce6-45fd-8e5f-5306b70bb028', 54.350910, 18.650740, 'b60d396f-50df-4aac-84dd-86bb05375fb7');

INSERT INTO "OpeningHours" ("weekday", "startHourUtc", "endHourUtc", "restaurantId")
VALUES ('Monday', '10:00', '23:00', '35bfa561-c4fa-4e27-8789-c3387ee16e39');

INSERT INTO "OpeningHours" ("weekday", "startHourUtc", "endHourUtc", "restaurantId")
VALUES ('Tuesday', '10:00', '23:00', '35bfa561-c4fa-4e27-8789-c3387ee16e39');

INSERT INTO "OpeningHours" ("weekday", "startHourUtc", "endHourUtc", "restaurantId")
VALUES ('Wednesday', '10:00', '23:00', '35bfa561-c4fa-4e27-8789-c3387ee16e39');

INSERT INTO "OpeningHours" ("weekday", "startHourUtc", "endHourUtc", "restaurantId")
VALUES ('Thursday', '10:00', '23:00', '35bfa561-c4fa-4e27-8789-c3387ee16e39');

INSERT INTO "OpeningHours" ("weekday", "startHourUtc", "endHourUtc", "restaurantId")
VALUES ('Friday', '12:00', '23:00', '35bfa561-c4fa-4e27-8789-c3387ee16e39');

INSERT INTO "OpeningHours" ("weekday", "startHourUtc", "endHourUtc", "restaurantId")
VALUES ('Saturday', '12:00', '23:00', '35bfa561-c4fa-4e27-8789-c3387ee16e39');

INSERT INTO "OpeningHours" ("weekday", "startHourUtc", "endHourUtc", "restaurantId")
VALUES ('Sunday', '12:00', '22:00', '35bfa561-c4fa-4e27-8789-c3387ee16e39');

INSERT INTO "User" ("userId", "userEmail", "userRole") VALUES ('73e02b7b-59b8-48ca-bda6-a0b715a268fb', 'boss@sumatywny.pl', 'BOSS');
INSERT INTO "User" ("userId", "userEmail", "userRole") VALUES ('44e9a00e-a1a3-4db7-9f7f-a35108d114cf', 'manager@sumatywny.pl', 'MANAGER');
INSERT INTO "User" ("userId", "userEmail", "userRole") VALUES ('c36f3073-0f82-4fa3-a27d-23505134f6f9', 'delivery@sumatywny.pl', 'DELIVERY');
INSERT INTO "User" ("userId", "userEmail", "userRole") VALUES ('5e79edb4-b79e-490b-b1fd-10f79a1191bb', 'employee@sumatywny.pl', 'EMPLOYEE');
INSERT INTO "User" ("userId", "userEmail", "userRole") VALUES ('e1790b81-3ec6-4308-b18c-020f9e09d7a6', 'client@sumatywny.pl', 'CLIENT');
INSERT INTO "User" ("userId", "userEmail", "userRole") VALUES ('0b9c4e45-d9fd-49ad-b063-87cca6afa7f9', '236653@edu.p.lodz.pl', 'BOSS');

INSERT INTO "Job" ("jobId", "updatedAt", "jobTitle", "minSalary", "maxSalary", "role")
VALUES ('32589e2f-82bf-4228-9ead-d655eef038e4', CURRENT_TIMESTAMP, 'Chef', 50, 100, 'EMPLOYEE');

INSERT INTO "Job" ("jobId", "updatedAt", "jobTitle", "minSalary", "maxSalary", "role")
VALUES ('9e04c642-fa26-42d3-824b-5336f0dac5f2', CURRENT_TIMESTAMP, 'Chef''s assistant', 24, 40, 'EMPLOYEE');

INSERT INTO "Job" ("jobId", "updatedAt", "jobTitle", "minSalary", "maxSalary", "role")
VALUES ('32a145e0-2c83-4366-9126-d3ff36541cd9', CURRENT_TIMESTAMP, 'Food Delivery Driver', 24, 40, 'DELIVERY');

INSERT INTO "Job" ("jobId", "updatedAt", "jobTitle", "minSalary", "maxSalary", "role")
VALUES ('bd97e820-b448-4886-832a-1f40e8552a3b', CURRENT_TIMESTAMP, 'Manager', 80, 150, 'MANAGER');

INSERT INTO "Employee" ("firstName", "lastName", "addressId", "userId", "restaurantId", "jobId", "salary") 
VALUES ('Jan', 'Pracownik', '4aa52767-8aa9-4352-8200-639cd8334b99', '5e79edb4-b79e-490b-b1fd-10f79a1191bb', '35bfa561-c4fa-4e27-8789-c3387ee16e39', '32589e2f-82bf-4228-9ead-d655eef038e4', 85.25);

INSERT INTO "Employee" ("firstName", "lastName", "addressId", "userId", "restaurantId", "jobId", "salary") 
VALUES ('Szymon', 'Rozwoźnik', '504594ec-8e4d-4391-82fa-02680ee6ad4d', 'c36f3073-0f82-4fa3-a27d-23505134f6f9', '35bfa561-c4fa-4e27-8789-c3387ee16e39', '32a145e0-2c83-4366-9126-d3ff36541cd9', 30.13);

INSERT INTO "Employee" ("employeeId", "firstName", "lastName", "addressId", "userId", "restaurantId", "jobId", "salary") 
VALUES ('d951350b-be91-490c-98b6-1e8ab3a1bf42', 'Przemysław', 'Zarządzający', 'b96813fc-ca3a-4ba1-87ef-4ed7913a544a', '44e9a00e-a1a3-4db7-9f7f-a35108d114cf', '35bfa561-c4fa-4e27-8789-c3387ee16e39', 'bd97e820-b448-4886-832a-1f40e8552a3b', 100);

INSERT INTO "Manager" VALUES ('62ec2441-fc08-4f7d-8dc2-866d65260468', 'd951350b-be91-490c-98b6-1e8ab3a1bf42');
UPDATE "Restaurant" SET "managerId" = '62ec2441-fc08-4f7d-8dc2-866d65260468' WHERE "restaurantId" = '35bfa561-c4fa-4e27-8789-c3387ee16e39';

INSERT INTO "Category" ("categoryId", "categoryName") VALUES ('7f040fd7-a666-458e-8369-1ab201e589b6', 'Burgers');
INSERT INTO "Category" ("categoryId", "categoryName") VALUES ('f035a7e3-5eb7-4d6c-8d42-10d7549a9ed2', 'Pizza');
INSERT INTO "Category" ("categoryId", "categoryName") VALUES ('0d8eb1d2-610e-4716-90c9-6aea7e379b3d', 'Pasta');
INSERT INTO "Category" ("categoryId", "categoryName") VALUES ('bc657cdc-115f-42b5-835e-b364bc4f010f', 'Burrito');
INSERT INTO "Category" ("categoryId", "categoryName") VALUES ('9620178d-2154-4d38-becc-d47319a01f06', 'Salads');
INSERT INTO "Category" ("categoryId", "categoryName") VALUES ('76103531-ab85-49be-a777-adfe696223c7', 'Starters');
INSERT INTO "Category" ("categoryId", "categoryName") VALUES ('ade9714d-9b38-4557-a4dd-8495b5c4e29f', 'Drinks');
INSERT INTO "Category" ("categoryId", "categoryName") VALUES ('a44adc1a-08ba-460a-9cfc-996e56201dd1', 'Desserts');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Hamburger', 'https://drive.google.com/uc?id=1Lkshkjd8i1VVSj-gWYPod6Nh8lUo2Lbm',
    'Juicy, grilled hamburger with succulent meat, crunchy bun, and flavorful toppings',
    25.99, 4.46, 128, 'bun,beef,cucumber,tomato,onion,lettuce,original sauce', '7f040fd7-a666-458e-8369-1ab201e589b6');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Cheeseburger', 'https://drive.google.com/uc?id=1ffnvNbbUMtddRwzxhCA26MYvA8GAt-bH',
    'Tender, mouthwatering cheeseburger with juicy meat, perfectly melted cheese, and flavorful toppings',
    28.99, 4.24, 96, 'bun,beef,cucumber,tomato,onion,lettuce,cheese,original sauce', '7f040fd7-a666-458e-8369-1ab201e589b6');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Spicy Hamburger', 'https://drive.google.com/uc?id=19hI2eLhqt9uIJXu-ou9zHcV_tdtb0JaH',
    'Spicy and sizzling hamburger packed with fiery flavor, tender meat, and a kick of heat that will ignite your taste buds!',
    28.99, 4.87, 152, 'bun,beef,cucumber,tomato,onion,lettuce,chilli,spicy sauce', '7f040fd7-a666-458e-8369-1ab201e589b6');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Spicy Cheeseburger', 'https://drive.google.com/uc?id=13h71tmXDF1Je0B2mj0jZnCBPrmE3dbpw',
    'Very yummy! Spicy! Cheeseburger! Yummies :DD',
    29.99, 2.62, 152231, 'bun,beef,cucumber,tomato,onion,lettuce,cheese,chilli,hot sauce', '7f040fd7-a666-458e-8369-1ab201e589b6');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Chickburger', 'https://drive.google.com/uc?id=1a4EIYzc7MD0zgD_VX2PvIEe-Ujz1NWnK',
    'Crispy, succulent chickburger with a golden-brown coating and tender chicken',
    25.99, 3.52, 234, 'bun,breaded chicken,cucumber,tomato,onion,lettuce,homemade sauce', '7f040fd7-a666-458e-8369-1ab201e589b6');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Veganburger', 'https://drive.google.com/uc?id=1udxaPNaQHXPOzkz51DRDKh5OdAESdImK',
    'Indulge in a mouthwatering vegan burger with a juicy plant-based patty, fresh vegetables, and savory seasonings',
    29.99, 4.20, 69, 'bun,BeyondMeat,cucumber,tomato,onion,lettuce,vegan sauce', '7f040fd7-a666-458e-8369-1ab201e589b6');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Margherita', 'https://drive.google.com/uc?id=10-eVF6x_M_xHvOWbxg11VIlNDpg6EFdu',
    'Deliciously simple Margherita pizza with a thin, crispy crust, tangy tomato sauce, melted mozzarella cheese, and fragrant basil leaves',
    21.99, 4.97, 215, 'tomato sauce,mozzarella cheese,basil', 'f035a7e3-5eb7-4d6c-8d42-10d7549a9ed2');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Capriciosa', 'https://drive.google.com/uc?id=11PJu2IoU7cwJ-hHm9ZwkrVTJtm865sKT',
    'Exquisite Carpricosa pizza, with a medley of flavors of savory ham, fresh mushrooms, tangy olives, and gooey melted cheese',
    25.99, 4.65, 321, 'tomato sauce,mozzarella cheese,ham,mushrooms', 'f035a7e3-5eb7-4d6c-8d42-10d7549a9ed2');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Diavola', 'https://drive.google.com/uc?id=1yR8PVv3GVszjhggu1g6a8TSsDcbOViJs',
    'Diavola pizza, topped with spicy pepperoni, zesty tomato sauce, melted mozzarella cheese, and a hint of chili flakes',
    27.99, 3.55, 192, 'tomato sauce,mozzarella cheese,chorizo,chilli', 'f035a7e3-5eb7-4d6c-8d42-10d7549a9ed2');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Hawaiian', 'https://drive.google.com/uc?id=1e8WfEKEXiPPqmzBgIzTJx70D1Pkw3_U-',
    'Transport your taste buds to a tropical paradise with the Hawaiian pizza',
    25.99, 1.00, 168, 'tomato sauce,mozzarella cheese,ham,pineapple', 'f035a7e3-5eb7-4d6c-8d42-10d7549a9ed2');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Vegetarian', 'https://drive.google.com/uc?id=1E3iCM6UNQOo8SsId4UHfCZd9QGFF2Rks',
    'Savor the flavors of a delightful vegetarian pizza, topped with a colorful array of fresh vegetables',
    29.99, 4.02, 10, 'tomato sauce,vegan cheese,paprika,Beyond Meat', 'f035a7e3-5eb7-4d6c-8d42-10d7549a9ed2');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Pomodoro', 'https://drive.google.com/uc?id=1Y-fCkPET2SWtLUO6Zx2eAmolufjoDCIP',
    'Classic dish featuring al dente pasta tossed in a rich tomato sauce infused with aromatic herbs, garlic, and a hint of olive oil',
    25.99, 4.34, 102, 'pasta,tomato sauce,garlic,basil', '0d8eb1d2-610e-4716-90c9-6aea7e379b3d');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Arrabiata', 'https://drive.google.com/uc?id=1lm4RAIXDjW_rK0hj9Rnx8eQt5lyKpg9y',
    'Bold and spicy Arrabiata pasta, with perfectly cooked pasta smothered in a fiery tomato sauce, infused with garlic, chili flakes, and a hint of fresh herbs',
    25.99, 4.00, 152, 'pasta,tomato sauce,chilli,garlic,basil', '0d8eb1d2-610e-4716-90c9-6aea7e379b3d');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Carbonara', 'https://drive.google.com/uc?id=1Nfutj6OyyDO6t9nH1bzVcH1nIzF6ty6N',
    'Al dente spaghetti coated in a velvety sauce made with eggs, Parmesan cheese, crispy bacon',
    28.99, 4.76, 432, 'pasta,eggs,bacon,garlic,cheese', '0d8eb1d2-610e-4716-90c9-6aea7e379b3d');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Primavera', 'https://drive.google.com/uc?id=1Bi2vxgtvmM2Z73pqujdzVALmP2vI6CNj',
    'A vibrant dish filled with al dente pasta tossed with bell peppers, broccoli, cherry tomatoes, and a light, herb-infused sauce',
    32.99, 4.23, 211, 'rice noodles,pepper,onion,garlic,cherry tomatoes,zucchini,mushrooms,soy sauce', '0d8eb1d2-610e-4716-90c9-6aea7e379b3d');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Burrito de pollo', 'https://drive.google.com/uc?id=1bGB8MU9_6WuVA7OL-SXODYh4QsWVjPJI',
    'Chicken burrito, filled with tender chicken, melted cheese, beans, lettuce, tomatoes, and a zesty salsa',
    32.99, 3.98, 125, 'tortilla,chicken,beans,cheese,rice,hot sauce', 'bc657cdc-115f-42b5-835e-b364bc4f010f');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Vegan burrito', 'https://drive.google.com/uc?id=1z2pt9hktySZERO9fLYVYWu7_SIvhB_f5',
    'Packed with flavorful plant-based protein, black beans, fragrant herbs, and a zingy salsa',
    35.99, 4.12, 521, 'tortilla,jackfruit,beans,vegan cheese,rice,vegan sauce', 'bc657cdc-115f-42b5-835e-b364bc4f010f');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Burrito con carne', 'https://drive.google.com/uc?id=1ykLijrtSeByFPzytgfHh7X4VYhYHmSDN',
    'Tender, seasoned beef, melted cheese, savory beans, crisp lettuce, juicy tomatoes, and a smoky salsa',
    35.99, 4.92, 467, 'tortilla,beef,beans,cheese,rice,hot sauce', 'bc657cdc-115f-42b5-835e-b364bc4f010f');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Greek salad', 'https://drive.google.com/uc?id=1k-NhXX_kZd_b5KmVHUE2JeleUfnKmVmp',
    'Crisp lettuce, juicy tomatoes, cucumbers, tangy Kalamata olives, crumbled feta cheese, and a zesty dressing',
    25.99, 4.21, 658, 'iceberg lettuce,tomato,olives,cucumber,feta cheese,sauce', '9620178d-2154-4d38-becc-d47319a01f06');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Italian salad', 'https://drive.google.com/uc?id=1czZRiZFBTEO6BPeFcq_B0Keut38ytA_l',
    'Combining crisp lettuce, ripe tomatoes, fresh mozzarella cheese, tangy olives, and a drizzle of balsamic vinaigrette',
    28.99, 4.61, 145, 'iceberg lettuce,arugula,dried tomatoes,olives,cucumber,feta cheese,vinaigrette sauce', '9620178d-2154-4d38-becc-d47319a01f06');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Falafel', 'https://drive.google.com/uc?id=1Z2r_0kBIK12N4ck5oJ6Wonq7dh8isCSo',
    'Blend of chickpeas, herbs, and spices, served in a warm pita bread with fresh vegetables and a creamy tahini sauce',
    28.99, 3.81, 423, 'iceberg lettuce,falafel,tomato,cucumber,sauce', '9620178d-2154-4d38-becc-d47319a01f06');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'French fries', 'https://drive.google.com/uc?id=1K8Z2FgtNevOjs9i-u0xa1yJKyubCuRQr',
    NULL, 8.99, NULL, NULL, NULL, '76103531-ab85-49be-a777-adfe696223c7');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Nachos', 'https://drive.google.com/uc?id=1TqHe8gxXfcO8P3Qfo9XB4CvS1ZLVAqTK',
    NULL, 12.99, NULL, NULL, NULL, '76103531-ab85-49be-a777-adfe696223c7');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Sauce (tomato/spicy/vegan)', 'https://drive.google.com/uc?id=1mdBzJVArv5soKC7GUpbRbk_GKZnrjB-7',
    NULL, 2.99, NULL, NULL, NULL, '76103531-ab85-49be-a777-adfe696223c7');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Mozzarella sticks', 'https://drive.google.com/uc?id=1zX94bddG3QwVrcUkmXNGNI7Nzy8Yei-a',
    NULL, 9.99, NULL, NULL, NULL, '76103531-ab85-49be-a777-adfe696223c7');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Coca Cola (500ml)', 'https://drive.google.com/uc?id=1M6IDChF6vJ-nS5ewSUveTDx8-mjSB31x',
    NULL, 9.99, NULL, NULL, NULL, 'ade9714d-9b38-4557-a4dd-8495b5c4e29f');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Cappy (orange/apple) (250ml)', 'https://drive.google.com/uc?id=11rd2ZraiZ478lpx9dtq8EUrRTiuvONnD',
    NULL, 6.99, NULL, NULL, NULL, 'ade9714d-9b38-4557-a4dd-8495b5c4e29f');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Mineral water (250ml)', 'https://drive.google.com/uc?id=1yZPJMwSVCEQo1lhqeqFrvjDyFq-WV8aD',
    NULL, 4.99, NULL, NULL, NULL, 'ade9714d-9b38-4557-a4dd-8495b5c4e29f');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Tea', 'https://drive.google.com/uc?id=1b7bggJOHnuQg2D_dKW4-aMENNJWrqTPg',
    NULL, 9.99, NULL, NULL, NULL, 'ade9714d-9b38-4557-a4dd-8495b5c4e29f');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Latte', 'https://drive.google.com/uc?id=1lVsRxvVONjIYMcGvrKj8gAhgSEqfHS0B',
    NULL, 12.99, NULL, NULL, NULL, 'ade9714d-9b38-4557-a4dd-8495b5c4e29f');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Cappuccino', 'https://drive.google.com/uc?id=1p9VpJa8_1oqqkoWlJUMRcR-1KeP9zOtA',
    NULL, 14.99, NULL, NULL, NULL, 'ade9714d-9b38-4557-a4dd-8495b5c4e29f');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Shake (250ml)', 'https://drive.google.com/uc?id=1yjr_TXe_UfkFHqk618Vi6sMeHHIEqtCm',
    NULL, 16.99, NULL, NULL, NULL, 'ade9714d-9b38-4557-a4dd-8495b5c4e29f');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Brownie', 'https://drive.google.com/uc?id=1zEeV8q6bA2GVCRJ8XghJS9cRRIlW64Md',
    NULL, 14.99, NULL, NULL, NULL, 'a44adc1a-08ba-460a-9cfc-996e56201dd1');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Apple pie', 'https://drive.google.com/uc?id=1kvxJ82PWOqLSZnK_CvqbF0Dc2zCjV7G7',
    NULL, 14.99, NULL, NULL, NULL, 'a44adc1a-08ba-460a-9cfc-996e56201dd1');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Chocolate cake', 'https://drive.google.com/uc?id=1Hlj9if0QdWj6n3MMRbWqUJ6zsEOK0Yvd',
    NULL, 12.99, NULL, NULL, NULL, 'a44adc1a-08ba-460a-9cfc-996e56201dd1');
