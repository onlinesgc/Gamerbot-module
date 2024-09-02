import { Models } from "./models";

/**
 * GamerBotAPI class, connect to the gamerbot API
 */
export class GamerBotAPI {
    TOKEN: any;
    public static API_URL: string = "https://api.sgc.se";
    apiStatus: boolean = false;
    public models: Models;

    constructor(TOKEN: any, dev:boolean = false) {
        this.TOKEN = TOKEN;
        this.models = new Models(this.TOKEN);
        // If dev is true, we will use the local API
        if(dev){
            GamerBotAPI.API_URL = "http://localhost:3000";
        }
        this.getAPIStatus().then(() => {
            console.log("API is available");
            this.apiStatus = true;
        });
    }

    public async getAPIStatus(){
        const response = await fetch(GamerBotAPI.API_URL);
        let data = await response.json().catch((err) => {
            console.error("API is not available, trying to connect to the API again in 5 seconds");
            setTimeout(() => {
                this.getAPIStatus();
            }, 5000); 
        });
        if(data.service == "OK")
            return;
        else{
            console.error("API is not available, trying to connect to the API again in 5 seconds");
            setTimeout(() => {
                this.getAPIStatus();
            }, 5000);
        }
    }
}