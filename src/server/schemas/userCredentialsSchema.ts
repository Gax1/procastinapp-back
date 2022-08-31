import { Joi } from "express-validation";

const userRegisterCredentialsSchema = {
  body: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    img: Joi.string().required(),
  }),
};

export default userRegisterCredentialsSchema;
