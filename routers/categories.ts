import express from "express";
import fileDb from "../fileDb";
import {Categories, CategoriesWithoutId} from "../types";

const categoriesRouter = express.Router();
const routerName = 'categories';

categoriesRouter.get('/', async (req, res) => {
    const categories = await fileDb.getItems(routerName);
    console.log(categories);
    const result = categories.map(category => {
        return{
            id: category.id,
            name:category.title
        }
    })
    res.send(result);
});

categoriesRouter.get('/:id', async (req, res) => {
    const categories = await fileDb.getItems(routerName); // [{}, {}, {}, {}]
    const categoryFindById = categories.find((category) => category.id === req.params.id);
    res.send(categoryFindById);
});


categoriesRouter.post('/', async (req, res) => {
    if(!req.body.title) {
        res.status(400).send({error:"please send title"});
        return
    }
   const category: CategoriesWithoutId = {
     title: req.body.title,
     description: req.body.description,
   };

   const savedCategories = await fileDb.addItem(category,routerName);
   res.send(savedCategories);
});
categoriesRouter.delete('/:id', async (req, res) => {
    const categories = await fileDb.getItems(routerName);//проверить на связанность данных//
    const categoryFindById = categories.find((category) => category.id === req.params.id);
    if(categoryFindById) {
        const categoriesNew = await fileDb.deleteItem(categoryFindById,routerName);
        res.send(categoriesNew);}//нужен ли ответ//
});

// categoriesRouter.put('/:id', async (req, res) => {
//     const categories = await fileDb.getItems();
//     const index = categories.findIndex((category) => category.id === req.params.id);
//     console.log(index);
//     console.log(req.body.title)
//         const item:Categories ={
//             id:categories[index].id,
//             title:req.body.title,
//             description:req.body.description,}
//
//         console.log(item);
//         // const categoriesNew = await fileDb.putItem(item,index);
//         // console.log(categoriesNew);
//         // res.send(categoriesNew);
//
// });

export default categoriesRouter;
