import { Joi } from "express-validation";

export const userRegisterCredentialsSchema = {
  body: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    img: Joi.string().allow(null, ""),
  }),
};

export const userLoginCredentialsSchema = {
  body: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
};
