export enum CategorieGenre {
    Contact = "Contact avec un object ou de l'equipement",
    Chutes = "Chutes",
    Reaction = "Reactions du corps et efforts",
    Exposition = "Exposition a des substances ou a des environnements nocifs",
    Transport = "Accident de transport",
    Aggression = "Voies de fait et actes violents",
    Feux = "Feux et explosions",
    Autres = "Autres ou indetermines",
};

export type Lesion = {
    genre: string;
    categorie_genre: string;
    nb_lesion: number;
};

export const data: Lesion[] = [
    { genre: "Heurter un object", categorie_genre: CategorieGenre.Contact, nb_lesion: 100 },
    { genre: "Heurter un object", categorie_genre: CategorieGenre.Chutes, nb_lesion: 200 },
    { genre: "Heurter un object", categorie_genre: CategorieGenre.Reaction, nb_lesion: 300 },
    { genre: "Heurter un object", categorie_genre: CategorieGenre.Exposition, nb_lesion: 400 },
    { genre: "Heurter un object", categorie_genre: CategorieGenre.Transport, nb_lesion: 500 },
    { genre: "Heurter un object", categorie_genre: CategorieGenre.Aggression, nb_lesion: 600 },
    { genre: "Heurter un object", categorie_genre: CategorieGenre.Feux, nb_lesion: 700 },
    { genre: "Heurter un object", categorie_genre: CategorieGenre.Autres, nb_lesion: 800 },
    { genre: "Heurter un object", categorie_genre: CategorieGenre.Contact, nb_lesion: 100 },
    { genre: "Heurter un object", categorie_genre: CategorieGenre.Chutes, nb_lesion: 200 },
    { genre: "Heurter un object", categorie_genre: CategorieGenre.Reaction, nb_lesion: 300 },
    { genre: "Heurter un object", categorie_genre: CategorieGenre.Exposition, nb_lesion: 400 },
    { genre: "Heurter un object", categorie_genre: CategorieGenre.Transport, nb_lesion: 500 },
    { genre: "Heurter un object", categorie_genre: CategorieGenre.Aggression, nb_lesion: 600 },
    { genre: "Heurter un object", categorie_genre: CategorieGenre.Feux, nb_lesion: 700 },
    { genre: "Heurter un object", categorie_genre: CategorieGenre.Autres, nb_lesion: 800 },
    { genre: "Heurter un object", categorie_genre: CategorieGenre.Contact, nb_lesion: 100 },
    { genre: "Heurter un object", categorie_genre: CategorieGenre.Chutes, nb_lesion: 200 },
    { genre: "Heurter un object", categorie_genre: CategorieGenre.Reaction, nb_lesion: 300 },
    { genre: "Heurter un object", categorie_genre: CategorieGenre.Exposition, nb_lesion: 400 },
    { genre: "Heurter un object", categorie_genre: CategorieGenre.Transport, nb_lesion: 500 },
    { genre: "Heurter un object", categorie_genre: CategorieGenre.Aggression, nb_lesion: 600 },
    { genre: "Heurter un object", categorie_genre: CategorieGenre.Feux, nb_lesion: 700 },
    { genre: "Heurter un object", categorie_genre: CategorieGenre.Autres, nb_lesion: 800 },
];
