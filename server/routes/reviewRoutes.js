const express = require("express");
const router = express.Router();

const prisma = require("../prisma");
const authMiddleware = require("../middleware/authMiddleware");

// Add Review
router.post("/", authMiddleware, async (req, res) => {
  try {

    const { productId, rating, comment } = req.body;

    const review = await prisma.review.create({
      data: {
        rating: parseInt(rating),
        comment,
        productId: parseInt(productId),
        userId: req.user.id,
      },
    });

    res.status(201).json({
      message: "Review Added Successfully",
      review,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });

  }
});

// Get Reviews of Product
router.get("/:productId", async (req, res) => {
  try {

    const productId = parseInt(req.params.productId);

    const reviews = await prisma.review.findMany({
      where: {
        productId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(reviews);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });

  }
});

module.exports = router;