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
    public async get_all_profile_data(max_users:Number){
        let data = await this.fetch_data(GamerBotAPI.API_URL +"/api/user/fetch_many", "POST", {maxUsers : max_users, filter : {}}) as Array<any>;
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

    private fetch_data(url: string, method: string = 'GET', json_data:any = null){
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