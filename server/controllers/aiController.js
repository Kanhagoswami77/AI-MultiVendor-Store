const { generateResponse } = require("../services/geminiService");

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

module.exports = { chatWithAI };