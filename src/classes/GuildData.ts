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
        return new Promise((resolve) => {
            //eslint-disable-next-line
            const changed_data: any = {};
            Object.keys(this).forEach((key) => {
                if (key == "jsonData") return;
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
            fetch(GamerBotAPI.API_URL + "/api/guild/" + this.guildId, {
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
}