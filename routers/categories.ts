import express from "express";
import {Categories, CategoriesWithoutId} from "../types";
import mySqlDb from "../mySqlDb";
import {ResultSetHeader} from "mysql2";

const categoriesRouter = express.Router();

categoriesRouter.get('/', async (req, res, next) => {
    try {
        const connection = await mySqlDb.getConnection();
        const [result] = await connection.query('SELECT id, title FROM categories');
        const categories = result as Categories[];
        res.send(categories);
    }
    catch (e){
        next(e);
    }
});

categoriesRouter.get('/:id', async (req, res,next) => {
  const id = req.params.id;
  if (!req.params.id) {
      res.status(404).send({error:"Not found"});
  }
  try {
      const connection = await mySqlDb.getConnection();
      const [result]= await connection.query('SELECT * FROM categories WHERE id = ?', [id]);
      const categories = result as Categories[];
      if (categories.length === 0 ){
          res.status(400).send({error:"Category not found"});
      } else {
          res.send(categories[0]);
      }
  }
  catch (e){
      next(e);
  }
});

categoriesRouter.post('/', async (req, res,next) => {
    if(!req.body.title) {
        res.status(400).send({error:"Please send title"});
        return
    }
    const category: CategoriesWithoutId = {
        title: req.body.title,
        description: req.body.description,
    };
    try {
        const connection = await mySqlDb.getConnection();
        const [result]= await connection.query('INSERT INTO categories (title,description) VALUES (?, ?)',
            [ category.title,category.description]);
        const resultHeader = result as ResultSetHeader;
        const [resultOneCategory]= await connection.query('SELECT * FROM categories WHERE id = ?', [resultHeader.insertId]);
        const oneCategory = resultOneCategory as Categories[];
        if (oneCategory.length === 0 ){
            res.status(400).send({error:"Category not found"});
        } else {
            res.send(oneCategory[0]);
        }
    }
    catch (e){
        next(e);
    }

});
categoriesRouter.delete('/:id', async (req, res,next) => {
    const id = req.params.id;
    if (!req.params.id) {
        res.status(404).send({error:"Not found"});
    }
    try {
        const connection = await mySqlDb.getConnection();
        const [resultOneCategory]= await connection.query('SELECT * FROM categories WHERE id = ?', [id]);
        const oneCategory = resultOneCategory as Categories[];
        if (oneCategory.length === 0 ){
            res.status(404).send({error:"Not found"});
        } else{
            await connection.query('DELETE FROM categories WHERE id = ?', [id]);
            res.send({message: 'Category deleted successfully.'});
        }
    }
    catch (e){
        next(e);
    }
});

categoriesRouter.put('/:id', async (req, res,next) => {
    const id = req.params.id;
    if (!req.params.id) {
        res.status(404).send({error:"Not found"});
    }
    try {
        const connection = await mySqlDb.getConnection();
        if(!req.body.title) {
            res.status(400).send({error:"Please send title"});
            return
        }
        const category: CategoriesWithoutId = {
            title: req.body.title,
            description: req.body.description,
        };
         await connection.query(`UPDATE categories SET title = ?, description = ? WHERE id = ?`, [category.title, category.description, id]);
        const [resultOneCategory]= await connection.query('SELECT * FROM categories WHERE id = ?', [id]);
        const oneCategory = resultOneCategory as Categories[];
        if (oneCategory.length === 0 ){
            res.status(400).send({error:"Place not found"})
        } else {
            res.send(oneCategory[0]);
        }
    }
    catch (e){
        next(e);
    }
});

export default categoriesRouter;
