/**
 * GamerBotAPI class, connect to the gamerbot API
 */
export class GamerBotAPI {
    TOKEN: string;
    API_URL: string = "https://api.sgc.se";
    apiStatus: boolean = false;

    constructor(TOKEN: string, dev:boolean = false) {
        this.TOKEN = TOKEN;
        // If dev is true, we will use the local API
        if(dev){
            this.API_URL = "http://localhost:3000";
        }
        this.getAPIStatus().then(() => {
            console.log("API is available");
            this.apiStatus = true;
        });
    }

    private async getAPIStatus(){
        const response = await fetch(this.API_URL);
        let data = await response.json();
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