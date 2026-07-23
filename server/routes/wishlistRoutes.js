const express = require("express");
const router = express.Router();

const prisma = require("../prisma");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const existingWishlist = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: req.user.id,
          productId,
        },
      },
    });

    if (existingWishlist) {
      return res.status(400).json({
        message: "Product already in wishlist",
      });
    }

    const wishlist = await prisma.wishlist.create({
      data: {
        userId: req.user.id,
        productId,
      },
    });

    res.status(201).json({
      message: "Product added to wishlist",
      wishlist,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
});
router.get("/", authMiddleware, async (req, res) => {
  try {

    const wishlist = await prisma.wishlist.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        product: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(wishlist);

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
});
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const wishlist = await prisma.wishlist.findUnique({
      where: {
        id,
      },
    });

    if (!wishlist) {
      return res.status(404).json({
        message: "Wishlist item not found",
      });
    }

    if (wishlist.userId !== req.user.id) {
      return res.status(403).json({
        message: "You are not allowed to delete this wishlist item",
      });
    }

    await prisma.wishlist.delete({
      where: {
        id,
      },
    });

    res.json({
      message: "Product removed from wishlist",
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
});

module.exports = router;