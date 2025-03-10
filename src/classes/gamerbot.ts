import { Models } from "./models.js";

/**
 * GamerBotAPI class, connect to the gamerbot API
 */
export class GamerBotAPI {
    public static TOKEN: string;
    public static API_URL: string = "https://api.sgc.se";
    apiStatus: boolean = false;
    public models: Models;

    constructor(TOKEN: string, dev: boolean = false) {
        GamerBotAPI.TOKEN = TOKEN;
        this.models = new Models();
        // If dev is true, we will use the local API
        if (dev) {
            GamerBotAPI.API_URL = "http://localhost:3000";
        }
        this.getAPIStatus().then((t) => {
            if(t) {
                console.log("API is available");
            }
        });
    }

    public async getAPIStatus() : Promise<boolean> {
        const response = await fetch(GamerBotAPI.API_URL).catch(()=>{});

        if(response == undefined){
            return await new Promise<boolean>(r =>{
                console.error(
                    "API is not available, trying to connect to the API again in 5 seconds",
                );
                setTimeout(()=>{
                    this.getAPIStatus();
                    r(false);
                }, 5000);
            });
        }
        
        const data = await response.json().catch(() => {
            console.error(
                "API is not available, trying to connect to the API again in 5 seconds",
            );
            setTimeout(() => {
                this.getAPIStatus();
            }, 5000);
        });

        if (data.service == "OK"){
            this.apiStatus = true;
            return true;
        }
        else {
            console.error(
                "API is not available, trying to connect to the API again in 5 seconds",
            );
            setTimeout(() => {
                this.getAPIStatus();
            }, 5000);
        }
        return false;
    }
    public static arraysEqual<T>(a: Array<T>, b: Array<T>) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length !== b.length) return false;
      
        for (let i = 0; i < a.length; ++i) {
            if(typeof a[i] === 'object' && typeof b[i] === 'object'){
                if(!this.arraysEqual(Object.entries(a[i] as object), Object.entries(b[i] as object))) return false;
            }
            else if (a[i] !== b[i]) return false;
        }
        return true;
    }
}
