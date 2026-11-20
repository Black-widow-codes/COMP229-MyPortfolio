import User from "../models/user.model.js";
import extend from "lodash/extend.js";
import errorHandler from "./error.controller.js";

const create = async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: 'user'
  });
    try {
        await user.save();
        return res.status(200).json({
            message: "Successfully signed up!",
        });
    } catch (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err),
        });
      }
    };

    const list = async (req, res) => {
        try {
          let users = await User.find().select("name email updated created");
          res.json(users);
        } catch (err) {
          return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
          });
        }
      };
const userByID = async (req, res, next, id) => {
    try {
      let user = await User.findById(id);
      if (!user)
        return res.status(400).json({
          error: "User not found",
        });
      req.profile = user;
      next();
    } catch (err) {
      return res.status(400).json({
        error: "Could not retrieve user",
      });
    }
  };
  
  const read = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
  };
  
  const update = async (req, res) => {
    try {
      let user = req.profile;
      const allowedUpdates = {
        name: req.body.name ?? user.name,
        email: req.body.email ?? user.email
      };
      
      user = extend(user, allowedUpdates);
      
      if (typeof req.body.password === 'string' && req.body.password.length > 0) {
        user.password = req.body.password;
      }
      user.updated = Date.now();
      await user.save();
      user.hashed_password = undefined;
      user.salt = undefined;
      res.json(user);
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
  };
  
  const remove = async (req, res) => {
    try {
      let user = req.profile;
      let deletedUser = await user.deleteOne();
      deletedUser.hashed_password = undefined;
      deletedUser.salt = undefined;
      res.json(deletedUser);
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
  };
  
  
  const removeAll = async (req, res) => {
    try {
      const result = await User.deleteMany({});
  
      return res.status(200).json({
        message: "All users deleted successfully",
        deletedCount: result.deletedCount
      });
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      });
    }
  };
  
  
export default { create, userByID, read, list, remove, update, removeAll };
