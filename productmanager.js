const fs = require("fs");


class ProductManager {
    static idCounter = 1;

    constructor(path) {
        this.path = path;
    }

    async readProducts() {
        try {
            if (fs.existsSync(this.path)) {
                let products = JSON.parse(await fs.promises.readFile(this.path, { encoding: "utf-8" }));
                return products;
            } else {
                return [];
            }
        } catch (error) {
            console.error("Error reading products file:", error.message);
            return;
        }
    }

    async addProduct(title, description, price, thumbnail, code, stock) {
        let products = await this.readProducts();
        try {
            if (!title || !description || !price || !thumbnail || !code || !stock) {
                console.log("All fields are required.");
                return [];
            }
            let codigorepetido = products.some(item => item.code == code);
            if (codigorepetido) {
                return `The code ${code} already exists.`;
            }
            let id = ProductManager.idCounter++;
            const newProduct = {
                id,
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

    async getProducts() {
        try {
            let displayProducts = await this.readProducts();
            return displayProducts;
        } catch (error) {
            console.error("There was an error reading products file.", error.message);
            return [];
        }
    }

    async getProductbyId(id) {
        try {
            let products = await this.readProducts();
            let product = products.find(item => item.id == id);
            if (product) {
                console.log("The following product found:")
                return product;
            } else {
                return `Product with id ${id} was not found!`;
            }
        } catch (error) {
            console.error("There was an error searching for product´s id.", error.message);
            return;
        }
    }

    async updateProduct(id, updateProperties = {}) {
        try {
            let products = await this.readProducts();
            let validProperties = ["title", "description", "price", "thumbnail", "code", "stock"]
            let productIndex = products.findIndex(item => item.id === id);

            if (productIndex !== -1) {
                let properties = Object.keys(updateProperties);
                let valid = properties.every(prop => validProperties.includes(prop));
                if (valid) {
                    products[productIndex] = { ...products[productIndex], ...updateProperties };
                    console.log(`Product with id ${id} was successfully updated.`)
                } else {
                    console.log("The properties you are trying to update are not valid or do not exist.")
                }
                await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5));
                return products[productIndex];
            } else {
                return `Product with ${id} was not found`;
            }
        } catch (error) {
            console.error("There was an error updating the product.", error.message);
            return;
        }
    }

    async deleteProduct(id) {
        try {
            let products = await this.readProducts();
            let filteredProducts = products.filter(item => item.id !== id);
            if (filteredProducts.length !== products.length) {
                await fs.promises.writeFile(this.path, JSON.stringify(filteredProducts, null, 5));
                return `Product with id ${id} was deleted.`
            } else {
                return `Product with id ${id} was not found.`
            }
        } catch (error) {
            console.error("There was an error deleting the product.", error.message);
            return;
        }
    }
}

module.exports = ProductManager;


    