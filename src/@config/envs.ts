import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  POSTGRES_HOST: string;
  POSTGRES_PORT: number;
  POSTGRES_USER: string;
  POSTGRES_PASS: string;
  POSTGRES_DB: string;
  SECRET_KEY: string;
  MONGODB_URL_CONNECTION: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    POSTGRES_HOST: joi.string().required(),
    POSTGRES_PORT: joi.number().required(),
    POSTGRES_USER: joi.string().required(),
    POSTGRES_PASS: joi.string().required(),
    POSTGRES_DB: joi.string().required(),
    SECRET_KEY: joi.string().required(),
    MONGODB_URL_CONNECTION: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate({
  ...process.env,
});

if (error) throw new Error(`Config validation error: ${error.message}`);

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  postgres_host: envVars.POSTGRES_HOST,
  postgres_port: envVars.POSTGRES_PORT,
  postgres_user: envVars.POSTGRES_USER,
  postgres_pass: envVars.POSTGRES_PASS,
  postgres_db: envVars.POSTGRES_DB,
  secret_key: envVars.SECRET_KEY,
  mongodb_connection: envVars.MONGODB_URL_CONNECTION,
};
