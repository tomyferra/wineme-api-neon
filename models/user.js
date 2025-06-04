// const mongoose = require('mongoose');
// const { Schema } = mongoose;
// const bcrypt = require('bcryptjs');
// const crypto = require('crypto');

// const UserSchema = new Schema({
//   _id: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
// });

// // Crear el modelo del usuario
// const User = mongoose.model('User', UserSchema);

// class UserRepository {

//   static async create({ email, password }) {
//     // Validaciones
//     Validation.email(email)
//     Validation.password(password)

//     // Verificar si el usuario ya existe
//     const user = await User.findOne({ email });
//     if (user) throw new Error('email already exists');

//     // Generar un ID único y encriptar la contraseña
//     const id = crypto.randomUUID();
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Crear y guardar el nuevo usuario
//     const newUser = new User({
//       _id: id,
//       email,
//       password: hashedPassword,
//     });

//     await newUser.save();
//     return newUser;
//   }

//   static async login ({ email, password}) {
//     Validation.email(email)
//     Validation.password(password)

//     const user = await User.findOne({ email }); // No callback

//     if (!user) throw new Error('Email does not exist')
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) throw new Error('Password is invalid')
//     return user
//   }
// }

// class Validation {
//   static email (email){
//     // Validaciones
//     if (typeof email !== 'string') throw new Error('email must be a string');
//     if (email.length < 3) throw new Error('Must be at least 3 characters long');
//   }

//   static password (password){

//     if (typeof password !== 'string') throw new Error('Password must be a string');
//     if (password.length < 6) throw new Error('Must be at least 6 characters long');

//   }
// }

// module.exports = { User, UserRepository };


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
    const { rows } = await pool.query(
      'INSERT INTO "public"."Users" (id, email, password) VALUES ($1, $2, $3) RETURNING *',
      [id, email, hashedPassword]
    );

    return rows[0];
  }

  static async login({ email, password }) {
    Validation.email(email);
    Validation.password(password);

    const user = await User.findByEmail(email);
    if (!user) throw new Error('Email does not exist');

    const isMatch = await bcrypt.compare(password, user.password);
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