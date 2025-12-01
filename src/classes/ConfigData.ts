import { GamerBotAPI } from "./gamerbot.js";

export class ConfigData {
    id: number;
    debug: boolean;
    levelSystem: LevelSystem;
    debugGuildId: string;
    extraObjects: Map<string, object>;
    // eslint-disable-next-line
    jsonData: any;
    // eslint-disable-next-line
    constructor(jsonData: any) {
        this.jsonData = JSON.parse(JSON.stringify(jsonData));
        this.id = jsonData.id;
        this.debugGuildId = jsonData.debugGuildId;
        this.debug = jsonData.debug;
        this.levelSystem = jsonData.levelSystem;
        this.extraObjects = new Map(Object.entries(jsonData.extraObjects));
    }
    /**
     * Saves config data to database
     */
    async save() {
        // eslint-disable-next-line
        const changedData: any = {};
        for (const key of Object.keys(this) as Array<keyof ConfigData>){
            if (key == "jsonData") continue;
            const currentValue = this[key];
            const jsonValue = this.jsonData[key];
            if (key === "extraObjects" && currentValue instanceof Map){
                const mapAsObject = Object.fromEntries(currentValue);
                if (JSON.stringify(mapAsObject) !== JSON.stringify(jsonValue)){
                    changedData[key] = mapAsObject;
                }
                continue;
            }

            if (typeof currentValue === "object" && currentValue !== null){
                if (JSON.stringify(currentValue) !== JSON.stringify(jsonValue)){
                    changedData[key] = currentValue;
                }
            }else if(currentValue !== jsonValue){
                changedData[key] = currentValue;
            }
        }

        if (Object.keys(changedData).length > 0){
            const jsonData = await fetch(GamerBotAPI.API_URL + "/api/config/" + this.id, {
                method: "POST",
                body: JSON.stringify(changedData),
                headers: {
                    "Content-Type": "application/json",
                    authorization: "Bearer " + GamerBotAPI.TOKEN,
                }
            });

            if (!jsonData.ok){
                console.error("Failed to save config data:", await jsonData.text());
                return;
            }

            this.jsonData = {
                ...this.jsonData,
                ...changedData,
            }

            const data = await jsonData.json();
            return data;
        }
    }
}

interface LevelSystem {
    levelExponent: number;
    levels: Array<Level>;
}
export interface Level {
    ids: Array<string>;
    level: number;
    message: string;
}