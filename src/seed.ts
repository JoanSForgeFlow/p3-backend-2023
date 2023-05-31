import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import moment from 'moment';
async function main() {
await prisma.booking.deleteMany();
await prisma.review.deleteMany();
await prisma.customer.deleteMany();
await prisma.table.deleteMany();
await prisma.restaurant.deleteMany();

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

const bookingDateTime1 = moment.utc(`2023-01-01T19:00:00.000Z`);
const bookingEndDateTime1 = moment.utc(bookingDateTime1).add(2, 'hours');

const b1 = await prisma.booking.create({
  data: {
    customerId: c1.id,
    tableId: t1.id,
    restaurantId: r1.id,
    bookingDate: bookingDateTime1.toDate(),
    bookingEndTime: bookingEndDateTime1.toDate(),
    numberOfPeople: 2,
  },
});
console.log(`Created booking for customer ${c1.name} (${c1.id}) at restaurant ${r1.name} (${r1.id})`);

const bookingDateTime2 = moment.utc(`2023-01-01T20:00:00.000Z`);
const bookingEndDateTime2 = moment.utc(bookingDateTime2).add(2, 'hours');

const b2 = await prisma.booking.create({
  data: {
    customerId: c2.id,
    tableId: t2.id,
    restaurantId: r2.id,
    bookingDate: bookingDateTime2.toDate(),
    bookingEndTime: bookingEndDateTime2.toDate(),
    numberOfPeople: 4,
  },
});
console.log(`Created booking for customer ${c2.name} (${c2.id}) at restaurant ${r2.name} (${r2.id})`);

const rev1 = await prisma.review.create({
  data: {
    customerId: c1.id,
    restaurantId: r1.id,
    rating: 5,
    comment: "Excellent service and food!",
    date: new Date(),
  },
});
console.log(`Created review by customer ${c1.name} (${c1.id}) for restaurant ${r1.name} (${r1.id})`);

const rev2 = await prisma.review.create({
  data: {
    customerId: c2.id,
    restaurantId: r2.id,
    rating: 4,
    comment: "Great atmosphere and friendly staff!",
    date: new Date(),
  },
});
console.log(`Created review by customer ${c2.name} (${c2.id}) for restaurant ${r2.name} (${r2.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
