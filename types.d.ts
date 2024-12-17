export interface Categories{
    id: string;
    title: string;
    description: string;
}

export type CategoriesWithoutId = Omit<Categories, 'id'>

export interface Places{
    id: string;
    title: string;
    description: string;
}

export type PlacesWithoutId = Omit<Places, 'id'>

export interface Items{
    id: string;
    id_category: string;
    id_place: string;
    title: string;
    description: string;
    image_url: string | null;
    date: string;
}

export type ItemWithoutId = Omit<Items, 'id'>