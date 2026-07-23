const express = require("express");
const router = express.Router();

const prisma = require("../prisma");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/checkout", authMiddleware, async (req, res) => {
  try {

   
    const cartItems = await prisma.cart.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        product: true,
      },
    });

    if (cartItems.length === 0) {
      return res.status(400).json({
        message: "Your cart is empty",
      });
    }

    let totalPrice = 0;

    cartItems.forEach((item) => {
      totalPrice += item.quantity * item.product.price;
    });

 
    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        totalPrice,
      },
    });

    
    for (const item of cartItems) {
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        },
      });
    }

    await prisma.cart.deleteMany({
      where: {
        userId: req.user.id,
      },
    });

    res.status(201).json({
      message: "Order placed successfully",
      order,
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
    const orders = await prisma.order.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(orders);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
});
router.get("/my-orders", authMiddleware, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: req.user.id,
      },
     include: {
  orderItems: {
    include: {
      product: true,
    },
  },
},
      orderBy: {
        createdAt: "desc",
      },
    });

    if (orders.length === 0) {
      return res.status(404).json({
        message: "No orders found",
      });
    }

    res.json(orders);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
});
router.get("/vendor-orders", authMiddleware, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        orderItems: {
          some: {
            product: {
              vendorId: req.user.id,
            },
          },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        orderItems: {
          where: {
            product: {
              vendorId: req.user.id,
            },
          },
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(orders);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
});
router.put("/status/:id", authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const isVendor = order.orderItems.some(
      (item) => item.product.vendorId === req.user.id
    );

    if (!isVendor) {
      return res.status(403).json({
        message: "You are not allowed to update this order",
      });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status,
      },
    });

    res.json({
      message: "Order status updated successfully",
      order: updatedOrder,
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