import {promises as fs} from 'fs';
import {Categories, CategoriesWithoutId, Items, ItemWithoutId, Places, PlacesWithoutId} from "./types";
import crypto from "crypto";


const fileName = './db.json';
let data: {'categories':Categories[],'places':Places[], 'items': Items[]} = {
    'categories':[],
    'places':[],
    'items':[]
};

const fileDb = {
    async init() {
        try {
            const fileContent = await fs.readFile(fileName);
             data = await JSON.parse(fileContent.toString()) ;
        } catch (e) {
            console.error(e);
        }
    },
    async getItems(routerName:'places'|'categories' |'items') {
        if(routerName==='places'){
            return data.places;
        } else if(routerName ==='categories'){
            return data.categories;}
        else if(routerName ==='items'){
                return data.items;
        }else return [];

    },
    async addItem(item: CategoriesWithoutId | PlacesWithoutId | ItemWithoutId, routerName:'places'|'categories' |'items') {
        const id = crypto.randomUUID();
        if(routerName==='categories'){
            const category = {id, ...item};
            const categories = data.categories;
            categories.push(category);
            await this.save();
            return category;
        } else if(routerName==='places'){
            const place = {id, ...item};
            const places = data.places;
            places.push(place);
            await this.save();
            return place;
        }
        else if(routerName==='items'){
            const itemNew = {id, ...item as ItemWithoutId};
            const items = data.items;
            items.push(itemNew);
            await this.save();
            return itemNew;
        }

    },
    async save() {
        return fs.writeFile(fileName, JSON.stringify(data));
    },
    async deleteItem(item:Categories | Places | Items,routerName:'places'|'categories' |'items') {
        if(routerName==='places'){data.places =  data.places.filter((category) => category !== item);
            await this.save();
            return data.places;}
        else if(routerName==='categories'){data.categories =  data.categories.filter((category) => category !== item);
            await this.save();
            return data.categories;}
        else if(routerName==='items'){
            {data.items =  data.items.filter((i) => i !== item);
                await this.save();
                return data.items;}
        }

    },
    // async putItem(item:Categories, index:number) {
    //     data = data.splice(index,1,item);
    //     await this.save();
    //     return data;
    // },
};

export default fileDb;