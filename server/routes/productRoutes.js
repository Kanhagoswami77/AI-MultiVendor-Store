const upload = require("../middleware/uploadMiddleware");
const express = require("express");
const router = express.Router();

const prisma = require("../prisma");
const authMiddleware = require("../middleware/authMiddleware");

  router.post(
  "/add",
  (req, res, next) => {
    console.log("ADD API HIT");
    next();
  },
 
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
  try {
    console.log("ADD API HIT");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
   const { name, description, price, stock, category } = req.body;
   const priceValue = parseFloat(price);
   const stockValue = parseInt(stock);
   const image = req.file ? req.file.path : null;
    if (!name || !description || !price || !stock || !image || !category) {
  return res.status(400).json({
    message: "Please fill all fields",
  });
}
    const product = await prisma.product.create({
 data: {
  name,
  description,
  price: priceValue,
  stock: stockValue,
  image,
  category,
  vendorId: req.user.id,
},
});
res.status(201).json({
  message: "Product added successfully",
  product,
});
   
} catch (err) {
  console.error("ADD PRODUCT ERROR:");
  console.error(err);

  res.status(500).json({
    message: "Server Error",
    error: err.message,
  });
}
});
router.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany();

    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
});
router.get("/my-products", authMiddleware, async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        vendorId: req.user.id,
      },
    });

    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
});
router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        vendorId: req.user.id,
      },
    });

    const totalProducts = products.length;

    const totalStock = products.reduce((sum, product) => {
      return sum + product.stock;
    }, 0);

    res.json({
      totalProducts,
      totalStock,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
});
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;

    const products = await prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: q,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: q,
              mode: "insensitive",
            },
          },
        ],
      },
    });

    res.json(products);

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
});
router.get("/filter", async (req, res) => {
  try {

    const { category, minPrice, maxPrice, sort } = req.query;

    let orderBy = {
      createdAt: "desc",
    };

    if (sort === "low-high") {
      orderBy = {
        price: "asc",
      };
    }

    if (sort === "high-low") {
      orderBy = {
        price: "desc",
      };
    }

    if (sort === "newest") {
      orderBy = {
        createdAt: "desc",
      };
    }

    if (sort === "oldest") {
      orderBy = {
        createdAt: "asc",
      };
    }

    const products = await prisma.product.findMany({
      where: {
        category: category
          ? {
              equals: category,
              mode: "insensitive",
            }
          : undefined,

        price: {
          gte: minPrice ? parseFloat(minPrice) : undefined,
          lte: maxPrice ? parseFloat(maxPrice) : undefined,
        },
      },

      orderBy,
    });

    res.json(products);

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
});

router.get("/pagination", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const skip = (page - 1) * limit;

    const totalProducts = await prisma.product.count();

    const products = await prisma.product.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      currentPage: page,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      products,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }


    res.json(product);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
});
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const { name, description, price, stock, image, category } = req.body;
    const priceValue = parseFloat(price);
    const stockValue = parseInt(stock);
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    if (product.vendorId !== req.user.id) {
  return res.status(403).json({
    message: "You are not allowed to update this product",
  });
}

    const updatedProduct = await prisma.product.update({
  where: {
    id,
  },
 data: {
  name,
  description,
  price: priceValue,
  stock: stockValue,
  category,
},
});

res.json({
  message: "Product updated successfully",
  product: updatedProduct,
});

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
});
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (product.vendorId !== req.user.id) {
      return res.status(403).json({
        message: "You are not allowed to delete this product",
      });
    }

    await prisma.product.delete({
      where: { id },
    });

    res.json({
      message: "Product deleted successfully",
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

module.exports = router;