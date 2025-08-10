// src/file_promesas/manager.js
const ProductManager = require(`./ProductManager`)

//Instanciar manager
const manager = new ProductManager();

//Crear un nuevo producto
const newProduct = {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,

};

async function main(data) {
    //Ejecuto el metodo de la clase para crear un producto
    await manager.crearProduct(data)

    //Consulto los productos creados mediante la clase Usermanager
    const result = await manager.consultarProducts()
    console.log(result);
    

}

main(newProduct)