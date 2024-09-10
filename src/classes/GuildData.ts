import { GamerBotAPI } from "./gamerbot";

export class GuildData {
  guildID: string;
  privateVoiceChannel: string;
  publicVoiceChannel: string;
  infoVoiceChannel: string;
  notificationChannel: string;
  ticketParent: string;
  archivedTicketParent: string;
  allowedLinksChannels: Array<string>;
  trustedLinkRoles: Array<string>;
  noXpChannels: Array<string>;
  whitelistedLinks: Array<object>;
  threedChannels: Array<string>;
  bansTimes: Array<object>;
  topicList: Array<string>;
  staffModlogs: string;
  sverokMails: Array<string>;
  //eslint-disable-next-line
  json_data: any;
  //eslint-disable-next-line
  constructor(json_data: any) {
    this.json_data = JSON.parse(JSON.stringify(json_data));
    this.guildID = json_data.guildID;
    this.privateVoiceChannel = json_data.privateVoiceChannel;
    this.publicVoiceChannel = json_data.publicVoiceChannel;
    this.infoVoiceChannel = json_data.infoVoiceChannel;
    this.notificationChannel = json_data.notificationChannel;
    this.ticketParent = json_data.ticketParent;
    this.archivedTicketParent = json_data.archivedTicketParent;
    this.allowedLinksChannels = json_data.allowedLinksChannels;
    this.trustedLinkRoles = json_data.trustedLinkRoles;
    this.noXpChannels = json_data.noXpChannels;
    this.whitelistedLinks = json_data.whitelistedLinks;
    this.threedChannels = json_data.threedChannels;
    this.bansTimes = json_data.bansTimes;
    this.topicList = json_data.topicList;
    this.staffModlogs = json_data.staffModlogs;
    this.sverokMails = json_data.sverokMails;
  }
  /**
   * Saves guild data to database
   */
  async save() {
    return new Promise((resolve) => {
      //eslint-disable-next-line
      const changed_data: any = {};
      Object.keys(this).forEach((key) => {
        if (key == "json_data") return;
        const value = Object.entries(this).find(
          ([k, v]) =>
            k == key &&
            ((!Array.isArray(v) && !Object.is(v, this.json_data[key])) ||
              (Array.isArray(v) &&
                !GamerBotAPI.arraysEqual(v, this.json_data[key]))),
        );
        if (value) changed_data[key] = value[1];
      });
      if (Object.keys(changed_data).length == 0) return resolve(changed_data);
      fetch(GamerBotAPI.API_URL + "/api/guild/" + this.guildID, {
        method: "POST",
        body: JSON.stringify(changed_data),
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + GamerBotAPI.TOKEN,
        },
      })
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          console.error(err);
        });
    });
  }
}