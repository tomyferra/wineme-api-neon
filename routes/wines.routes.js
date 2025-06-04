const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares');
const Wine = require('../models/wine');
const { spawn } = require("child_process");
const path = require('path');


// Get all wines
router.get('/', authenticateToken, async (req, res) => {
  try {
    console.log("Getting the wines...")
    const wines = await Wine.find();
    res.json(wines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get wine by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const wine = await Wine.findById(req.params.id);
    if (!wine) {
      return res.status(404).json({ message: 'Wine not found' });
    }
    res.json(wine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new wine
router.post('/', authenticateToken, async (req, res) => {
  try {
    const newWine = await Wine.create(req.body);
    res.status(201).json(newWine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update wine
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'UPDATE "public"."Wines" SET name = $1, winery = $2, variety = $3, year = $4, totalqualifications = $5, avgqualifications = $6, score = $7, image = $8, region = $9, description = $10 WHERE id = $11 RETURNING *',
      [
        req.body.Name,
        req.body.Winery,
        req.body.Variety,
        req.body.Year,
        req.body.Totalqualifications,
        req.body.Avgqualifications,
        req.body.Score,
        req.body.Image,
        req.body.Region,
        req.body.Description,
        req.params.id
      ]
    );

    if (rows[0]) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'Wine not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete wine
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'DELETE FROM "public"."Wines" WHERE id = $1 RETURNING *',
      [req.params.id]
    );

    if (rows[0]) {
      res.json({ message: 'Wine deleted successfully' });
    } else {
      res.status(404).json({ message: 'Wine not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;