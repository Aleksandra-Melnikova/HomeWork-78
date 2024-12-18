import express from "express";
import fileDb from "../fileDb";
import { Places, PlacesWithoutId} from "../types";

const placesRouter = express.Router();
const routerName = 'places';

placesRouter.get('/', async (req, res) => {
    const places = await fileDb.getItems(routerName) as Places[];
    const result = places.map(place => {
        return{
            id: place.id,
            name:place.title
        }
    })
    res.send(result);
});

placesRouter.get('/:id', async (req, res) => {
    const places = await fileDb.getItems(routerName); // [{}, {}, {}, {}]
    const placeFindById = places.find((place) => place.id === req.params.id);
    res.send(placeFindById);
});


placesRouter.post('/', async (req, res) => {
    if(!req.body.title) {
        res.status(400).send({error:"please send title"});
        return
    }
    const place: PlacesWithoutId = {
        title: req.body.title,
        description: req.body.description,
    };

    const savedPlaces = await fileDb.addItem(place,routerName);
    res.send(savedPlaces);
});
placesRouter.delete('/:id', async (req, res) => {
    const places = await fileDb.getItems(routerName);//проверить на связанность данных//
    const placeFindById = places.find((place) => place.id === req.params.id);
    if(placeFindById) {
        const placesNew = await fileDb.deleteItem(placeFindById,routerName);
        res.send(placesNew);}//нужен ли ответ//
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

export default placesRouter;
