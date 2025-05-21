const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAllBooks = async (req, res) => {
  try {
    const books = await prisma.book.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil data buku" });
  }
};


exports.getBookDetail = async (req, res) => {
  const bookId = req.params.id;

  try {
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        books_product: {
          select: {
            id: true,
            format: true,
            price: true,
            stock: true,
            warehouse: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!book) {
      return res.status(404).json({ message: "Buku tidak ditemukan" });
    }

    const response = {
      id: book.id,
      title: book.title,
      isbn: book.isbn,
      publication_year: book.publication_year,
      genre: book.gendre,
      author: book.author,
      products: book.books_product,
    };

    res.json(response);
  } catch (error) {
    console.error("Gagal ambil detail buku:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};
