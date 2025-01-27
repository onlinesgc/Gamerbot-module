import { GamerBotAPI } from "./gamerbot.js";

export class ConfigData {
    id: number;
    debug: boolean;
    username: string;
    activity: string;
    activityType: string;
    removeLinks: boolean;
    xp: object;
    importantUpdatesChannelId: object;
    debugGuildID: string;
    // eslint-disable-next-line
    json_data: any;
    // eslint-disable-next-line
    constructor(json_data: any) {
        this.json_data = JSON.parse(JSON.stringify(json_data));
        this.id = json_data.id;
        this.debug = json_data.debug;
        this.username = json_data.username;
        this.activity = json_data.activity;
        this.activityType = json_data.activityType;
        this.removeLinks = json_data.removeLinks;
        this.xp = json_data.xp;
        this.importantUpdatesChannelId = json_data.importantUpdatesChannelId;
        this.debugGuildID = json_data.debugGuildID;
    }
    /**
     * Saves config data to database
     */
    async save() {
        return new Promise((resolve) => {
            // eslint-disable-next-line
            const changed_data: any = {};
            Object.keys(this).forEach((key) => {
                if (key == "json_data") return;
                const value = Object.entries(this).find(
                    ([k, v]) =>{
                        if(k != key) return false;
                        return JSON.stringify(v) != JSON.stringify(this.json_data[key]);
                    }
                );
                if (value) changed_data[key] = value[1];
            });
            if (Object.keys(changed_data).length == 0)
                return resolve(changed_data);
            fetch(GamerBotAPI.API_URL + "/api/config/" + this.id, {
                method: "POST",
                body: JSON.stringify(changed_data),
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
