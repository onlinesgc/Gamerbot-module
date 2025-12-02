import { GamerBotAPI } from "./gamerbot.js";

export class UserData {
    userId: string;
    levelSystem: LevelSystem;
    frameData: FrameData;
    voiceData: VoiceData;
    modLogs: Array<ModLog>;
    minecraftData: MinecraftData;
    hashedEmail: string;
    reminders: Array<object>;
    extraObjects: Map<string, object>
    // eslint-disable-next-line
    jsonData: any;
    // eslint-disable-next-line
    constructor(jsonData: any) {
        this.jsonData = JSON.parse(JSON.stringify(jsonData));
        this.userId = jsonData.userId;
        this.levelSystem = jsonData.levelSystem;
        this.frameData = jsonData.frameData;
        this.voiceData = jsonData.voiceData;
        this.modLogs = jsonData.modLogs;
        this.minecraftData = jsonData.minecraftData;
        this.hashedEmail = jsonData.hashedEmail;
        this.reminders = jsonData.reminders;
        this.extraObjects = new Map(Object.entries(jsonData.extraObjects));
    }
    /**
     *  Saves user data to database
     */
    async save() {
        // eslint-disable-next-line
        const changedData: any = {};
        for (const key of Object.keys(this) as Array<keyof UserData>){
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
            const jsonData = await fetch(GamerBotAPI.API_URL + "/api/user/" + this.userId, {
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
interface VoiceData {
    voiceChannelId: string;
    voiceChannelThreadId: string;
}
interface MinecraftData {
    uuid: string;
    username: string;
}

interface ModLog {
    type: string;
    userId: string;
    username: string;
    reason: string;
    timestamp: number;
    length: string | null;
    authorId: string;
}
