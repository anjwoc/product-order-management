import * as Joi from 'joi';

const configValidation = Joi.object({
  NODE_ENV: Joi.string()
    .valid('develop', 'production', 'test', 'staging')
    .default('develop'),
  PORT: Joi.number().default(3000),
  SECRET_KEY: Joi.string().required(),
  COOKIE_SECRET: Joi.string().required(),
  ADMIN_USER: Joi.string().required(),
  ADMIN_PASSWORD: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_NAME: Joi.string().required(),
  POSTGRES_DB: Joi.string().required(),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_PASSWORD: Joi.string().optional(),
});

export { configValidation };
