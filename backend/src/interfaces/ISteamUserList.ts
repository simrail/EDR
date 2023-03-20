export interface ISteamUserList {
    result: boolean,
    data: {
        SteamId: string,
        ServerCode: string,
        UserType: "driver" | "dispatcher",
        SteamInfo: {
                steamid: string,
                communityvisibilitystate: number,
                profilestate: number,
                personaname: string,
                commentpermission: number,
                profileurl: string,
                avatar: string,
                avatarmedium: string,
                avatarfull: string,
                avatarhash: string,
                personastate: number,
                primaryclanid: string,
                timecreated: number,
                personastateflags: number,
                gameserverip: string,
                gameserversteamid: string,
                gameextrainfo: string,
                gameid: string,
                loccountrycode: string,
                locstatecode: string
        }[],
        AdditionalInformation: {
            StationName?: string, 
            TrainNoLocal?: string
        },
    }[];
    count: null,
    description: string
}
  