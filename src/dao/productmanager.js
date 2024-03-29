import fs from "fs";


export default class ProductManager {
  

    constructor(path) {
        this.path = path;
        this.products = [];
        this.initId();
        this.getProducts();
        }

        async initId() {
            try {
                if (fs.existsSync(this.path)) {
                    const data = await fs.promises.readFile(this.path, { encoding: "utf-8" });
                    const products = JSON.parse(data);
                    const maxId = Math.max(...products.map(product => product.id), 0);
                    this.id = maxId + 1;
                } else {
                    this.id = 1; 
                }
            } catch (error) {
                console.error("Error initializing product ID:", error.message);
                this.id = 1; 
            }
        }
    
        async getProducts() {
            try {
                if (fs.existsSync(this.path)) {
                    const data = await fs.promises.readFile(this.path, { encoding: "utf-8" });
                    return this.products = JSON.parse(data);
                }else{
                    this.carts=[];
                }
            } catch (error) {
                console.error("Error reading products file:", error.message);
            }
                return [];
            }

            async addProduct(title, description, price, thumbnail, code, stock) {
                try {
                let products = this.products;
        
                if (!this.id) {
                    await this.initId();
                }
        
        
                    const nextId = this.id;
                    this.id++;
        
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
                    
                    console.log(`Product "${newProduct.title}" was added.`);
                } catch (error) {
                    console.error("Error adding product.", error.message);
                    return;
                }
            }


    async getProductbyId(id) {
        try {
            let products = this.products;
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
            let products = this.products;
            let productIndex = products.findIndex(item => item.id === id);

            if (productIndex !== -1) {
                    products[productIndex] = { ...products[productIndex], ...updateProperties };
                    console.log(`Product with id ${id} was successfully updated:`)

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
            let products = this.products;
            let filteredProducts = products.filter(item => item.id !== id);
            if (filteredProducts.length !== products.length) {
                await fs.promises.writeFile(this.path, JSON.stringify(filteredProducts, null, 5));
                console.log (`Product was deleted.`);
            } else {
                console.log(`Product was not found.`);
            }
        } catch (error) {
            console.error("Error deleting the product.", error.message);
            return;
        }
    }
}





    