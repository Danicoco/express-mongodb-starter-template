interface IConfig {
  port: string | number;
  database: {
    MONGO_URI: string;
    MONGO_DB: string;
  };
  secret: string;
}

const NODE_ENV: string = process.env.NODE_ENV || 'development';

const development: IConfig = {
    port: process.env.PORT || 5000,
    database: {
        MONGO_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/',
        MONGO_DB: process.env.MONGODB_DB_MAIN || 'fantasy_predict'
    },
    secret: process.env.SECRET || '@QEGTUI'
};

const production: IConfig = {
    port: process.env.PORT || 3000,
    database: {
        MONGO_URI: process.env.MONGODB_URI || 'mongodb://production_uri/',
        MONGO_DB: process.env.MONGODB_DB_MAIN || 'fantasy_predict_production'
    },
    secret: process.env.SECRET || '@QEGTUI'
};

const staging: IConfig = {
    port: process.env.PORT || 3000,
    database: {
        MONGO_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017',
        MONGO_DB: 'fantasy_predict_staging'
    },
    secret: process.env.SECRET || '@QEGTUI'
};

const config: {
    [name: string]: IConfig
} = {
    staging,
    development,
    production
};

export default config[NODE_ENV];
