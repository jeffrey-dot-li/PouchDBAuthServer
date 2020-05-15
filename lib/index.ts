/// <reference types="./types/superlogin" />
import express from "express"
import http from 'http';
import bodyParser from 'body-parser';
import logger from 'morgan';
import SuperLogin from 'superlogin'
import PassportDiscord from 'passport-discord'
import sl_config from './superlogin.config'
import path from 'path'
import axios, {AxiosResponse} from 'axios';
import {ProviderNames, Provider_T, UserDoc_T} from './types'
import { config_discord } from "./envars";
try {
    
const app = express();
app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
const superlogin = new SuperLogin(sl_config, app);

app.use('/auth', superlogin.router);
app.get('/favicon.ico', (req, res) => {
    res.send(""); // Otherwise gives 404 error when looking for icon
})
app.get('/yeet', (req,res)=> {
    res.sendFile(path.join(__dirname + '/index.html'));
})
superlogin.registerTokenProvider('discord', PassportDiscord.Strategy); // 
superlogin.registerOAuth2('discord', PassportDiscord.Strategy); //
function pushToArray<T>(arr : T[], obj : T) {
    const index = arr.findIndex((e) => e==obj);
    if (index === -1) {
        return [...arr, obj]
    } else {
        return[...arr];
    }
}
interface guild {
    id : string,
    name : string, 

}

superlogin.onCreate(async (userDoc : UserDoc_T, provider : Provider_T) => {
    switch(userDoc.signUp.provider)
    {
        case ProviderNames.discord:
            const config = {
                headers: { Authorization: `Bearer ${userDoc.discord.auth.accessToken}` }
            };
            userDoc.signUp
            const guilds : AxiosResponse<guild[]> = await axios.get(`https://discord.com/api/v6/users/@me/guilds`, config);
            const guildIndex = guilds.data.findIndex((guild) => guild.id == config_discord.authParams[0].id);
            if(guildIndex != -1)
            {
                userDoc.roles = pushToArray(userDoc.roles, "vscout_member")
            }
            break
    }
    console.log("On Create", {userDoc, provider});
    return Promise.resolve(userDoc);
})

superlogin.onLink(async (userDoc : UserDoc_T, provider : Provider_T) => {
    console.log("On Link", {userDoc, provider});
    switch(userDoc.signUp.provider)
    {
        case ProviderNames.discord:
            const config = {
                headers: { Authorization: `Bearer ${userDoc.discord.auth.accessToken}` }
            };
            const guilds : AxiosResponse<guild[]> = await axios.get(`https://discord.com/api/v6/users/@me/guilds`, config);
            const guildIndex = guilds.data.findIndex((guild) => guild.id == config_discord.authParams[0].id);
            if(guildIndex != -1)
            {
                console.log("Discord Authed");
                userDoc.roles = pushToArray(userDoc.roles, "vscout_member")
            }
            break
    }

    return Promise.resolve(userDoc);
})

superlogin.on('login', function(userDoc: UserDoc_T, provider : Provider_T){

    switch(provider)
    {
        case "discord":
            
            break;
        case "local":

            break;

    }
    console.log('User: ' + userDoc.user_id + ' logged in with ' + provider);
    console.log({userDoc});
});

console.log(app.get('port'))
http.createServer(app).listen(app.get('port'));

console.log("App Launched");
}
catch (err)
{
    console.trace(err)
}