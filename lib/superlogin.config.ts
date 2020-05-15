
import {config_database, config_discord} from './envars'


const config = {
    dbServer : {
        protocol: 'http://',
        host: `${config_database.IP}:${config_database.port}`,
        user: `${config_database.username}`,
        password: `${config_database.password}`,
        userDB: `${config_database.sl_user_db}`,
        couchAuthDB: `${config_database.auth_db}`
    },
    providers : {
        discord : {  
            credentials: {
                clientID : `${config_discord.client_id}`,
                clientSecret: `${config_discord.client_secret}`
            },
            options: {
                scope : ['email', 'identify', 'guilds'],
            }
        }
    },
    userDBs: {
        defaultDBs: {
            public: [`${config_database.db}`],
        }
    }
}
export default config;