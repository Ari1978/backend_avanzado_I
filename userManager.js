
const path = require(`path`)
const fs = require(`fs`).promises;

class userManager {

    constructor() {
        this.filePath = path.join(__dirname, "Productos.json")
    }

    //crear producto
    async crearProducto(data) {
        let productos = []
        try {
            const result = await fs.readFile(this.filePath)
            if (result != "") {
                productos = JSON.parse(result)
            }
        } catch (error) {
            
            console.log("Couldn´t read");
            
        }

        //generar un ID al nuevo producto
        const id = productos.length + 1

        //añadimos el id al nuevo producto
         data.id = id 

         productos.push(data)

         //añadir el nuevo producto al array
         await fs.writeFile(this.filePath, JSON.stringify(productos, null, 2) `utf-8`)
         
         console.log("Producto dado de alta!!..");
         
    } catch (error) {
        console.log("Error al crear el producto", error);
        
    }
}

