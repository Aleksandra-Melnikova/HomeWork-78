import express from "express";
import fileDb from "./fileDb";

import fs = require("fs");
import categoriesRouter from "./routers/categories";
import placesRouter from "./routers/places";


const app = express();
const port = 8000;

app.use(express.json());

app.use('/categories', categoriesRouter);
app.use('/places', placesRouter);

const run = async () => {
    if (fs.existsSync('./db.json')) {
        await fileDb.init();
    } else {
        fs.writeFileSync('./db.json', JSON.stringify([]));
    }

    app.listen(port, () => {
        console.log(`Server started on port http://localhost:${port}`);
    });
};

run().catch(err => console.log(err));


