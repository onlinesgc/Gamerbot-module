import { ConfigData } from "./config_data";
import { GamerBotAPI } from "./gamerbot";
import { GuildData } from "./guild_data";
import { PorfileData } from "./ProfileData";


export class Models {
    constructor(){}
    /**
     * get profile data
     * @param user_id discord user id
     * @returns 
     */
    public async get_profile_data(user_id:String){
        let data = await this.fetch_data(GamerBotAPI.API_URL +"/api/user/" + user_id);
        let profile_data:PorfileData = new PorfileData(data);
        return profile_data;
    }
    /**
     * get all profile data
     * @param max_users amount of users to fetch
     * @returns 
     */
    public async get_all_profile_data(max_users:Number, filter:any = {}){
        let data = await this.fetch_data(GamerBotAPI.API_URL +"/api/user/fetch_many", "POST", {maxUsers : max_users, filter : filter}) as Array<any>;
        let profile_data:PorfileData[] = [];
        data.forEach((element:any) => {
            profile_data.push(new PorfileData(element));
        });
        return profile_data;
    }
    /**
     * get config data
     * @param id config id
     * @returns 
     */
    public async get_config_data(id:Number){
        let data = await this.fetch_data(GamerBotAPI.API_URL +"/api/config/" + id);
        let config_data:ConfigData = new ConfigData(data);
        return config_data;
    }
    /**
     * get guild data
     * @param guild_id discord guild id
     * @returns 
     */
    public async get_guild_data(guild_id:String){
        let data = await this.fetch_data(GamerBotAPI.API_URL +"/api/guild/" + guild_id);
        return new GuildData(data);
    }
    /**
     * Get users frame
     * @param user_id 
     * @returns 
     */
    public async get_user_frame(user_id:string,username:string ,avatar_url:string,force:boolean = false){
        return new Promise(async (resolve, reject) => {
            let profile_data = await this.get_profile_data(user_id);
    
            let xpPercentage = Math.round((profile_data.xp / (profile_data.level)**2) * 100);
    
            // Progressbar is constant after lvl 31
            if (profile_data.level > 31) {
                xpPercentage = Math.round((profile_data.xp / 961) * 100);
            }
    
            let data = await this.fetch_data(GamerBotAPI.API_URL +"/public_api/user/frame","POST",
                {
                    userid: user_id,
                    frame_id : profile_data.profileFrame,
                    hex_color : profile_data.colorHexCode,
                    username: username,
                    level: profile_data.level -1,
                    xp_percentage: xpPercentage,
                    avatar_url:avatar_url,
                    force: force
                }, false) as Response;
            resolve(Buffer.from(await data.arrayBuffer()));
        });
    }

    private fetch_data(url: string, method: string = 'GET', json_data:any = null, convert_to_json:boolean = true){
        json_data = json_data ? JSON.stringify(json_data) : null;
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: method,
                body: json_data,
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + GamerBotAPI.TOKEN
                }
            })
            .then(async response => {
                if(!response.ok){
                    let error = await response.json();
                    console.error("Error fetching data: ", error);
                    reject(error);
                }
                if(!convert_to_json)
                    return response;
                else
                    return response.json();
            })
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                console.error("Error fetching data: ", error);
                reject(error);
            });
        });

    }
} 