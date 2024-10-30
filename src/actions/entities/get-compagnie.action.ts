"use server";


import {Compagnie} from "@/src/shemas/entities/compagnie.schema";
import axios from "axios";

export const getCompagnies = async (): Promise<Compagnie> => {
    const host = process.env.YABETOO_ENTITY_API;
    const url = `${host}/companies/list?skip=&limit=&orderBy=&orderDesc=false`;

    if (!host) {
        throw new Error("AUTH API URL not found");
    }

    return await axios
        .post(url, {
            enabled: true,
        }).then((res) => {
            console.log(res.data);
            return res.data;
        }).catch((err) => {
            console.log(err);
            throw new Error("Une erreur est survenue lors de la récupération des données");
        });

};
