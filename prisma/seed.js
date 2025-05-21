const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

async function main() {
  const hashedPassword1 = await bcrypt.hash("secret123", 10);
  const hashedPassword2 = await bcrypt.hash("secret456", 10);
  const author = await prisma.author.create({
    data: {
      name: "J.K. Rowling",
      bio: "British author, best known for the Harry Potter series",
      birthdate: new Date("1965-07-31"),
    },
  });

  const warehouse = await prisma.warehouse.create({
    data: {
      name: "Main Warehouse",
      location: "Jakarta",
      capacity: 100,
    },
  });

  const book = await prisma.book.create({
    data: {
      title: "Harry Potter and the Philosopher's Stone",
      isbn: "282930232782",
      publication_year: 1997,
      gendre: "Fantasi",
      author_id: author.id,
    },
  });

  const booksProduct = await prisma.books_product.create({
    data: {
      price: 240000,
      stock: 50,
      format: "Hardcover",
      book_id: book.id,
      warehouse_id: warehouse.id,
    },
  });

  const customer1 = await prisma.customer.create({
    data: {
      name: "John Doe",
      email: "john@example.com",
      password: hashedPassword1,
      address: "Jl. Sudirman No.1",
      phone: "081234567890",
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      name: "Jane Smith",
      email: "jane@example.com",
      password: hashedPassword2,
      address: "Jl. Thamrin No.2",
      phone: "089876543210",
    },
  });

  const card1 = await prisma.card.create({
    data: {
      customer_id: customer1.id,
    },
  });

  const card2 = await prisma.card.create({
    data: {
      customer_id: customer2.id,
    },
  });

  const invoice1 = await prisma.invoice.create({
    data: {
      total_amount: 240000,
      issued_at: new Date(),
      status: "paid",
      customer_id: customer1.id,
      card_id: card1.id,
    },
  });

  const invoice2 = await prisma.invoice.create({
    data: {
      total_amount: 480000,
      issued_at: new Date(),
      status: "unpaid",
      customer_id: customer2.id,
      card_id: card2.id,
    },
  });

  await prisma.invoice_item.createMany({
    data: [
      {
        book_product_id: booksProduct.id,
        quantity: 1,
        price: 240000,
        invoice_id: invoice1.id,
      },
      {
        book_product_id: booksProduct.id,
        quantity: 2,
        price: 480000,
        invoice_id: invoice2.id,
      },
    ],
  });

  await prisma.cart_item.createMany({
    data: [
      {
        books_product_id: booksProduct.id,
        quantity: 1,
        card_id: card1.id,
      },
      {
        books_product_id: booksProduct.id,
        quantity: 3,
        card_id: card2.id,
      },
    ],
  });

  console.log("All seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error("Error seeding data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
