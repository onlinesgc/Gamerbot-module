export class ConfigData{
    id: Number;
    debug: Boolean;
    username: String;
    activity : String;
    activityType : String;
    removeLinks: Boolean;
    xp : Object;
    importantUpdatesChannelId : Object;
    debugGuildID : String;
    constructor(json_data:any){
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
}