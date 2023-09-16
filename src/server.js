import express from 'express';
import { manager } from './productManager.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/products', async (req, res) => {
    try {
        const products = await manager.getProducts(req.query);
        if(!products.length) {
            res.status(200).json({message:'No se encontraron productos'});
        } else {
            res.status(200).json({message:'Productos encontrados', products});
        }
    } catch (error) {
        res.status(500).json({message: error});
    }
})

app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const product = await manager.getProductById(+id);
        if(!product) {
            res.status(400).json({message:"Producto no encontrado con la ID requerida"});
        } else {
            res.status(200).json({message:"Producto encontrado", product});
        }
    } catch(error){
        res.status(500).json({message: error});
    }
})

app.listen(8080, () => {
    console.log("Escuchando el puerto 8080.")
})