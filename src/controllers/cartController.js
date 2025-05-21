const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getCart = async (req, res) => {
  const customerId = req.user.id;

  try {
    const cart = await prisma.card.findFirst({
      where: { customer_id: customerId },
      include: {
        card_item: {
          include: {
            books_product: {
              include: {
                books: {
                  select: {
                    title: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart tidak ditemukan" });
    }

    const formattedCart = {
      id: cart.id,
      customer_id: cart.customer_id,
      created_at: cart.createdAt,
      items: cart.card_item.map((item) => ({
        id: item.id,
        books_product_id: item.books_product_id,
        quantity: item.quantity,
        created_at: item.created_at,
        product: {
          book: {
            title: item.books_product.books.title,
          },
          format: item.books_product.format,
          price: item.books_product.price,
        },
      })),
    };

    res.json(formattedCart);
  } catch (error) {
    console.error("Gagal mengambil cart:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

exports.postCart = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { books_product_id, quantity } = req.body;

    if (!books_product_id || !quantity) {
      return res.status(400).json({ error: "books_product_id dan quantity wajib diisi." });
    }

  
    let cart = await prisma.card.findFirst({
      where: { customer_id: customerId },
    });


    if (!cart) {
      cart = await prisma.card.create({
        data: {
          customer_id: customerId,
        },
      });
    }

    const cartItem = await prisma.cart_item.create({
      data: {
        books_product_id,
        quantity,
        card_id: cart.id,
      },
    });

    return res.status(201).json({
      id: cartItem.id,
      cart_id: cart.id,
      books_product_id: cartItem.books_product_id,
      quantity: cartItem.quantity,
      created_at: cartItem.created_at,
    });
  } catch (error) {
    console.error("POST /cart/items error:", error);
    return res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
};
