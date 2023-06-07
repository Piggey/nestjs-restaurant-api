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
    "photoUrl" TEXT NOT NULL,

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
    "openingHoursPretty" TEXT,
    "photoUrl" TEXT,
    "phoneNumber" TEXT,

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
INSERT INTO "Address" VALUES ('4aa52767-8aa9-4352-8200-639cd8334b99', 'Aleje politechniki', '9', 'Łódź', '93-590', 'Poland');
INSERT INTO "Address" VALUES ('b60d396f-50df-4aac-84dd-86bb05375fb7', 'Świętego Ducha', '16/24', 'Gdańsk', '80-834', 'Poland');
INSERT INTO "Address" VALUES ('182f153d-f29d-4ebc-9826-a24c13c66251', 'Stefanowskiego', '17', 'Łódź', '90-537', 'Poland');
INSERT INTO "Address" VALUES ('7d2b0aa9-000c-423f-a3d5-c5d97ec8a940', 'Złota', '59', 'Warszawa', '00-120', 'Poland');
INSERT INTO "Address" VALUES ('b96813fc-ca3a-4ba1-87ef-4ed7913a544a', 'Senatorska', '24/26', 'Łódź', '93-192', 'Poland');
INSERT INTO "Address" VALUES ('504594ec-8e4d-4391-82fa-02680ee6ad4d', 'Gen. Walerego Wróblewskiego', '16/18', 'Łódź', '93-578', 'Poland');

INSERT INTO "Address" VALUES ('e7bbe16b-f4e0-4595-9cfd-8b5a9e2721a0', 'Marszałkowska', '111', 'Warszawa', '00-190', 'Poland');
INSERT INTO "Restaurant" ("restaurantId", "geoLat", "geoLon", "addressId", "openingHoursPretty", "photoUrl", "phoneNumber") 
VALUES ('568abfc8-c710-4ed7-9659-64222ed9ca08', 52.22977, 21.01178, 'e7bbe16b-f4e0-4595-9cfd-8b5a9e2721a0', 'Monday - Friday: 8:00 - 20:00', 'https://media-cdn.tripadvisor.com/media/photo-s/06/5f/dd/4e/local-restaurant.jpg', '+48221234567');

INSERT INTO "OpeningHours" ("weekday", "startHourUtc", "endHourUtc", "restaurantId")
VALUES ('Monday', '08:00', '20:00', '568abfc8-c710-4ed7-9659-64222ed9ca08');
INSERT INTO "OpeningHours" ("weekday", "startHourUtc", "endHourUtc", "restaurantId")
VALUES ('Friday', '08:00', '20:00', '568abfc8-c710-4ed7-9659-64222ed9ca08');

INSERT INTO "Address" VALUES ('c9c3dd18-5967-4692-943f-a7d57b791b1f', 'Piotrkowska', '123', 'Łódź', '90-001', 'Poland');
INSERT INTO "Restaurant" ("restaurantId", "geoLat", "geoLon", "addressId", "openingHoursPretty", "photoUrl", "phoneNumber") 
VALUES ('10ca2473-4189-4802-b2eb-faf44115e062', 51.32124, 19.94771, 'c9c3dd18-5967-4692-943f-a7d57b791b1f', 'Monday - Friday: 8:00 - 20:00', 'https://media-cdn.tripadvisor.com/media/photo-s/06/5f/dd/4e/local-restaurant.jpg', '+48421234567');

INSERT INTO "OpeningHours" ("weekday", "startHourUtc", "endHourUtc", "restaurantId")
VALUES ('Monday', '08:00', '20:00', '10ca2473-4189-4802-b2eb-faf44115e062');
INSERT INTO "OpeningHours" ("weekday", "startHourUtc", "endHourUtc", "restaurantId")
VALUES ('Friday', '08:00', '20:00', '10ca2473-4189-4802-b2eb-faf44115e062');

INSERT INTO "Address" VALUES ('268fdced-5c88-4c14-a2f9-cd573dd528bd', 'Floriańska', '64', 'Kraków', '31-019', 'Poland');
INSERT INTO "Restaurant" ("restaurantId", "geoLat", "geoLon", "addressId", "openingHoursPretty", "photoUrl", "phoneNumber") 
VALUES ('22c2ca4d-ffa4-4dfd-9729-fb209faa3afa', 50.06143, 19.93658, '268fdced-5c88-4c14-a2f9-cd573dd528bd', 'Monday - Friday: 8:00 - 20:00', 'https://media-cdn.tripadvisor.com/media/photo-s/06/5f/dd/4e/local-restaurant.jpg', '+48123216745');

INSERT INTO "OpeningHours" ("weekday", "startHourUtc", "endHourUtc", "restaurantId")
VALUES ('Monday', '08:00', '20:00', '22c2ca4d-ffa4-4dfd-9729-fb209faa3afa');
INSERT INTO "OpeningHours" ("weekday", "startHourUtc", "endHourUtc", "restaurantId")
VALUES ('Friday', '08:00', '20:00', '22c2ca4d-ffa4-4dfd-9729-fb209faa3afa');

INSERT INTO "Restaurant" ("restaurantId", "geoLat", "geoLon", "addressId", "openingHoursPretty", "photoUrl", "phoneNumber") VALUES ('35bfa561-c4fa-4e27-8789-c3387ee16e39', 51.751579, 19.452930, '182f153d-f29d-4ebc-9826-a24c13c66251', 'Monday - Thursday: 10:00 - 23:00,Thursday - Saturday: 12:00 - 23:00,Sunday: 12:00 - 22:00', 'https://www.restauracje-jedzenie-online.pl/img/logo_tcom/indeks-lodz-lodz.png', '+48426367341');
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
INSERT INTO "User" ("userId", "userEmail", "userRole") VALUES ('6e8debf9-c462-435c-8265-faf85ccbdc4e', '236659@edu.p.lodz.pl', 'BOSS');
INSERT INTO "User" ("userId", "userEmail", "userRole") VALUES ('9dcc1dd1-8322-4abb-ab34-f30032c264d8', 'm.stepniak@yahoo.com', 'EMPLOYEE');

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

INSERT INTO "Employee" ("employeeId", "firstName", "lastName", "addressId", "userId", "restaurantId", "jobId", "salary") 
VALUES ('687421e6-e39a-43d3-a3e8-6053cd6fc2b5', 'Mikołaj', 'Stępniak', '504594ec-8e4d-4391-82fa-02680ee6ad4d', '9dcc1dd1-8322-4abb-ab34-f30032c264d8', '35bfa561-c4fa-4e27-8789-c3387ee16e39', '9e04c642-fa26-42d3-824b-5336f0dac5f2', 40);

INSERT INTO "Manager" VALUES ('62ec2441-fc08-4f7d-8dc2-866d65260468', 'd951350b-be91-490c-98b6-1e8ab3a1bf42');
UPDATE "Restaurant" SET "managerId" = '62ec2441-fc08-4f7d-8dc2-866d65260468' WHERE "restaurantId" = '35bfa561-c4fa-4e27-8789-c3387ee16e39';

INSERT INTO "Category" ("categoryId", "categoryName", "photoUrl") VALUES ('7f040fd7-a666-458e-8369-1ab201e589b6', 'burgers', 'https://i.ibb.co/bRwWJCW/burgers.png');
INSERT INTO "Category" ("categoryId", "categoryName", "photoUrl") VALUES ('f035a7e3-5eb7-4d6c-8d42-10d7549a9ed2', 'pizza', 'https://i.ibb.co/7rVgzfg/pizzas.png');
INSERT INTO "Category" ("categoryId", "categoryName", "photoUrl") VALUES ('0d8eb1d2-610e-4716-90c9-6aea7e379b3d', 'pasta', 'https://i.ibb.co/wp7W6YX/pastas.png');
INSERT INTO "Category" ("categoryId", "categoryName", "photoUrl") VALUES ('bc657cdc-115f-42b5-835e-b364bc4f010f', 'burrito', 'https://i.ibb.co/LNZtK5P/burittos.png');
INSERT INTO "Category" ("categoryId", "categoryName", "photoUrl") VALUES ('9620178d-2154-4d38-becc-d47319a01f06', 'salads', 'https://i.ibb.co/3s5cmGp/salads.png');
INSERT INTO "Category" ("categoryId", "categoryName", "photoUrl") VALUES ('76103531-ab85-49be-a777-adfe696223c7', 'starters', 'https://i.ibb.co/nbnmp3r/starters.png');
INSERT INTO "Category" ("categoryId", "categoryName", "photoUrl") VALUES ('ade9714d-9b38-4557-a4dd-8495b5c4e29f', 'drinks', 'https://i.ibb.co/RCpqf9h/drinks.png');
INSERT INTO "Category" ("categoryId", "categoryName", "photoUrl") VALUES ('a44adc1a-08ba-460a-9cfc-996e56201dd1', 'desserts', 'https://i.ibb.co/RjkJ4rp/desserts.png');
INSERT INTO "Category" ("categoryId", "categoryName", "photoUrl") VALUES ('87768254-e8ed-412b-8f1b-89521c034fe7', 'sets', 'https://i.ibb.co/dQX8hXW/food-sets.png');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Hamburger', 'https://i.ibb.co/Q8Vx7Jx/hamburger-v2.jpg',
    'Juicy, grilled hamburger with succulent meat, crunchy bun, and flavorful toppings',
    25.99, 4.46, 128, 'bun,beef,cucumber,tomato,onion,lettuce,original sauce', '7f040fd7-a666-458e-8369-1ab201e589b6');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Cheeseburger', 'https://i.ibb.co/3fWZMR0/cheeseburger.jpg',
    'Tender, mouthwatering cheeseburger with juicy meat, perfectly melted cheese, and flavorful toppings',
    28.99, 4.24, 96, 'bun,beef,cucumber,tomato,onion,lettuce,cheese,original sauce', '7f040fd7-a666-458e-8369-1ab201e589b6');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Spicy Hamburger', 'https://i.ibb.co/rtCYDvS/hamburger-v1.jpg',
    'Spicy and sizzling hamburger packed with fiery flavor, tender meat, and a kick of heat that will ignite your taste buds!',
    28.99, 4.87, 152, 'bun,beef,cucumber,tomato,onion,lettuce,chilli,spicy sauce', '7f040fd7-a666-458e-8369-1ab201e589b6');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Spicy Cheeseburger', 'https://i.ibb.co/9h6hSjs/spicy-cheeseburger.jpg',
    'Very yummy! Spicy! Cheeseburger! Yummies :DD',
    29.99, 2.62, 152231, 'bun,beef,cucumber,tomato,onion,lettuce,cheese,chilli,hot sauce', '7f040fd7-a666-458e-8369-1ab201e589b6');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Chickburger', 'https://i.ibb.co/pJYhQV5/chickburger.jpg',
    'Crispy, succulent chickburger with a golden-brown coating and tender chicken',
    25.99, 3.52, 234, 'bun,breaded chicken,cucumber,tomato,onion,lettuce,homemade sauce', '7f040fd7-a666-458e-8369-1ab201e589b6');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Veganburger', 'https://i.ibb.co/8KL8YSM/vegan-burger-v2.jpg',
    'Indulge in a mouthwatering vegan burger with a juicy plant-based patty, fresh vegetables, and savory seasonings',
    29.99, 4.20, 69, 'bun,BeyondMeat,cucumber,tomato,onion,lettuce,vegan sauce', '7f040fd7-a666-458e-8369-1ab201e589b6');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Margherita', 'https://i.ibb.co/qsZm0vL/margherita.jpg',
    'Deliciously simple Margherita pizza with a thin, crispy crust, tangy tomato sauce, melted mozzarella cheese, and fragrant basil leaves',
    21.99, 4.97, 215, 'tomato sauce,mozzarella cheese,basil', 'f035a7e3-5eb7-4d6c-8d42-10d7549a9ed2');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Capriciosa', 'https://i.ibb.co/4pfLW9F/capriciosa.jpg',
    'Exquisite Carpricosa pizza, with a medley of flavors of savory ham, fresh mushrooms, tangy olives, and gooey melted cheese',
    25.99, 4.65, 321, 'tomato sauce,mozzarella cheese,ham,mushrooms', 'f035a7e3-5eb7-4d6c-8d42-10d7549a9ed2');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Diavola', 'https://i.ibb.co/P6RBDTY/diavola.jpg',
    'Diavola pizza, topped with spicy pepperoni, zesty tomato sauce, melted mozzarella cheese, and a hint of chili flakes',
    27.99, 3.55, 192, 'tomato sauce,mozzarella cheese,chorizo,chilli', 'f035a7e3-5eb7-4d6c-8d42-10d7549a9ed2');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Hawaiian', 'https://i.ibb.co/gRJkGnX/hawajska.jpg',
    'Transport your taste buds to a tropical paradise with the Hawaiian pizza',
    25.99, 1.00, 168, 'tomato sauce,mozzarella cheese,ham,pineapple', 'f035a7e3-5eb7-4d6c-8d42-10d7549a9ed2');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Vegetarian', 'https://i.ibb.co/hsjTC9W/wege.jpg',
    'Savor the flavors of a delightful vegetarian pizza, topped with a colorful array of fresh vegetables',
    29.99, 4.02, 10, 'tomato sauce,vegan cheese,paprika,Beyond Meat', 'f035a7e3-5eb7-4d6c-8d42-10d7549a9ed2');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Pomodoro', 'https://i.ibb.co/2hR7QfJ/pomodoro-v1.jpg',
    'Classic dish featuring al dente pasta tossed in a rich tomato sauce infused with aromatic herbs, garlic, and a hint of olive oil',
    25.99, 4.34, 102, 'pasta,tomato sauce,garlic,basil', '0d8eb1d2-610e-4716-90c9-6aea7e379b3d');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Arrabiata', 'https://i.ibb.co/0FD2Bbf/arrabiata.jpg',
    'Bold and spicy Arrabiata pasta, with perfectly cooked pasta smothered in a fiery tomato sauce, infused with garlic, chili flakes, and a hint of fresh herbs',
    25.99, 4.00, 152, 'pasta,tomato sauce,chilli,garlic,basil', '0d8eb1d2-610e-4716-90c9-6aea7e379b3d');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Carbonara', 'https://i.ibb.co/sFL34kb/carbonara.jpg',
    'Al dente spaghetti coated in a velvety sauce made with eggs, Parmesan cheese, crispy bacon',
    28.99, 4.76, 432, 'pasta,eggs,bacon,garlic,cheese', '0d8eb1d2-610e-4716-90c9-6aea7e379b3d');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Primavera', 'https://i.ibb.co/rQqnTC5/primavera.jpg',
    'A vibrant dish filled with al dente pasta tossed with bell peppers, broccoli, cherry tomatoes, and a light, herb-infused sauce',
    32.99, 4.23, 211, 'rice noodles,pepper,onion,garlic,cherry tomatoes,zucchini,mushrooms,soy sauce', '0d8eb1d2-610e-4716-90c9-6aea7e379b3d');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Burrito de pollo', 'https://i.ibb.co/WtyVM6D/burrito-kurczak.jpg',
    'Chicken burrito, filled with tender chicken, melted cheese, beans, lettuce, tomatoes, and a zesty salsa',
    32.99, 3.98, 125, 'tortilla,chicken,beans,cheese,rice,hot sauce', 'bc657cdc-115f-42b5-835e-b364bc4f010f');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Vegan burrito', 'https://i.ibb.co/5kZXVgt/burrito-weganskie.jpg',
    'Packed with flavorful plant-based protein, black beans, fragrant herbs, and a zingy salsa',
    35.99, 4.12, 521, 'tortilla,jackfruit,beans,vegan cheese,rice,vegan sauce', 'bc657cdc-115f-42b5-835e-b364bc4f010f');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Burrito con carne', 'https://i.ibb.co/yhPjtwG/burrito-z-wolowina.jpg',
    'Tender, seasoned beef, melted cheese, savory beans, crisp lettuce, juicy tomatoes, and a smoky salsa',
    35.99, 4.92, 467, 'tortilla,beef,beans,cheese,rice,hot sauce', 'bc657cdc-115f-42b5-835e-b364bc4f010f');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Greek salad', 'https://i.ibb.co/xDxgZnq/grecka.jpg',
    'Crisp lettuce, juicy tomatoes, cucumbers, tangy Kalamata olives, crumbled feta cheese, and a zesty dressing',
    25.99, 4.21, 658, 'iceberg lettuce,tomato,olives,cucumber,feta cheese,sauce', '9620178d-2154-4d38-becc-d47319a01f06');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Italian salad', 'https://i.ibb.co/SJV7rMv/wloska.jpg',
    'Combining crisp lettuce, ripe tomatoes, fresh mozzarella cheese, tangy olives, and a drizzle of balsamic vinaigrette',
    28.99, 4.61, 145, 'iceberg lettuce,arugula,dried tomatoes,olives,cucumber,feta cheese,vinaigrette sauce', '9620178d-2154-4d38-becc-d47319a01f06');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Falafel', 'https://i.ibb.co/n1H7Dkc/falafel.jpg',
    'Blend of chickpeas, herbs, and spices, served in a warm pita bread with fresh vegetables and a creamy tahini sauce',
    28.99, 3.81, 423, 'iceberg lettuce,falafel,tomato,cucumber,sauce', '9620178d-2154-4d38-becc-d47319a01f06');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'French fries', 'https://i.ibb.co/dMkSCzH/frytki.jpg',
    NULL, 8.99, NULL, NULL, NULL, '76103531-ab85-49be-a777-adfe696223c7');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Nachos', 'https://i.ibb.co/424R4jb/nachos.jpg',
    NULL, 12.99, NULL, NULL, NULL, '76103531-ab85-49be-a777-adfe696223c7');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Sauce (tomato/spicy/vegan)', 'https://i.ibb.co/VD8gq7V/sosy.jpg',
    NULL, 2.99, NULL, NULL, NULL, '76103531-ab85-49be-a777-adfe696223c7');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Mozzarella sticks', 'https://i.ibb.co/XFv0d1v/ser-panierowany.jpg',
    NULL, 9.99, NULL, NULL, NULL, '76103531-ab85-49be-a777-adfe696223c7');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Coca Cola (500ml)', 'https://i.ibb.co/kgh81kb/cola.jpg',
    NULL, 9.99, NULL, NULL, NULL, 'ade9714d-9b38-4557-a4dd-8495b5c4e29f');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Cappy (orange/apple) (250ml)', 'https://i.ibb.co/yB8ynf8/cappy.jpg',
    NULL, 6.99, NULL, NULL, NULL, 'ade9714d-9b38-4557-a4dd-8495b5c4e29f');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Mineral water (250ml)', 'https://i.ibb.co/h2YNY9W/water.jpg',
    NULL, 4.99, NULL, NULL, NULL, 'ade9714d-9b38-4557-a4dd-8495b5c4e29f');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Tea', 'https://i.ibb.co/YycYtgg/tea.jpg',
    NULL, 9.99, NULL, NULL, NULL, 'ade9714d-9b38-4557-a4dd-8495b5c4e29f');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Latte', 'https://i.ibb.co/LCNvj70/latte.jpg',
    NULL, 12.99, NULL, NULL, NULL, 'ade9714d-9b38-4557-a4dd-8495b5c4e29f');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Cappuccino', 'https://i.ibb.co/cN94w4F/capuccino.jpg',
    NULL, 14.99, NULL, NULL, NULL, 'ade9714d-9b38-4557-a4dd-8495b5c4e29f');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Shake (250ml)', 'https://i.ibb.co/j8BKNpK/shake.jpg',
    NULL, 16.99, NULL, NULL, NULL, 'ade9714d-9b38-4557-a4dd-8495b5c4e29f');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Brownie', 'https://i.ibb.co/93SGMDn/brownie.jpg',
    NULL, 14.99, NULL, NULL, NULL, 'a44adc1a-08ba-460a-9cfc-996e56201dd1');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Apple pie', 'https://i.ibb.co/G51RhcC/szarlotka.jpg',
    NULL, 14.99, NULL, NULL, NULL, 'a44adc1a-08ba-460a-9cfc-996e56201dd1');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Chocolate cake', 'https://i.ibb.co/f188bmr/ciastko-czekoladowe.jpg',
    NULL, 12.99, NULL, NULL, NULL, 'a44adc1a-08ba-460a-9cfc-996e56201dd1');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Any Burger + French Fries + Drink', 'https://i.ibb.co/n0P4jDZ/burger-set.jpg',
    NULL, 36.99, NULL, NULL, NULL, '87768254-e8ed-412b-8f1b-89521c034fe7');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Any Pizza + Drink', 'https://i.ibb.co/nz18fj7/pizza-set.jpg',
    NULL, 34.99, NULL, NULL, NULL, '87768254-e8ed-412b-8f1b-89521c034fe7');

INSERT INTO "Menu" ("updatedAt", "name", "photoUrl", "description", "price", "rating", "numberOfRatings", "ingredients", "categoryId")
    VALUES (CURRENT_TIMESTAMP, 'Any Burrito + French Fries + Drink', 'https://i.ibb.co/bK92Nrz/burrito-set.png',
    NULL, 32.99, NULL, NULL, NULL, '87768254-e8ed-412b-8f1b-89521c034fe7');