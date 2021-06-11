import dotenv from 'dotenv';

dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

function mandatory (envName: string): string {
    const value = process.env[envName];
    if (typeof value !== 'string') throw new Error(`ENV ${envName} is mandatory`);
    return value;
}

const Config = {
    server: {
        host: process.env.SERVER_HOST || '0.0.0.0',
        port: Number.parseInt(process.env.PORT || '6000')
    },
    jwt: {
        secret: mandatory('SECRET')
    },
    api: {
        baseUri: process.env.API_BASE_URI || '/'
    },
    db: {
        url: mandatory('DB_URL'),
        options: mandatory('DB_OPTIONS')
    }
};

export default Config;
