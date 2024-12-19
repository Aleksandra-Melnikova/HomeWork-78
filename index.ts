import express from "express";
import categoriesRouter from "./routers/categories";
import placesRouter from "./routers/places";
import itemsRouter from "./routers/items";
import mySqlDb from "./mySqlDb";


const app = express();
const port = 8000;
app.use(express.static('public'));
app.use(express.json());
app.use('/categories', categoriesRouter);
app.use('/places', placesRouter);
app.use('/items', itemsRouter);


const run = async () => {
    await mySqlDb.init();
    app.listen(port, () => {
        console.log(`Server started on port http://localhost:${port}`);
    });
};

run().catch(err => console.log(err));


