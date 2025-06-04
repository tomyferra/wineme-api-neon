// const mongoose = require('mongoose');
// const { Schema } = mongoose;

// const WineSchema = new Schema({
//   Name: {type : String, required: true},
//   Winery: {type : String},
//   Variety: {type : String},
//   Description: {type : String},
//   Year: {type: Number},
//   Totalqualifications: {type: Number},
//   Avgqualifications: {type: Number},
//   Score:{type: Number},
//   Image: {type: String},
//   Region: {type: String},
// })

// module.exports = mongoose.model('Wine',WineSchema);


// NEW CPDE <HERE>
const pool = require('../database');

class Wine {

  static async find() {
    const { rows } = await pool.query(`SELECT * FROM "public"."Wines"`);
    return rows;
  }

  static async findById(id) {
    const { rows } = await pool.query(`SELECT * FROM "public"."Wines" WHERE id = $1`, [id]);
    return rows[0];
  }

static async create(wine) {
  const { rows } = await pool.query(
    `INSERT INTO "public"."Wines" (
      name, winery, variety, description, year,
      totalqualifications, avgqualifications, score,
      image, region
    ) VALUES (
      $1, $2, $3, $4, $5,
      $6, $7, $8, $9, $10
    ) RETURNING *`,
    [
      wine.Name,
      wine.Winery,
      wine.Variety,
      wine.Description,
      wine.Year,
      wine.Totalqualifications,
      wine.Avgqualifications,
      wine.Score,
      wine.Image,
      wine.Region
    ]
  );
  return rows[0];
}


static async update(id, wine) {
  const { rows } = await pool.query(
    `UPDATE "public"."Wines" SET
      name = $1,
      winery = $2,
      variety = $3,
      year = $4,
      totalqualifications = $5,
      avgqualifications = $6,
      score = $7,
      image = $8,
      region = $9,
      description = $10
    WHERE id = $11
    RETURNING *`,
    [
      wine.Name,
      wine.Winery,
      wine.Variety,
      wine.Year,
      wine.Totalqualifications,
      wine.Avgqualifications,
      wine.Score,
      wine.Image,
      wine.Region,
      wine.Description,
      id
    ]
  );
  return rows[0];
}

static async delete(id) {
  const { rows } = await pool.query(
    `DELETE FROM "public"."Wines" WHERE id = $1 RETURNING *`,
    [id]
  );
  return rows[0];
}


}

module.exports = Wine;