import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const r1 = await prisma.restaurant.create({
  data: { 
    name: "Restaurant 1", 
    location: "Location 1",
    cuisine: "Cuisine 1"
  },
});
console.log(`Created restaurant ${r1.name} (${r1.id})`);

const r2 = await prisma.restaurant.create({
  data: { 
    name: "Restaurant 2", 
    location: "Location 2",
    cuisine: "Cuisine 2"
  },
});
console.log(`Created restaurant ${r2.name} (${r2.id})`);

const t1 = await prisma.table.create({
  data: {
    restaurantId: r1.id,
    number: 1,
    capacity: 4
  },
});
console.log(`Created table ${t1.number} (${t1.id}) for restaurant ${r1.id}`);

const t2 = await prisma.table.create({
  data: {
    restaurantId: r2.id,
    number: 1,
    capacity: 6
  },
});
console.log(`Created table ${t2.number} (${t2.id}) for restaurant ${r2.id}`);
