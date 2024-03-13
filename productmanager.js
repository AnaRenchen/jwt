
class ProductManager {

    #products
    static idCounter =1;

    constructor (){
        this.#products=[];
    }

    addProduct(title, description, price, thumbnail, code, stock){

        if (!title || !description || !price || !thumbnail || !code || !stock){
            return `All fields are required.`;
        }

        const codigorepetido = (this.#products.some(item => item.code == code))
        
        if (codigorepetido){
            return`The code ${code} already exists.`;
        }  

        const id = ProductManager.idCounter++;

        const newProduct ={
        id,
        title,
        description,
        price,
        thumbnail,
        code,
        stock
        };

        this.#products.push(newProduct);

        return `Product "${newProduct.title}" was added.`;
    }

    getProducts(){
        return this.#products;
    }

    getProductbyId(id){

        const product = this.#products.find(item => item.id == id);
        if (product){
            return product;
        }else{
        return `Product with id ${id} was not found!`;
    }      
    }
};


module.exports = ProductManager;