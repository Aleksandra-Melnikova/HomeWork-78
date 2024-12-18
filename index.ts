import express from "express";
import fileDb from "./fileDb";

import fs = require("fs");
import categoriesRouter from "./routers/categories";
import placesRouter from "./routers/places";
import itemsRouter from "./routers/items";


const app = express();
const port = 8000;
app.use(express.static('public'));
app.use(express.json());
app.use('/categories', categoriesRouter);
app.use('/places', placesRouter);
app.use('/items', itemsRouter);


const run = async () => {
    if (fs.existsSync('./db.json')) {
        await fileDb.init();
    } else {
        fs.writeFileSync('./db.json', JSON.stringify({categories:[],
            places:[],
            items:[]
        }));
    }

    app.listen(port, () => {
        console.log(`Server started on port http://localhost:${port}`);
    });
};

run().catch(err => console.log(err));


