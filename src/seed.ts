import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import moment from 'moment';

async function main() {

  const restaurant1 = await prisma.restaurant.create({
    data: {
      name: "Chez Pierre",
      location: "New York",
      cuisine: "French",
    },
  });

  const restaurant2 = await prisma.restaurant.create({
    data: {
      name: "Bella Napoli",
      location: "Chicago",
      cuisine: "Italian",
    },
  });

  // Creating tables for Restaurant 1
  const table1 = await prisma.table.create({
    data: {
      restaurantId: restaurant1.id,
      number: 1,
      capacity: 4,
    },
  });

  const table2 = await prisma.table.create({
    data: {
      restaurantId: restaurant1.id,
      number: 2,
      capacity: 6,
    },
  });

  // Creating tables for Restaurant 2
  const table3 = await prisma.table.create({
    data: {
      restaurantId: restaurant2.id,
      number: 1,
      capacity: 5,
    },
  });

  const table4 = await prisma.table.create({
    data: {
      restaurantId: restaurant2.id,
      number: 2,
      capacity: 7,
    },
  });

  const customer1 = await prisma.customer.create({
    data: {
      name: "John Doe",
      email: "johndoe@example.com",
      phone: "123-456-7890"
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      name: "Jane Smith",
      email: "janesmith@example.com",
      phone: "098-765-4321"
    },
  });

  const customer3 = await prisma.customer.create({
    data: {
      name: "Alice Johnson",
      email: "alicejohnson@example.com",
      phone: "555-555-5555"
    },
  });

  // Booking and reviews for customer1
  const bookingDateTime1 = moment.utc(`2023-01-01T19:00:00.000Z`);
  const bookingEndDateTime1 = moment.utc(bookingDateTime1).add(2, 'hours');

  await prisma.booking.create({
    data: {
      customerId: customer1.id,
      tableId: 1,
      restaurantId: restaurant1.id,
      bookingDate: bookingDateTime1.toDate(),
      bookingEndTime: bookingEndDateTime1.toDate(),
      numberOfPeople: 2,
    },
  });

  await prisma.review.create({
    data: {
      customerId: customer1.id,
      restaurantId: restaurant1.id,
      rating: 5,
      comment: "Fantastic place! Great food and service. Highly recommended.",
      date: new Date(),
    },
  });

  await prisma.review.create({
    data: {
      customerId: customer1.id,
      restaurantId: restaurant2.id,
      rating: 4,
      comment: "Wonderful service, but the food could have been hotter.",
      date: new Date(),
    },
  });

  // Booking and reviews for customer2
  const bookingDateTime2 = moment.utc(`2023-02-01T20:00:00.000Z`);
  const bookingEndDateTime2 = moment.utc(bookingDateTime2).add(2, 'hours');

  await prisma.booking.create({
    data: {
      customerId: customer2.id,
      tableId: 2,
      restaurantId: restaurant2.id,
      bookingDate: bookingDateTime2.toDate(),
      bookingEndTime: bookingEndDateTime2.toDate(),
      numberOfPeople: 4,
    },
  });

  await prisma.review.create({
    data: {
      customerId: customer2.id,
      restaurantId: restaurant2.id,
      rating: 4,
      comment: "Nice ambience, good food but a bit pricey.",
      date: new Date(),
    },
  });

  await prisma.review.create({
    data: {
      customerId: customer2.id,
      restaurantId: restaurant1.id,
      rating: 3,
      comment: "Service was good but the food lacked seasoning.",
      date: new Date(),
    },
  });

// Booking and reviews for customer3
const bookingDateTime3 = moment.utc(`2023-03-01T19:30:00.000Z`);
const bookingEndDateTime3 = moment.utc(bookingDateTime3).add(2, 'hours');

await prisma.booking.create({
  data: {
    customerId: customer3.id,
    tableId: 3,
    restaurantId: restaurant1.id,
    bookingDate: bookingDateTime3.toDate(),
    bookingEndTime: bookingEndDateTime3.toDate(),
    numberOfPeople: 3,
  },
});

await prisma.review.create({
  data: {
    customerId: customer3.id,
    restaurantId: restaurant1.id,
    rating: 5,
    comment: "Amazing experience! Loved the food and the service.",
    date: new Date(),
  },
});

await prisma.review.create({
  data: {
    customerId: customer3.id,
    restaurantId: restaurant2.id,
    rating: 4,
    comment: "Nice atmosphere, but the menu lacks vegetarian options.",
    date: new Date(),
  },
});

// Creating a third restaurant
const restaurant3 = await prisma.restaurant.create({
  data: {
    name: "La Paella Loca",
    location: "Los Angeles",
    cuisine: "Spanish",
  },
});

// Creating tables for Restaurant 3
const table5 = await prisma.table.create({
  data: {
    restaurantId: restaurant3.id,
    number: 1,
    capacity: 4,
  },
});

const table6 = await prisma.table.create({
  data: {
    restaurantId: restaurant3.id,
    number: 2,
    capacity: 8,
  },
});

const customer4 = await prisma.customer.create({
  data: {
    name: "Bob Williams",
    email: "bobwilliams@example.com",
    phone: "444-444-4444"
  },
});

const customer5 = await prisma.customer.create({
  data: {
    name: "Mary Davis",
    email: "marydavis@example.com",
    phone: "333-333-3333"
  },
});

// Booking and reviews for customer4
const bookingDateTime4 = moment.utc(`2023-04-01T19:00:00.000Z`);
const bookingEndDateTime4 = moment.utc(bookingDateTime4).add(2, 'hours');

await prisma.booking.create({
  data: {
    customerId: customer4.id,
    tableId: 5,
    restaurantId: restaurant3.id,
    bookingDate: bookingDateTime4.toDate(),
    bookingEndTime: bookingEndDateTime4.toDate(),
    numberOfPeople: 2,
  },
});

await prisma.review.create({
  data: {
    customerId: customer4.id,
    restaurantId: restaurant3.id,
    rating: 5,
    comment: "Absolutely loved the paella! Great Spanish wine selection too.",
    date: new Date(),
  },
});

// Booking and reviews for customer5
const bookingDateTime5 = moment.utc(`2023-05-01T20:00:00.000Z`);
const bookingEndDateTime5 = moment.utc(bookingDateTime5).add(2, 'hours');

await prisma.booking.create({
  data: {
    customerId: customer5.id,
    tableId: 6,
    restaurantId: restaurant3.id,
    bookingDate: bookingDateTime5.toDate(),
    bookingEndTime: bookingEndDateTime5.toDate(),
    numberOfPeople: 4,
  },
});

await prisma.review.create({
  data: {
    customerId: customer5.id,
    restaurantId: restaurant3.id,
    rating: 4,
    comment: "Great food, but the restaurant was a bit noisy.",
    date: new Date(),
  },
});

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
