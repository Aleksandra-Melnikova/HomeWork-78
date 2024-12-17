import express from "express";
import fileDb from "../fileDb";
import {Items, ItemWithoutId, Places, PlacesWithoutId} from "../types";

const itemsRouter = express.Router();
const routerName = 'items';

itemsRouter.get('/', async (req, res) => {
    const items:Items[] = await fileDb.getItems(routerName) as Items[];
    const result = items.map(item => {
        return{
            id: item.id,
            name:item.title
        }
    })
    res.send(result);
});

itemsRouter.get('/:id', async (req, res) => {
    const items = await fileDb.getItems(routerName); // [{}, {}, {}, {}]
    const itemFindById = items.find((item) => item.id === req.params.id);
    res.send(itemFindById);
});


itemsRouter.post('/', async (req, res) => {
    if(!req.body.title || ! req.body.id_category || ! req.body.id_place) {
        res.status(400).send({error:"please send title, category and place"});
        return
    }
    const item: ItemWithoutId = {
        id_category: req.body.id_category,
        id_place: req.body.id_place,
        title: req.body.title,
        description: req.body.description,
        image_url:'',
        date: req.body.date,
    };

    const savedItems = await fileDb.addItem(item,routerName);
    res.send(savedItems);
});
itemsRouter.delete('/:id', async (req, res) => {
    const items = await fileDb.getItems(routerName);//проверить на связанность данных//
    const itemsFindById = items .find((item) => item.id === req.params.id);
    if(itemsFindById) {
        const placesNew = await fileDb.deleteItem(itemsFindById,routerName);
        res.send(placesNew);}
    else  res.status(400).send({error:"Id is incorrect"});//нужен ли ответ//
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

export default itemsRouter;