import { GamerBotAPI } from "./gamerbot.js";

export class UserData {
    userId: string;
    levelSystem: LevelSystem;
    frameData: FrameData;
    voiceData: voiceData;
    modLogs: Array<object>
    minecraftData: minecraftData;
    hashedEmail: string;
    reminders: Array<string>;
    extraObjects: Map<string, object>
    // eslint-disable-next-line
    jsonData: any;
    // eslint-disable-next-line
    constructor(json_data: any) {
        this.jsonData = JSON.parse(JSON.stringify(json_data));
        this.userId = json_data.userId;
        this.levelSystem = json_data.levelSystem;
        this.frameData = json_data.frameData;
        this.voiceData = json_data.voiceData;
        this.modLogs = json_data.modLogs;
        this.minecraftData = json_data.minecraftData;
        this.hashedEmail = json_data.hashedEmail;
        this.reminders = json_data.reminders;
        this.extraObjects = new Map(Object.entries(json_data.extraObjects));
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
                        return JSON.stringify(v) != JSON.stringify(this.jsonData[key]);
                    }
                );
                if (value) changed_data[key] = value[1];
            });
            if (Object.keys(changed_data).length == 0)
                return resolve(changed_data);
            fetch(GamerBotAPI.API_URL + "/api/user/" + this.userId, {
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
interface LevelSystem {
    level: number;
    xp: number;
    xpTimeoutUntil: number;
    lastMessageTimestamp: number;
    oldMessages: Array<string>;
}
interface FrameData {
    frameColorHexCode: string;
    selectedFrame: number;
    frames: Array<string>;
}
interface voiceData {
    voiceChannelId: string;
    voiceChannelThreadId: string;
}
interface minecraftData {
    uuid: string;
    username: string;
}
