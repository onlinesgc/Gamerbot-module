import { ConfigData } from "./ConfigData.js";
import { GamerBotAPI } from "./gamerbot.js";
import { GuildData } from "./GuildData.js";
import { UserData } from "./UserData.js";

export class Models {
    constructor() {}
    /**
     * get profile data
     * @param userId discord user id
     * @returns
     */
    public async getProfileData(userId: string) {
        const data = await this.fetchData(
            GamerBotAPI.API_URL + "/api/user/" + userId,
        );
        const userData = new UserData(data);
        return userData;
    }


    /**
     * get all profile data
     * @param maxUsers amount of users to fetch
     * @returns
     */
    public async getAllProfileData(maxUsers: number, filter: object = {}) {
        const data = (await this.fetchData(
            GamerBotAPI.API_URL + "/api/user/fetch_many",
            "POST",
            { maxUsers: maxUsers, filter: filter },
            // eslint-disable-next-line
        )) as Array<any>;
        const userData: UserData[] = [];
        // eslint-disable-next-line
        data.forEach((element: any) => {
            userData.push(new UserData(element));
        });
        return userData;
    }

    /**
     * get config data
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
     * get guild data
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
        avatarUrl: string,
        force: boolean = false,
    ) {
        const userData = await this.getProfileData(userId);

        let xpPercentage = Math.round(
            (userData.levelSystem.xp / userData.levelSystem.level ** 2) * 100,
        );

        // Progressbar is constant after lvl 31
        if (userData.levelSystem.level > 31) {
            xpPercentage = Math.round((userData.levelSystem.xp / 961) * 100);
        }

        if(!userData.frameData.frameColorHexCode) userData.frameData.frameColorHexCode = "#000000";

        const data = (await this.fetchData(
            GamerBotAPI.API_URL + "/public_api/frame/generate",
            "POST",
            {
                userid: userId,
                frame_id: userData.frameData.selectedFrame,
                hex_color: userData.frameData.frameColorHexCode,
                username: username,
                level: userData.levelSystem.level - 1,
                xp_percentage: xpPercentage,
                avatar_url: avatarUrl,
                force: force,
            },
            false,
        )) as Response;
        return Buffer.from(await data.arrayBuffer());
    }

    public async getFrameConfig() {
        const data = await this.fetchData(GamerBotAPI.API_URL + "/public_api/frame/config");
        return data;
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
