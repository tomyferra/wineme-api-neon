const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const pool = require('../database');

class User {
  static async findByEmail(email) {
    const { rows } = await pool.query(
      'SELECT * FROM "public"."Users" WHERE email = $1',
      [email]
    );
    return rows[0];
  }

  static async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM "public"."Users" WHERE id = $1',
      [id]
    );
    return rows[0];
  }
}

class UserRepository {
  static async create({ email, password }) {
    // Validations
    Validation.email(email);
    Validation.password(password);
    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) throw new Error('email already exists');

    // Generate unique ID and hash password
    const id = crypto.randomUUID();
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new user
    console.log('Creating user with email:', email);
    console.log('Hashed password:', hashedPassword);
    const { rows } = await pool.query(
      'INSERT INTO "public"."Users" (email, password_hash) VALUES ($1, $2) RETURNING *',
      [email, hashedPassword]
    );

    return rows[0];
  }

  static async login({ email, password }) {
    Validation.email(email);
    Validation.password(password);

    const user = await User.findByEmail(email);
    if (!user) throw new Error('Email does not exist');
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) throw new Error('Password is invalid');

    return user;
  }
}

class Validation {
  static email(email) {
    if (typeof email !== 'string') throw new Error('email must be a string');
    if (email.length < 3) throw new Error('Must be at least 3 characters long');
  }

  static password(password) {
    if (typeof password !== 'string') throw new Error('Password must be a string');
    if (password.length < 6) throw new Error('Must be at least 6 characters long');
  }
}

module.exports = { User, UserRepository };