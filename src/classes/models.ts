import { ConfigData } from "./ConfigData";
import { GamerBotAPI } from "./gamerbot";
import { GuildData } from "./GuildData";
import { PorfileData } from "./ProfileData";

export class Models {
  constructor() {}
  /**
   * get profile data
   * @param user_id discord user id
   * @returns
   */
  public async get_profile_data(user_id: string) {
    const data = await this.fetch_data(
      GamerBotAPI.API_URL + "/api/user/" + user_id,
    );
    const profile_data = new PorfileData(data);
    return profile_data;
  }
  /**
   * get all profile data
   * @param max_users amount of users to fetch
   * @returns
   */
  public async get_all_profile_data(max_users: number, filter: object = {}) {
    const data = (await this.fetch_data(
      GamerBotAPI.API_URL + "/api/user/fetch_many",
      "POST",
      { maxUsers: max_users, filter: filter },
    // eslint-disable-next-line
    )) as Array<any>;
    const profile_data: PorfileData[] = [];
    // eslint-disable-next-line
    data.forEach((element: any) => {
      profile_data.push(new PorfileData(element));
    });
    return profile_data;
  }

  /**
   * get config data
   * @param id config id
   * @returns
   */
  public async get_config_data(id: number) {
    const data = await this.fetch_data(
      GamerBotAPI.API_URL + "/api/config/" + id,
    );
    const config_data = new ConfigData(data);
    return config_data;
  }

  /**
   * get guild data
   * @param guild_id discord guild id
   * @returns
   */
  public async get_guild_data(guild_id: string) {
    const data = await this.fetch_data(
      GamerBotAPI.API_URL + "/api/guild/" + guild_id,
    );
    return new GuildData(data);
  }

  /**
   * Get users frame
   * @param user_id
   * @returns
   */
  public async get_user_frame(
    user_id: string,
    username: string,
    avatar_url: string,
    force: boolean = false,
  ) {
    const profile_data = await this.get_profile_data(user_id);

    let xpPercentage = Math.round(
      (profile_data.xp / profile_data.level ** 2) * 100,
    );

    // Progressbar is constant after lvl 31
    if (profile_data.level > 31) {
      xpPercentage = Math.round((profile_data.xp / 961) * 100);
    }

    const data = (await this.fetch_data(
      GamerBotAPI.API_URL + "/public_api/user/frame",
      "POST",
      {
        userid: user_id,
        frame_id: profile_data.profileFrame,
        hex_color: profile_data.colorHexCode,
        username: username,
        level: profile_data.level - 1,
        xp_percentage: xpPercentage,
        avatar_url: avatar_url,
        force: force,
      },
      false,
    )) as Response;
    return Buffer.from(await data.arrayBuffer());
  }

  /**
   * Get users frame
   * @param user_id
   * @returns
   */
  private fetch_data(
    url: string,
    method: string = "GET",
    // eslint-disable-next-line
    json_data: any = null,
    convert_to_json: boolean = true,
  ) {
    json_data = json_data ? JSON.stringify(json_data) : null;
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: method,
        body: json_data,
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + GamerBotAPI.TOKEN,
        },
      })
        .then(async (response) => {
          if (!response.ok) {
            const error = await response.json();
            console.error("Error fetching data: ", error);
            reject(error);
          }
          if (!convert_to_json) return response;
          else return response.json();
        })
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
          reject(error);
        });
      // eslint-disable-next-line
    }) as Promise<any>;
  }
}
