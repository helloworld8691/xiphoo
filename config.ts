//Comment this in to create an Development build
// process.env.NODE_ENV = 'development'

export const DEFAULT_URL = 'http://scan.xiphoo.com/link/1';


export const SPLASH_SCREEN_TIME = 800;

const isDevMode = false; // process.env.NODE_ENV === 'development';

export const isProd = !isDevMode;

export const API_BASE_URL = isProd ? "https://api.xiphoo.com/v1/" : "https://api.xiphoo.com/dev";


export const PAGE_START_CIPHER1 = 0x0C, PAGE_START_CIPHER2 = 0x1A;


export const COGNITO_CLIENT_ID = isProd ? "1jhonp3v7uqfpi7esjoli4b7m8" : "5r9jre6makgl4857125atm0ltt";
export const COGNITO_CLIENT_POOL = isProd ? "eu-central-1_lzLYy5tzD" : 'eu-central-1_oxwpd2f5g';

export const IDENTITY_POOL_ID =  isProd ? 'arn:aws:cognito-idp:eu-central-1:488794237287:userpool/eu-central-1_lzLYy5tzD':'arn:aws:cognito-idp:eu-central-1:488794237287:userpool/eu-central-1_oxwpd2f5g';