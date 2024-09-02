import { Models } from "./models";

/**
 * GamerBotAPI class, connect to the gamerbot API
 */
export class GamerBotAPI {
    public static TOKEN: any;
    public static API_URL: string = "https://api.sgc.se";
    apiStatus: boolean = false;
    public models: Models;

    constructor(TOKEN: any, dev:boolean = false) {
        GamerBotAPI.TOKEN = TOKEN;
        this.models = new Models();
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
    public static arraysEqual(a: Array<any>, b: Array<any>) {
        // if the other array is a falsy value, return
        if (!a)
            return false;
        // if the argument is the same array, we can be sure the contents are same as well
        if(a === b)
            return true;
        // compare lengths - can save a lot of time 
        if (b.length != a.length)
            return false;

        for (var i = 0, l=b.length; i < l; i++) {
            // Check if we have nested arrays
            if (b[i] instanceof Array && a[i] instanceof Array) {
                // recurse into the nested arrays
                if (!b[i].equals(a[i]))
                    return false;       
            }           
            else if (b[i] != a[i]) { 
                // Warning - two different object instances will never be equal: {x:20} != {x:20}
                return false;   
            }           
        }       
        return true;
    }

}
