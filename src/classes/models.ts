import { ConfigData } from "./config_data";
import { GamerBotAPI } from "./gamerbot";
import { PorfileData } from "./ProfileData";

export class Models {
    TOKEN: string;
    constructor(token: string){
        this.TOKEN = token;
    }

    public async get_profile_data(user_id:String){
        let data = await this.fetch_data(GamerBotAPI.API_URL +"/api/user/" + user_id);
        let profile_data:PorfileData = new PorfileData(data);
        return profile_data;
    }

    public async get_config_data(id:Number){
        let data = await this.fetch_data(GamerBotAPI.API_URL +"/api/config/" + id);
        let config_data:ConfigData = new ConfigData(data);
        return config_data;
    }

    private fetch_data(url: string, method: string = 'GET'){
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + this.TOKEN
                }
            })
            .then(response => response.json())
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