import fs from 'fs'

class ProductsManager {
    constructor(path) {
        this.path = path
        this.nextId = 1
    }
    async getProducts(obj) {
        const { limit } = obj
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8');
                const products = JSON.parse(data);
                if (!limit) {
                    return products;
                } else {
                    const limitedProducts = products.slice(0, +limit)
                    return limitedProducts;
                }
            } else {
                return [];
            }
        } catch (error) {
            return error;
        }
    }

    async addProduct(productData) {
        try {
            const products = await this.getProducts();
            const { title, description, price, thumbnail, code, stock } = productData;

            if (!title || !description || !price || !thumbnail || !code || !stock) {
                throw new Error('Todos los campos deben estar definidos.');
            }
            if (this.products.some((product) => product.code === code)) {
                throw new Error('El código del producto ya existe.');
            }
            const newProduct = {
                id: this.nextId++,
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
            };
            this.products.push(newProduct);
            await fs.promises.writeFile(this.path, JSON.stringify(products));
        } catch (error) {
            return error;
        }
    }

    async getProductById(id) {
        try {
            const products = await this.getProducts({});
            const product = products.find((product) => product.id === id);
            return product;
        } catch (error) {
            return error;
        }
    }

    async deleteUser(id) {
        try {
            const products = await this.getProducts({});
            const product = products.find((product) => product.id === id);
            if (!product) {
                return console.log(`No se encontro un producto con el ID: ${id}.`);
            }
            const newProducts = products.filter((product) => product.id !== id);
            await fs.promises.writeFile(this.path, JSON.stringify(newProducts));
            return console.log(`Se elimino el producto de ID: ${id}.`)
        } catch (error) {
            return error;
        }
    }

    async updateUser(id, productData) {
        try {
            const products = await this.getProducts({});
            const index = products.findIndex((product) => product.id === id);
            if (index === -1) {
                return console.log(`No se encontro un producto con el ID: ${id}.`);
            }
            const productUpdated = products[index];
            products[index] = { ...productUpdated, ...productData };
            await fs.promises.writeFile(this.path, JSON.stringify(products));
            return console.log(`Se actualizo el producto de ID: ${id}.`);
        } catch (error) {
            return error;
        }
    }
}

export const manager = new ProductsManager('products.json');