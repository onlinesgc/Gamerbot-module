import { GamerBotAPI } from "./gamerbot.js";

export class ConfigData {
    id: number;
    debug: boolean;
    levelSystem: LevelSystem;
    extraobjects: Map<string, object>;
    // eslint-disable-next-line
    jsonData: any;
    // eslint-disable-next-line
    constructor(jsonData: any) {
        this.jsonData = JSON.parse(JSON.stringify(jsonData));
        this.id = jsonData.id;
        this.debug = jsonData.debug;
        this.levelSystem = jsonData.levelSystem;
        this.extraobjects = new Map(Object.entries(jsonData.extraobjects));
    }
    /**
     * Saves config data to database
     */
    async save() {
        return new Promise((resolve) => {
            // eslint-disable-next-line
            const changedData: any = {};
            Object.keys(this).forEach((key) => {
                if (key == "jsonData") return;
                const value = Object.entries(this).find(
                    ([k, v]) =>{
                        if(k != key) return false;
                        return JSON.stringify(v) != JSON.stringify(this.jsonData[key]);
                    }
                );
                if (value) changedData[key] = value[1];
            });
            if (Object.keys(changedData).length == 0)
                return resolve(changedData);
            fetch(GamerBotAPI.API_URL + "/api/config/" + this.id, {
                method: "POST",
                body: JSON.stringify(changedData),
                headers: {
                    "Content-Type": "application/json",
                    authorization: "Bearer " + GamerBotAPI.TOKEN,
                },
            })
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    console.error(err);
                });
        });
    }
}

interface LevelSystem {
    levelExponent: number;
    levels: Array<Level>;
}
interface Level {
    ids: Array<string>;
    level: number;
    message: string;
}