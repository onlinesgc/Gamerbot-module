import { GamerBotAPI } from "./gamerbot.js";

export class GuildData {
    guildId: string;
    voiceChannelData: voiceChannelData;
    ticketData: ticketData;
    autoModeration: autoModeration;
    topics: Array<string>;
    noXpChannels: Array<string>;
    frames: Array<frameData>;
    extraObjects: Map<string, object>;
    // eslint-disable-next-line
    jsonData: any;
    // eslint-disable-next-line
    constructor(jsonData: any) {
        this.jsonData = JSON.parse(JSON.stringify(jsonData));
        this.guildId = jsonData.guildId;
        this.voiceChannelData = jsonData.voiceChannelData;
        this.ticketData = jsonData.ticketData;
        this.autoModeration = jsonData.autoModeration;
        this.topics = jsonData.topics;
        this.noXpChannels = jsonData.noXpChannels;
        this.frames = jsonData.frames;
        this.extraObjects = new Map(Object.entries(jsonData.extraObjects));
    }
    /**
     * Saves guild data to database
     */
    async save() {
        // eslint-disable-next-line
        const changedData: any = {};
        for (const key of Object.keys(this) as Array<keyof GuildData>){
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
            const jsonData = await fetch(GamerBotAPI.API_URL + "/api/guild/" + this.guildId, {
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
interface voiceChannelData {
    voiceChannelId: string;
    infoChatId: string;
}
interface ticketData {
    ticketCategoryId: string;
    archivedTicketCategoryId: string;
}
interface autoModeration{
    linkFilter: boolean;
    trustedLinkRoles: Array<string>;
    linkChannels: Array<string>;
    whitelistedLinks: Array<string>;
    bannedUsers: Array<object>;
    modLogChannelId: string;
}
interface frameData {
    name: string;
    path: string;
    id: string;
    foregroundPath: string;
}