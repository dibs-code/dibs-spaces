import * as process from 'process';

export const IS_PRODUCTION = (process.env.REACT_APP_VERCEL_ENV || process.env.NODE_ENV) === 'production';
export const IS_DEV = (process.env.REACT_APP_VERCEL_ENV || process.env.NODE_ENV) === 'development';
export const IS_DEV_OR_CYPRESS = IS_DEV || process.env.REACT_APP_IS_CYPRESS === 'true';
