export interface Categories{
    id: number;
    title: string;
    description: string;
}

export type CategoriesWithoutId = Omit<Categories, 'id'>

export interface Places{
    id: number;
    title: string;
    description: string;
}

export type PlacesWithoutId = Omit<Places, 'id'>

export interface Items{
    id: number;
    category_id: number;
    place_id: number;
    title: string;
    description: string | null;
    image: string | null;
    date: string;
}

export type ItemWithoutId = Omit<Items, 'id','date'>