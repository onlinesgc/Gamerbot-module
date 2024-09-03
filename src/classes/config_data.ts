import { GamerBotAPI } from "./gamerbot";

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
    json_data: any;
    constructor(json_data:any){
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
    async save(){
        return new Promise((resolve, reject) => {
            let changed_data : any = {};
            Object.keys(this).forEach((key) => {
                if(key == "json_data")
                    return;
                let value = Object.entries(this).find(([k, v]) => 
                    k == key && 
                    ((!Array.isArray(v)) && !Object.is(v, this.json_data[key]) || (Array.isArray(v) && !GamerBotAPI.arraysEqual(v, this.json_data[key]))));
                if(value)
                    changed_data[key] = value[1];
            });
            if(Object.keys(changed_data).length == 0) return resolve(changed_data);
            fetch(GamerBotAPI.API_URL+"/api/config/" + this.id, {
                method: "POST",
                body: JSON.stringify(changed_data),
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + GamerBotAPI.TOKEN
                }
            }).then((response) => {resolve(response)}).catch((err) => {console.error(err)});
        });
    }
}