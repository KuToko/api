const { users } = require('../../models');
const uuid= require('uuid');
const validator = require('fastest-validator');
const bcrypt = require('bcrypt');


const userRegister = async (req, res) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const data = {
              id: uuid.v4(),
              username: req.body.username,
              name: req.body.name,
              email: req.body.email,
              password: hashedPassword,
              is_super_admin: req.body.is_super_admin || false,
              created_at: new Date(),
              updated_at: new Date(),
          };

          const schema = {
              username: {type: "string", max: 250, optional: false},
              email: {type: "email", optional: false},
              password: {type: "string", min: 8, max: 255, optional: false},
              name: {type: "string", max: 255, optional: false},
          }

          const v = new validator();
          const validate = v.validate(data, schema);
          if (validate.length) {
              return res.status(400).json({
                  message: "error",
                  data: validate
              });
          }

          try {
              const uniqueEmail = await users.findOne({where: {email: data.email}});
              if (uniqueEmail) {
                  return res.status(400).json({
                      message: "error",
                      data: "email already exist"
                  });
              }
              await users.create(data);
              res.status(201).json({
                  message: "success",
                  data: data
              });
          } catch (err) {
              res.status(500).json({
                  message: "error",
                  data: "internal server error"
              });
          }
};
module.exports = {
    userRegister
}
