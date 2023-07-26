import * as process from 'process';

export const IS_PRODUCTION = (process.env.REACT_APP_VERCEL_ENV || process.env.NODE_ENV) === 'production';
