import { ConfigData } from "./ConfigData.js";
import { GamerBotAPI } from "./gamerbot.js";
import { GuildData } from "./GuildData.js";
import { UserData } from "./UserData.js";

export class Models {
    cachedUsersFrames: Map<string, UserFrameData>;
    constructor() {
        this.cachedUsersFrames = new Map<string, UserFrameData>();
    }
    /**
     * Get user data
     * @param userId discord user id
     * @returns
     */
    public async getUserData(userId: string) {
        const data = await this.fetchData(
            GamerBotAPI.API_URL + "/api/user/" + userId,
        );
        const userData = new UserData(data);
        return userData;
    }


    /**
     * Get multiple users data
     * @param maxUsers amount of users to fetch
     * @returns
     */
    public async getAllUserData(maxUsers: number, filter: object = {}) {
        const data = (await this.fetchData(
            GamerBotAPI.API_URL + "/api/user/fetch_many",
            "POST",
            { maxUsers: maxUsers, filter: filter },
        ));
        const userData: UserData[] = [];
        data.forEach((element: unknown) => userData.push(new UserData(element)));
        return userData;
    }

    /**
     * Get config data
     * @param id config id
     * @returns
     */
    public async getConfigData(id: number) {
        const data = await this.fetchData(
            GamerBotAPI.API_URL + "/api/config/" + id,
        );
        const configData = new ConfigData(data);
        return configData;
    }

    /**
     * Get guild data
     * @param guildId discord guild id
     * @returns
     */
    public async getGuildData(guildId: string) {
        const data = await this.fetchData(
            GamerBotAPI.API_URL + "/api/guild/" + guildId,
        );
        return new GuildData(data);
    }

    /**
     * Get users frame
     * @param userId
     * @returns
     */
    public async getUserFrame(
        userId: string,
        username: string,
        avatarUrl: string | null,
    ) {
        const userData = await this.getUserData(userId);

        let xpPercentage;
        if(userData.levelSystem.level == 0){
            xpPercentage = Math.round((userData.levelSystem.xp / (userData.levelSystem.level + 1) ** 2) * 100);
        }else{
            xpPercentage = Math.round((userData.levelSystem.xp / userData.levelSystem.level ** 2) * 100);
        }

        // Progressbar is constant after lvl 31
        if (userData.levelSystem.level > 31) {
            xpPercentage = Math.round((userData.levelSystem.xp / 961) * 100);
        }

        if(!userData.frameData.frameColorHexCode) userData.frameData.frameColorHexCode = "#000000";

        let cachedFrame : UserFrameData | null = null;
        if (this.cachedUsersFrames.has(userId)){
            cachedFrame = this.cachedUsersFrames.get(userId)!;
            if (cachedFrame.xp != userData.levelSystem.xp ||
                cachedFrame.level != userData.levelSystem.level ||
                cachedFrame.hexColor != userData.frameData.frameColorHexCode ||
                cachedFrame.frameId != userData.frameData.selectedFrame){
                cachedFrame = null;
                this.cachedUsersFrames.delete(userId);
            }
        }

        if (cachedFrame == null){
            cachedFrame = {
                frameId: userData.frameData.selectedFrame,
                hexColor: userData.frameData.frameColorHexCode,
                xpPercentage: xpPercentage,
                xp: userData.levelSystem.xp,
                level: userData.levelSystem.level,
                cachedId: Math.random().toString(36).substring(2, 15),
            };
            this.cachedUsersFrames.set(userId, cachedFrame);
        }

        const data = (await this.fetchData(
            GamerBotAPI.API_URL + "/public_api/frame/generate",
            "POST",
            {
                name: username,
                frameId: cachedFrame.frameId,
                hexColor: cachedFrame.hexColor,
                level: cachedFrame.level,
                xpPercentage: cachedFrame.xpPercentage,
                memberAvatar: avatarUrl,
                cachedId: cachedFrame.cachedId,
            },
            false,
        )) as Response;
        return Buffer.from(await data.arrayBuffer());
    }

    public async getFrameConfig() {
        const data = await this.fetchData(GamerBotAPI.API_URL + "/public_api/frame/config");
        return data.frames as FrameConfigElement[];
    }

    /**
     * Gets frame image
     */
    public async getFrame(frameId: string) {
        const data = (await this.fetchData(
            GamerBotAPI.API_URL + "/public_api/frame/" + frameId,
            "GET",
            null,
            false,
        )) as Response;
        return Buffer.from(await data.arrayBuffer());
    }

    private fetchData(
        url: string,
        method: string = "GET",
        // eslint-disable-next-line
        jsonData: any = null,
        convertToJson: boolean = true,
    ) {
        jsonData = jsonData ? JSON.stringify(jsonData) : null;
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: method,
                body: jsonData,
                headers: {
                    "Content-Type": "application/json",
                    authorization: "Bearer " + GamerBotAPI.TOKEN,
                },
            })
                .then(async (response) => {
                    if (!response.ok) {
                        const error = await response.json();
                        console.error("Error fetching data: ", error);
                        reject(error);
                    }
                    if (!convertToJson) return response;
                    else return response.json();
                })
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    console.error("Error fetching data: ", error);
                    reject(error);
                });
            // eslint-disable-next-line
        }) as Promise<any>;
    }
}

interface FrameConfigElement {
    name: string;
    id: number;
    path: string;
    frameLink: string;
}

interface UserFrameData {
    frameId: number;
    hexColor: string;
    xpPercentage: number;
    xp: number;
    level: number;
    cachedId: string;
}