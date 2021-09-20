import * as dotenv from 'dotenv';

dotenv.config();


// Define log levels type (silent + Winston default npm)
type LogLevel = 'silent' | 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly'

export interface Config {
  localCacheTtl: number,
  loggerLevel: LogLevel 
}

const config: Config = {
  localCacheTtl: parseInt(process.env.LOCAL_CACHE_TTL as string),
  loggerLevel: process.env.LOGGER_LEVEL as LogLevel
}

export default config
