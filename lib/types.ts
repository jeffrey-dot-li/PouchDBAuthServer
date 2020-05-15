

    export const ProviderNames = {
        discord : "discord",
        local : "local"
    } as const;

    export type ProviderTypes = typeof ProviderNames;
    export type Provider_T = keyof typeof ProviderNames;

    export interface BaseUser<T extends Provider_T> {
        provider :Provider_T[];
        token : string;
        password : string;
        user_id : string;
        roles : string[];
        issued : number;
        expires : number;

        signUp : {
            provider : T;
            timestamp : string;
            ip : string;
        }
    }
    export interface DiscordUser extends BaseUser<"discord"> {

        discord : {
            profile : {},
            auth : {
                accessToken : string;
                refreshToken : string;
            }
        };
        signUp : {
            provider : ProviderTypes['discord'],
            timestamp : string;
            ip : string;
        }
    } 

    export interface LocalUser extends BaseUser<"local"> {
        signUp : {
            provider : ProviderTypes['local'],
            timestamp : string;
            ip : string;
        }
    }
    export type UserDoc_T = DiscordUser;
