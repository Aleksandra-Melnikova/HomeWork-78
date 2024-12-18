import express from "express";
import fileDb from "../fileDb";
import {Items, ItemWithoutId} from "../types";
import {imagesUpload} from "../multer";

const itemsRouter = express.Router();
const routerName = 'items';

itemsRouter.get('/', async (req, res) => {
    const items = await fileDb.getItems(routerName) as Items[];
    const result = items.map(item => {
        return{
            id: item.id,
            name:item.title,
            id_category: item.id_category,
            id_place: item.id_place,
        }
    })
    res.send(result);
});

itemsRouter.get('/:id', async (req, res) => {
    const items = await fileDb.getItems(routerName);
    const itemFindById = items.find((item) => item.id === req.params.id);
    if(itemFindById ){
        res.send(itemFindById);
    }
    else (res.status(400).send({error:"Incorrect id"}));
});


itemsRouter.post('/',imagesUpload.single('image'), async (req, res) => {
    if(!req.body.title || ! req.body.id_category || ! req.body.id_place) {
        res.status(400).send({error:"please send title, category and place"});
        return
    }
    const item: ItemWithoutId = {
        id_category: req.body.id_category,
        id_place: req.body.id_place,
        title: req.body.title,
        description: req.body.description,
        image:req.file ?'images' + req.file.filename : null,
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
    else  res.status(400).send({error:"Incorrect id"});//нужен ли ответ//
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