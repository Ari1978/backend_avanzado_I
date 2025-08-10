import mongoose from "mongoose";

//nombre de coleccion
const userCollection = "users"

// definimos esquema
const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true,
        required: [true, "Correo es requerido para el alta"]
    },
    age: Number
},
    {
        versionKey: false
    }
)

// crecion del modelo de usuarios
export const userModel = mongoose.model(userCollection, userSchema)

