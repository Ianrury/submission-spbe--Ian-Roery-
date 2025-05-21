const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.invoice = async (req, res) => {
  try {
    const customerId = req.user.id;

    const invoices = await prisma.invoice.findMany({
      where: {
        customer_id: customerId,
      },
      select: {
        id: true,
        card_id: true,
        total_amount: true,
        status: true,
        issued_at: true,
      },
      orderBy: {
        issued_at: "desc",
      },
    });

    res.json(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).json({ error: "Terjadi kesalahan saat mengambil data invoice." });
  }
};
