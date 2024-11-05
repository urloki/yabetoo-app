"use server";


import {Cities} from "@/src/shemas/entity/city.schema";
import axios from "axios";

export const getCities = async ({
                                    countryId,
                                }: {
    countryId: string;
}): Promise<Cities> => {
    const host = process.env.YABETOO_ENTITY_API;
    const url = `${host}/cities/list?skip=&limit=&orderBy=&orderDesc=false`;

    if (!host) {
        throw new Error("AUTH API URL not found");
    }

    return await axios
        .post(url, {
            countryId,
        }).then((res) => {
            return res.data;
        }).catch((err) => {
            console.log(err);
            throw new Error("Une erreur est survenue lors de la récupération des données");
        });
};
