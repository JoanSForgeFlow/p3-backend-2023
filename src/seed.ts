import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {

await prisma.customer.deleteMany();
await prisma.table.deleteMany();
await prisma.restaurant.deleteMany();
await prisma.booking.deleteMany();

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


const c1 = await prisma.customer.create({
  data: {
    name: "Customer 1",
    email: "customer1@example.com",
    phone: "123-456-7890"
  },
});
console.log(`Created customer ${c1.name} (${c1.id})`);

const c2 = await prisma.customer.create({
  data: {
    name: "Customer 2",
    email: "customer2@example.com",
    phone: "098-765-4321"
  },
});
console.log(`Created customer ${c2.name} (${c2.id})`);

const b1 = await prisma.booking.create({
  data: {
    customerId: c1.id,
    tableId: t1.id,
    restaurantId: r1.id,
    bookingDate: new Date(),
    bookingTime: "19:00",
    numberOfPeople: 2,
  },
});
console.log(`Created booking for customer ${c1.name} (${c1.id}) at restaurant ${r1.name} (${r1.id})`);

const b2 = await prisma.booking.create({
  data: {
    customerId: c2.id,
    tableId: t2.id,
    restaurantId: r2.id,
    bookingDate: new Date(),
    bookingTime: "20:00",
    numberOfPeople: 4,
  },
});
console.log(`Created booking for customer ${c2.name} (${c2.id}) at restaurant ${r2.name} (${r2.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
