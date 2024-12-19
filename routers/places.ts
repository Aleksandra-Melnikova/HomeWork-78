import express from "express";
import {Items, Places, PlacesWithoutId} from "../types";
import mySqlDb from "../mySqlDb";
import {ResultSetHeader} from "mysql2";

const placesRouter = express.Router();

placesRouter.get('/', async (req, res,next) => {
    try {
        const connection = await mySqlDb.getConnection();
        const [result] = await connection.query('SELECT id, title FROM places');
        const places = result as Places[];
        res.send(places);
    }
    catch (e){
        next(e);
    }
});

placesRouter.get('/:id', async (req, res,next) => {
    const id = req.params.id;
    if (!req.params.id) {
        res.status(404).send({error:"Not found"});
    }
    try {
        const connection = await mySqlDb.getConnection();
        const [result]= await connection.query('SELECT * FROM places WHERE id = ?', [id]);
        const places = result as Places[];
        if (places.length === 0 ){
            res.status(400).send({error:"Place not found"})
        } else {
            res.send(places[0]);}
    }
    catch (e){
        next(e);
    }
});

placesRouter.post('/', async (req, res,next) => {
    if(!req.body.title) {
        res.status(400).send({error:"Please send title"});
        return
    }
    const place: PlacesWithoutId = {
        title: req.body.title,
        description: req.body.description,
    };
    try {
        const connection = await mySqlDb.getConnection();
        const [result]= await connection.query('INSERT INTO places (title,description) VALUES (?, ?)',
            [ place.title,place.description]);
        const resultHeader = result as ResultSetHeader;
        const [resultOnePlace]= await connection.query('SELECT * FROM places WHERE id = ?', [resultHeader.insertId]);
        const onePlace = resultOnePlace as Places[];
        if (onePlace.length === 0 ){
            res.status(400).send({error:"Place not found"})
        } else {
            res.send(onePlace[0]);
        }
    }
    catch (e){
        next(e);
    }
});
placesRouter.delete('/:id', async (req, res,next) => {
    const id = req.params.id;
    if (!req.params.id) {
        res.status(404).send({error:"Not found"});
    }
    try {
        const connection = await mySqlDb.getConnection();
        await connection.query('DELETE FROM places WHERE id = ?', [id]);
        const [result] = await connection.query('SELECT id, title FROM places');
        const places = result as Items[];
        res.send(places);
    }
    catch (e){
        next(e);
    }
});

placesRouter.put('/:id', async (req, res,next) => {
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
        const place: PlacesWithoutId = {
            title: req.body.title,
            description: req.body.description,
        };
        await connection.query('UPDATE places SET title = ?, description = ? WHERE id = ?', [place.title, place.description, id]);
        const [resultOnePlace]= await connection.query('SELECT * FROM places WHERE id = ?', [id]);
        const onePlace = resultOnePlace as Places[];
        if (onePlace.length === 0 ){
            res.status(400).send({error:"Place not found"})
        } else {
            res.send(onePlace[0]);
        }
    }
    catch (e){
        next(e);
    }
});

export default placesRouter;
