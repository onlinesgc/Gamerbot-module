import { Models } from "./models";

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
        this.getAPIStatus().then(() => {
            console.log("API is available");
            this.apiStatus = true;
        });
    }

    public async getAPIStatus() {
        const response = await fetch(GamerBotAPI.API_URL);
        const data = await response.json().catch(() => {
            console.error(
                "API is not available, trying to connect to the API again in 5 seconds",
            );
            setTimeout(() => {
                this.getAPIStatus();
            }, 5000);
        });
        if (data.service == "OK") return;
        else {
            console.error(
                "API is not available, trying to connect to the API again in 5 seconds",
            );
            setTimeout(() => {
                this.getAPIStatus();
            }, 5000);
        }
    }
    public static arraysEqual<T>(a: Array<T>, b: Array<T>) {
        // if the other array is a falsy value, return
        if (!a) return false;
        // if the argument is the same array, we can be sure the contents are same as well
        if (a === b) return true;
        // compare lengths - can save a lot of time
        if (b.length != a.length) return false;
        return true;
    }
}
