export class PorfileData{
    userID : string;
    serverID : string;
    xp : number;
    lastMessageTimestamp : number;
    xpTimeoutUntil : number;
    level : number;
    reminder : Array<string>
    colorHexCode : string;
    privateVoiceID : string;
    privateVoiceThreadID : string;
    profileFrame: string;
    hasLeftTicket: boolean;
    xpboost : object;
    exclusiveFrames : Array<string>;
    modLogs: Array<object>;
    minecraftWhiteList:boolean;
	minecraftUsername:string;
	minecraftUuid:string;
    constructor(json_data:any){
        this.userID = json_data.userID;
        this.serverID = json_data.serverID;
        this.xp = json_data.xp;
        this.lastMessageTimestamp = json_data.lastMessageTimestamp;
        this.xpTimeoutUntil = json_data.xpTimeoutUntil;
        this.level = json_data.level;
        this.reminder = json_data.reminder;
        this.colorHexCode = json_data.colorHexCode;
        this.privateVoiceID = json_data.privateVoiceID;
        this.privateVoiceThreadID = json_data.privateVoiceThreadID;
        this.profileFrame = json_data.profileFrame;
        this.hasLeftTicket = json_data.hasLeftTicket;
        this.xpboost = json_data.xpboost;
        this.exclusiveFrames = json_data.exclusiveFrames;
        this.modLogs = json_data.modLogs;
        this.minecraftWhiteList = json_data.minecraftWhiteList;
        this.minecraftUsername = json_data.minecraftUsername;
        this.minecraftUuid = json_data.minecraftUuid;
    }
} 