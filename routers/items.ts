import express from "express";
import { Items, ItemWithoutId, Places} from "../types";
import {imagesUpload} from "../multer";
import mySqlDb from "../mySqlDb";
import {ResultSetHeader} from "mysql2";

const itemsRouter = express.Router();

itemsRouter.get('/', async (req, res, next) => {
    try {
        const connection = await mySqlDb.getConnection();
        const [result] = await connection.query('SELECT id, category_id, place_id, title FROM items');
        const items = result as Items[];
        res.send(items);
    }
    catch (e){
        next(e);
    }
});

itemsRouter.get('/:id', async (req, res,next) => {
    const id = req.params.id;
    if (!req.params.id) {
        res.status(404).send({error:"Not found"});
    }
    try {
        const connection = await mySqlDb.getConnection();
        const [result]= await connection.query('SELECT * FROM items WHERE id = ?', [id]);
        const item = result as Items[];
        if (item.length === 0 ){
            res.status(400).send({error:"Item not found"});
        } else {
            res.send(item[0]);
        }
    }
    catch (e){
        next(e);
    }

});


itemsRouter.post('/',imagesUpload.single('image'), async (req, res,next) => {
    if(!req.body.title || ! req.body.category_id || ! req.body.place_id) {
        res.status(400).send({error:"Please send title, category and place"});
        return
    }
    const item: ItemWithoutId = {
        category_id: req.body.category_id,
        place_id: req.body.place_id,
        title: req.body.title,
        description: req.body.description,
        image:req.file ?'images' + req.file.filename : null,
    };
    try {
        const connection = await mySqlDb.getConnection();
        const [result]= await connection.query('INSERT INTO items (category_id, place_id, title,description,image) VALUES (?, ?, ?, ?, ?)',
            [item.category_id, item.place_id, item.title,item.description, item.image]);
        const resultHeader = result as ResultSetHeader;
        const [resultOneItem]= await connection.query('SELECT * FROM items WHERE id = ?', [resultHeader.insertId]);
        const oneItem = resultOneItem as Items[];
        if (oneItem.length === 0 ){
            res.status(400).send({error:"Item not found"});
        } else {
            res.send(oneItem[0]);
        }
    }
    catch (e){
        next(e);
    }
});

itemsRouter.delete('/:id', async (req, res,next) => {
    const id = req.params.id;
    if (!req.params.id) {
        res.status(404).send({error:"Not found"});
    }
    try {
        const connection = await mySqlDb.getConnection();
        const [resultOneItems]= await connection.query('SELECT * FROM items WHERE id = ?', [id]);
        const OneItems =resultOneItems as Items[];
        if (OneItems .length === 0 ){
            res.status(404).send({error:"Not found"});
        } else{
            await connection.query('DELETE FROM items WHERE id = ?', [id]);
            res.send({message: 'Items deleted successfully.'});
        }
    }
    catch (e){
        next(e);
    }

});

itemsRouter.put('/:id',imagesUpload.single('image'), async (req, res,next) => {
    const id = req.params.id;
    if (!req.params.id) {
        res.status(404).send({error:"Not found"});
    }
        const connection = await mySqlDb.getConnection();
        if(!req.body.title || ! req.body.category_id || ! req.body.place_id) {
            res.status(400).send({error:"Please send title, category and place"});
            return
        }
        const item: ItemWithoutId = {
            category_id: req.body.category_id,
            place_id: req.body.place_id,
            title: req.body.title,
            description: req.body.description,
            image:req.file ?'images' + req.file.filename : null,
        };
        try{
        await connection.query('UPDATE items SET title = ?,description = ?, category_id=?, place_id = ?, image = ? WHERE id = ?', [item.title,item.description,item.category_id, item.place_id, item.image, id]);
        const [resultOneItem]= await connection.query('SELECT * FROM items WHERE id = ?', [id]);
        const oneItem = resultOneItem as Places[];
        if (oneItem.length === 0 ){
            res.status(400).send({error:"Item not found"})
        } else {
            res.send(oneItem[0]);
        }
    }
    catch (e){
        next(e);
    }
});

export default itemsRouter;