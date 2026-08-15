const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});


// Existing AI Description Generator
const generateResponse = async (message) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: message,
  });

  return response.text;
};


// New AI Shopping Assistant
const generateShoppingResponse = async (message, products) => {

  const productData = products
    .map(
      (product) => `
Product ID: ${product.id}
Name: ${product.name}
Category: ${product.category}
Price: ₹${product.price}
Rating: ${product.rating}
Reviews: ${product.reviewCount}
Stock: ${product.stock}
Description: ${product.description}
`
    )
    .join("\n-------------------\n");

  const prompt = `
You are an AI Shopping Assistant for a multi-vendor e-commerce store.

Your job is to help customers find suitable products.

AVAILABLE PRODUCTS:
${productData}

CUSTOMER QUESTION:
${message}

RULES:
1. Recommend products ONLY from the AVAILABLE PRODUCTS list.
2. Never invent a product.
3. Consider the customer's budget, category and requirements.
4. Mention the product name and price when recommending a product.
5. Mention rating when useful.
6. If no suitable product exists, clearly tell the customer.
7. Keep the response concise and friendly.
8. Do not mention that you are looking at a database.
9. Do not recommend products that are out of stock.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

  return response.text;
};


module.exports = {
  generateResponse,
  generateShoppingResponse,
};