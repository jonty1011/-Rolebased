interface dbConfig{
  username:string;
  password:string;
  database:string;
  host:string;
  port:number;
  dialect:'mysql';
}

interface Config{
  development:dbConfig;
  test:dbConfig;
  production:dbConfig;
}
const DBconfig:Config = {
  development: {
    username: process.env.DB_USER ||'root',
    password: process.env.DB_PASSWORD || 'Jonty1011',
    database: process.env.DB_NAME ||'user_management',
    host: process.env.DB_HOST || 'localhost',
    port: 3306,
    dialect: 'mysql',
  },
  test: {
    username: process.env.DB_user ||'',
    password: process.env.DB_PASSWORD||'',
    database: process.env.DB_NAME || 'user_management',
    host: process.env.DB_HOST || 'localhost',
    port: 3306,
    dialect: 'mysql',
   
  },
  production: {
    username: process.env.DB_user||'',
    password: process.env.DB_PASSWORD||'',
    database: process.env.DB_NAME ||'user_management',
    host: process.env.DB_HOST || 'localhost',
    port: 3306,
    dialect: 'mysql',
  },
};
export = DBconfig

  