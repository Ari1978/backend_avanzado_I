//Para insertar un solo documento 

db.usuarios.insertOne({name: "Juan", apellido: "Gonzalez", edad: 25, email: "juan@gmail.com" })

//Para insertar mas de un registro

db.estudiantes.insertMany([
    {
        nombre: "Juan", 
        apellido: "Gonzalez", 
        edad: 25, 
        email: "juan@gmail.com" 
    },
    {
        nombre: "Maria", 
        apellido: "Perez", 
        edad: 28, 
        email: "maria@gmail.com" 
    },
    {
        nombre: "Lorena", 
        apellido: "Urritia", 
        edad: 20, 
        email: "lorena@gmail.com" 
    },
    {
        nombre: "Marcos", 
        apellido: "Mendez", 
        edad: 31, 
        email: "marcos@gmail.com" 
    }

]);
    

