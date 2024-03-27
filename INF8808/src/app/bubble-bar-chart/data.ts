export enum AccidentCategory {
    Contact = "Contact avec un object ou de l'equipement",
    Chutes = "Chutes",
    Reaction = "Reactions du corps et efforts",
    Exposition = "Exposition a des substances ou a des environnements nocifs",
    Transport = "Accident de transport",
    Aggression = "Voies de fait et actes violents",
    Feux = "Feux et explosions",
    Autres = "Autres ou indetermines",
};

export type Accident = {
    type: string;
    category: AccidentCategory;
    count: number;
};

export const data: Accident[] = [
    { type: "Heurter un object", category: AccidentCategory.Contact, count: 100 },
    { type: "Heurter un object", category: AccidentCategory.Chutes, count: 200 },
    { type: "Heurter un object", category: AccidentCategory.Reaction, count: 300 },
    { type: "Heurter un object", category: AccidentCategory.Exposition, count: 400 },
    { type: "Heurter un object", category: AccidentCategory.Transport, count: 500 },
    { type: "Heurter un object", category: AccidentCategory.Aggression, count: 600 },
    { type: "Heurter un object", category: AccidentCategory.Feux, count: 700 },
    { type: "Heurter un object", category: AccidentCategory.Autres, count: 800 },
    { type: "Heurter un object", category: AccidentCategory.Contact, count: 100 },
    { type: "Heurter un object", category: AccidentCategory.Chutes, count: 200 },
    { type: "Heurter un object", category: AccidentCategory.Reaction, count: 300 },
    { type: "Heurter un object", category: AccidentCategory.Exposition, count: 400 },
    { type: "Heurter un object", category: AccidentCategory.Transport, count: 500 },
    { type: "Heurter un object", category: AccidentCategory.Aggression, count: 600 },
    { type: "Heurter un object", category: AccidentCategory.Feux, count: 700 },
    { type: "Heurter un object", category: AccidentCategory.Autres, count: 800 },
    { type: "Heurter un object", category: AccidentCategory.Contact, count: 100 },
    { type: "Heurter un object", category: AccidentCategory.Chutes, count: 200 },
    { type: "Heurter un object", category: AccidentCategory.Reaction, count: 300 },
    { type: "Heurter un object", category: AccidentCategory.Exposition, count: 400 },
    { type: "Heurter un object", category: AccidentCategory.Transport, count: 500 },
    { type: "Heurter un object", category: AccidentCategory.Aggression, count: 600 },
    { type: "Heurter un object", category: AccidentCategory.Feux, count: 700 },
    { type: "Heurter un object", category: AccidentCategory.Autres, count: 800 },
];
