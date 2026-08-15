const { generateResponse, generateShoppingResponse } = require("../services/geminiService");
const pool = require("../db");

const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    const reply = await generateResponse(message);

    res.json({
      success: true,
      reply,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "AI Error",
    });
  }
};


const shoppingChat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // Get products from PostgreSQL
    const result = await pool.query(`
      SELECT 
        id,
        name,
        description,
        price,
        category,
        rating,
        "reviewCount",
        stock
      FROM "Product"
      WHERE stock > 0
      ORDER BY rating DESC
      LIMIT 50
    `);

    const products = result.rows;

    // Send products + user question to Gemini
    const reply = await generateShoppingResponse(
      message,
      products
    );

    res.json({
      success: true,
      reply,
    });

  } catch (error) {
    console.log("SHOPPING CHAT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Shopping AI Error",
    });
  }
};


module.exports = {
  chatWithAI,
  shoppingChat,
};