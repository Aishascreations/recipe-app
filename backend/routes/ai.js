const express = require('express');
const { authMiddleware } = require('../middleware');

const router = express.Router();

// POST suggest recipes from ingredients
router.post('/suggest', authMiddleware, async (req, res) => {
  const { ingredients } = req.body;
  if (!ingredients?.length)
    return res.status(400).json({ error: 'Ingredients are required' });

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: `I have these ingredients: ${ingredients.join(', ')}.
Suggest 3 recipes I can make. For each recipe respond in this exact JSON format:
{
  "recipes": [
    {
      "title": "Recipe Name",
      "cuisine": "Italian",
      "diet": "vegetarian",
      "time": 30,
      "servings": 2,
      "ingredients": [{"name": "ingredient", "amount": "1", "unit": "cup"}],
      "steps": [{"instruction": "Step description"}]
    }
  ]
}
Respond with only the JSON, no other text.`
        }]
      }),
    });

    const data = await response.json();
    const text = data.content[0].text;
    const parsed = JSON.parse(text);
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: 'AI suggestion failed' });
  }
});

// POST generate shopping list from recipe ids
router.post('/shopping-list', authMiddleware, async (req, res) => {
  const { recipeIds } = req.body;
  if (!recipeIds?.length)
    return res.status(400).json({ error: 'Recipe IDs are required' });

  const db = require('../database');
  const allIngredients = [];

  recipeIds.forEach(id => {
    const ings = db.prepare('SELECT * FROM ingredients WHERE recipeId = ?').all(id);
    allIngredients.push(...ings);
  });

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 512,
        messages: [{
          role: 'user',
          content: `Combine and organize this ingredient list into a clean shopping list, merging duplicates and similar items:
${allIngredients.map(i => `${i.amount} ${i.unit} ${i.name}`).join('\n')}

Respond in this exact JSON format:
{
  "shoppingList": [
    {"category": "Produce", "items": ["2 tomatoes", "1 onion"]},
    {"category": "Dairy", "items": ["2 cups milk"]}
  ]
}
Respond with only the JSON, no other text.`
        }]
      }),
    });

    const data = await response.json();
    const text = data.content[0].text;
    const parsed = JSON.parse(text);
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: 'Shopping list generation failed' });
  }
});

module.exports = router;