import fs from "fs";

export default class CartsManager {

    constructor(path){
        this.path=path;
        this.carts=[];
        this.initIdCart();
        this.getCarts();
        
    }

    async initIdCart() {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, { encoding: "utf-8" });
                const carts = JSON.parse(data);
                const maxId = Math.max(...carts.map(cart => cart.id), 0);
                this.id = maxId + 1;
        } else {
            this.id = 1;
            }
        } catch (error) {
            console.error("Error initializing cart Id:", error.message);
            this.id = 1; 
        }
    }

    async getCarts() {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, { encoding: "utf-8" });
                return this.carts = JSON.parse(data);
            }else{
                this.carts = [];
            }
        } catch (error) {
            console.error("Error reading products file:", error.message);
        }
        this.carts = [];
        }

    async createCart() {
        try {
            let carts=this.carts;

                const nextId = this.id;
                this.id++;

                const newCart={
                    id: nextId,
                    products: []
                }

                this.carts.push(newCart);

                await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 5));

                return newCart;

        } catch (error) {
            console.error("Error creating cart:", error.message);
            return null;
        }
            
        }

        async getCartbyId(id){
            try {
                let carts = this.carts;
                let cart = carts.find(cart => cart.id == id);
                if (cart) {
                    console.log("Cart was found!")
                    return cart.products;
                } else {
                    console.error ("Cart not found!");
                }
            } catch (error) {
                console.error("There was an error getting cart.", error.message);
                return;
            }

        }

        async addProductCart(cid, pid){
            try{   
            let carts = this.carts;
            const index = carts.findIndex(cart=> cart.id ===cid);

            if (index !==-1){
                const cartProducts = await this.getCartbyId(cid);
                const productExists= cartProducts.findIndex(product=> product.pid ===pid);

                if(productExists !==-1){
                cartProducts[productExists].quantity = cartProducts[productExists].quantity +1;
                }else{
                    cartProducts.push({pid, quantity:1})
                }

                carts[index].products = cartProducts;

                await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 5));
                console.log("Product added.");
                return cartProducts;
            }else{
                console.log ("Error adding product to cart.")
            }

        } catch (error) {
            console.error("Error adding product to cart.", error.message);
            return;
        }

        }
}