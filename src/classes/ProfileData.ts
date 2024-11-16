import { GamerBotAPI } from "./gamerbot";

export class PorfileData {
    userID: string;
    serverID: string;
    xp: number;
    lastMessageTimestamp: number;
    xpTimeoutUntil: number;
    level: number;
    reminders: Array<object>;
    colorHexCode: string;
    privateVoiceID: string;
    privateVoiceThreadID: string;
    profileFrame: string;
    hasLeftTicket: boolean;
    xpboost: object;
    exclusiveFrames: Array<string>;
    modLogs: Array<object>;
    minecraftWhiteList: boolean;
    minecraftUsername: string;
    minecraftUuid: string;
    old_messages: Array<string>;
    hashed_email: string;
    // eslint-disable-next-line
    json_data: any;
    // eslint-disable-next-line
    constructor(json_data: any) {
        this.json_data = JSON.parse(JSON.stringify(json_data));
        this.userID = json_data.userID;
        this.serverID = json_data.serverID;
        this.xp = json_data.xp;
        this.lastMessageTimestamp = json_data.lastMessageTimestamp;
        this.xpTimeoutUntil = json_data.xpTimeoutUntil;
        this.level = json_data.level;
        this.reminders = json_data.reminders;
        this.colorHexCode = json_data.colorHexCode;
        this.privateVoiceID = json_data.privateVoiceID;
        this.privateVoiceThreadID = json_data.privateVoiceThreadID;
        this.profileFrame = json_data.profileFrame;
        this.hasLeftTicket = json_data.hasLeftTicket;
        this.xpboost = json_data.xpboost;
        this.exclusiveFrames = json_data.exclusiveFrames;
        this.modLogs = json_data.modLogs;
        this.minecraftWhiteList = json_data.minecraftWhiteList;
        this.minecraftUsername = json_data.minecraftUsername;
        this.minecraftUuid = json_data.minecraftUuid;
        this.old_messages = json_data.old_messages;
        this.hashed_email = json_data.hashed_email;
    }
    /**
     *  Saves user data to database
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
            fetch(GamerBotAPI.API_URL + "/api/user/" + this.userID, {
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
