import fs from "fs";


export default class ProductManager {
  

    constructor(path) {
        this.path = path;
        this.products = [];
        this.readProducts();
        }
    
        async readProducts() {
            try {
                if (fs.existsSync(this.path)) {
                    const data = await fs.promises.readFile(this.path, { encoding: "utf-8" });
                    this.products = JSON.parse(data);
                }
            } catch (error) {
                console.error("Error reading products file:", error.message);
            }
        }

    async getProducts() {
        return this.products;
      }


    async addProduct(title, description, price, thumbnail, code, stock) {
        let products = this.products;
        try {
            if (!title || !description || !price || !thumbnail || !code || !stock) {
                console.log("All fields are required.");
                return [];
            }
            let codigorepetido = products.some(item => item.code == code);
            if (codigorepetido) {
                return `The code ${code} already exists.`;
            }

            let maxId = Math.max(...this.products.map(product => product.id), 0);
            let nextId = maxId +1;

            const newProduct = {
                id: nextId,
                title,
                description,
                price,
                thumbnail,
                code,
                stock
            };

            products.push(newProduct);
            
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5));
            return `Product "${newProduct.title}" was added.`;
        } catch (error) {
            console.error("Error adding product.", error.message);
            return;
        }
    }


    async getProductbyId(id) {
        try {
            let products = await this.getProducts();
            let product = products.find(item => item.id == id);
            if (product) {
                console.log("Product was found!")
                return product;
            } else {
                console.error ("Product not found!");
            }
        } catch (error) {
            console.error("There was an error searching for product´s id.", error.message);
            return;
        }
    }

    async updateProduct(id, updateProperties = {}) {
        try {
            let products = await this.getProducts();
            let validProperties = ["title", "description", "price", "thumbnail", "code", "stock"]
            let productIndex = products.findIndex(item => item.id === id);

            if (productIndex !== -1) {
                let properties = Object.keys(updateProperties);
                let valid = properties.every(prop => validProperties.includes(prop));
                if (valid) {
                    products[productIndex] = { ...products[productIndex], ...updateProperties };
                    console.log(`Product with id ${id} was successfully updated:`)
                } else {
                    console.log(`The properties you are trying to update are not valid or do not exist. Valid properties are: ${validProperties}.`)
                }
                await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5));
                return products[productIndex];
            } else {
                return `Product was not found`;
            }
        } catch (error) {
            console.error("There was an error updating the product.", error.message);
            return;
        }
    }

    async deleteProduct(id) {
        try {
            let products = await this.getProducts();
            let filteredProducts = products.filter(item => item.id !== id);
            if (filteredProducts.length !== products.length) {
                await fs.promises.writeFile(this.path, JSON.stringify(filteredProducts, null, 5));
                return `Product was deleted.`
            } else {
                return `Product  was not found.`
            }
        } catch (error) {
            console.error("Error deleting the product.", error.message);
            return;
        }
    }
}





    