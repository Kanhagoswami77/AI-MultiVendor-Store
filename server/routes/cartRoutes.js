const express = require("express");
const router = express.Router();

const prisma = require("../prisma");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
      });
    }

    const product = await prisma.product.findUnique({
      where: {
        id: parseInt(productId),
      },
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const existingCartItem = await prisma.cart.findUnique({
      where: {
        userId_productId: {
          userId: req.user.id,
          productId: parseInt(productId),
        },
      },
    });

    if (existingCartItem) {
      const updatedCart = await prisma.cart.update({
        where: {
          userId_productId: {
            userId: req.user.id,
            productId: parseInt(productId),
          },
        },
        data: {
          quantity: existingCartItem.quantity + (quantity || 1),
        },
      });

      return res.json({
        message: "Cart updated successfully",
        cart: updatedCart,
      });
    }

    const cart = await prisma.cart.create({
      data: {
        userId: req.user.id,
        productId: parseInt(productId),
        quantity: quantity || 1,
      },
    });

    res.status(201).json({
      message: "Product added to cart",
      cart,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
});
router.get("/", authMiddleware, async (req, res) => {
  try {
    const cartItems = await prisma.cart.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        product: true,
      },
    });

    res.json(cartItems);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
});
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { quantity } = req.body;

    const cartItem = await prisma.cart.findUnique({
      where: {
        id,
      },
    });

    if (!cartItem) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    if (cartItem.userId !== req.user.id) {
      return res.status(403).json({
        message: "You are not allowed to update this cart",
      });
    }

    if (quantity <= 0) {
      await prisma.cart.delete({
        where: {
          id,
        },
      });

      return res.json({
        message: "Cart item removed",
      });
    }

    const updatedCart = await prisma.cart.update({
      where: {
        id,
      },
      data: {
        quantity,
      },
      include: {
        product: true,
      },
    });

    res.json({
      message: "Cart updated successfully",
      cart: updatedCart,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
});



module.exports = router;