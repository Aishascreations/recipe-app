const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../database');
const { authMiddleware } = require('../middleware');

const router = express.Router();

// GET all recipes for logged in user
router.get('/', authMiddleware, (req, res) => {
  const { search, cuisine, diet } = req.query;
  let query = 'SELECT * FROM recipes WHERE userId = ?';
  const params = [req.user.id];

  if (search) {
    query += ' AND title LIKE ?';
    params.push(`%${search}%`);
  }
  if (cuisine) {
    query += ' AND cuisine = ?';
    params.push(cuisine);
  }
  if (diet) {
    query += ' AND diet = ?';
    params.push(diet);
  }

  query += ' ORDER BY updatedAt DESC';
  const recipes = db.prepare(query).all(...params);

  // Attach ingredients and steps to each recipe
  const full = recipes.map(r => ({
    ...r,
    ingredients: db.prepare('SELECT * FROM ingredients WHERE recipeId = ?').all(r.id),
    steps: db.prepare('SELECT * FROM steps WHERE recipeId = ? ORDER BY stepOrder').all(r.id),
  }));

  res.json(full);
});

// GET single recipe
router.get('/:id', authMiddleware, (req, res) => {
  const recipe = db.prepare('SELECT * FROM recipes WHERE id = ? AND userId = ?').get(req.params.id, req.user.id);
  if (!recipe) return res.status(404).json({ error: 'Recipe not found' });

  recipe.ingredients = db.prepare('SELECT * FROM ingredients WHERE recipeId = ?').all(recipe.id);
  recipe.steps = db.prepare('SELECT * FROM steps WHERE recipeId = ? ORDER BY stepOrder').all(recipe.id);

  res.json(recipe);
});

// POST create recipe
router.post('/', authMiddleware, (req, res) => {
  const { title, cuisine, diet, time, servings, imageUrl, ingredients, steps } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  const recipe = {
    id: uuidv4(),
    userId: req.user.id,
    title,
    cuisine: cuisine || '',
    diet: diet || '',
    time: time || 0,
    servings: servings || 1,
    imageUrl: imageUrl || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.prepare(`
    INSERT INTO recipes (id, userId, title, cuisine, diet, time, servings, imageUrl, createdAt, updatedAt)
    VALUES (@id, @userId, @title, @cuisine, @diet, @time, @servings, @imageUrl, @createdAt, @updatedAt)
  `).run(recipe);

  // Insert ingredients
  if (ingredients?.length) {
    const insertIng = db.prepare(`
      INSERT INTO ingredients (id, recipeId, name, amount, unit)
      VALUES (@id, @recipeId, @name, @amount, @unit)
    `);
    ingredients.forEach(ing => insertIng.run({
      id: uuidv4(), recipeId: recipe.id,
      name: ing.name || '', amount: ing.amount || '', unit: ing.unit || ''
    }));
  }

  // Insert steps
  if (steps?.length) {
    const insertStep = db.prepare(`
      INSERT INTO steps (id, recipeId, stepOrder, instruction)
      VALUES (@id, @recipeId, @stepOrder, @instruction)
    `);
    steps.forEach((s, i) => insertStep.run({
      id: uuidv4(), recipeId: recipe.id,
      stepOrder: i + 1, instruction: s.instruction || ''
    }));
  }

  res.status(201).json({ ...recipe, ingredients: ingredients || [], steps: steps || [] });
});

// DELETE recipe
router.delete('/:id', authMiddleware, (req, res) => {
  const recipe = db.prepare('SELECT * FROM recipes WHERE id = ? AND userId = ?').get(req.params.id, req.user.id);
  if (!recipe) return res.status(404).json({ error: 'Recipe not found' });

  db.prepare('DELETE FROM ingredients WHERE recipeId = ?').run(recipe.id);
  db.prepare('DELETE FROM steps WHERE recipeId = ?').run(recipe.id);
  db.prepare('DELETE FROM recipes WHERE id = ?').run(recipe.id);

  res.json({ success: true });
});

module.exports = router;