const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.checkout = async (req, res) => {
  const customerId = req.user.id;

  try {
    const cart = await prisma.card.findFirst({
      where: { customer_id: customerId },
      include: {
        card_item: {
          include: {
            books_product: true,
          },
        },
      },
    });

    if (!cart || cart.card_item.length === 0) {
      return res.status(400).json({ error: "Cart kosong atau belum dibuat." });
    }


    let totalAmount = 0;
    for (const item of cart.card_item) {
      totalAmount += Number(item.books_product.price) * item.quantity;
    }

    const invoice = await prisma.invoice.create({
      data: {
        total_amount: totalAmount,
        issued_at: new Date(),
        status: 'pending',
        customer: { connect: { id: customerId } },
        card: { connect: { id: cart.id } },
        invoice_item: {
          create: cart.card_item.map(item => ({
            book_product_id: item.books_product_id,
            quantity: item.quantity,
            price: item.books_product.price,
          })),
        },
      },
    });

    await prisma.cart_item.deleteMany({
      where: { card_id: cart.id },
    });

    return res.status(201).json({
      invoice_id: invoice.id,
      status: invoice.status,
      total_amount: Number(invoice.total_amount),
      issued_at: invoice.issued_at,
    });

  } catch (error) {
    console.error("Checkout Error:", error);
    return res.status(500).json({ error: "Terjadi kesalahan saat proses checkout." });
  }
};
