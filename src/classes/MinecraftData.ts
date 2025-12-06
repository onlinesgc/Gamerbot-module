export class MinecraftData {
    uuid: string;
    name: string;
    discordId: string;
    // eslint-disable-next-line
    constructor(jsonData: any) {
        this.uuid = jsonData.uuid;
        this.name = jsonData.name;
        this.discordId = jsonData.discordId;
    }
}