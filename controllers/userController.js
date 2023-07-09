const UserModel = require("../models/users");
const Token = require("../models/token");
const uuid = require("uuid");
const SHA256 = require("crypto-js/sha256");
const jwt = require("jsonwebtoken");

const crypto = require("crypto");
// const bcrypt = require("bcrypt");
const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = process.env.BCRYPT_SALT;
const clientURL = process.env.CLIENT_URL;

const controller = {
  checkemail: (req, res) => {
    const email = req.body.email.toLowerCase();
    UserModel.findOne({ email: email }).then((result) => {
      console.log(result);
      if (result) {
        res.send({ msg: "Email already exists" });
        return;
      } else {
        res.sendStatus(200);
        return;
      }
    });
  },
  signup: (req, res) => {
    const email = req.body.email.toLowerCase();
    UserModel.findOne({ email: email })
      .then((result) => {
        if (result) {
          res.send({ msg: "Email already exists" });
          return;
        } else if (result === null) {
          if (!Object.values(req.body).includes(null || "")) {
            const { latLng, ...rest } = req.body;
            const salt = uuid.v4();
            const combination = salt + req.body.password;
            const hash = SHA256(combination).toString();
            const dataToDB = {
              ...rest,
              salt: salt,
              hash: hash,
            };
            UserModel.create(dataToDB)
              .then((result) => {
                res.send({
                  success: true,
                  message: "Account Created",
                });
                console.log("Account created");
                return;
              })
              .catch((err) => {
                res.send({
                  success: false,
                  message: "Form error. User not created",
                });
                console.log("err", err);
                return;
              });
          }
        }
      })
      .catch((err) => console.log("Err", err));
  },
  googlesignin:async(req,res)=>{
    const email=req.body.email.toLowerCase();
    const user=await UserModel.findOne({email})
    if(!user){
      const dataToDB = {
        name:req.body.name,
        email,
        googleSignIn:true,
        salt:'',
        hash:''

      };
     await UserModel.create(dataToDB)
    }
     const token = jwt.sign(
      {
        name: req.body.name,
        email,
      },
      jwtSecret,
      {
        algorithm: "HS384",
      }
    );

    const decodedJWT = jwt.decode(token);
    res.send({
      success: true,
      token: token,
      expiresAt: decodedJWT.exp,
    });
  },
  signin: (req, res) => {
    const email = req.body.email.toLowerCase();
    UserModel.findOne({ email: email })
      .then((result) => {
        if (!result) {
          res.send({
            success: false,
            msg: "Password and Email combination does not match",
          });
          return;
          /* What happened to res.status(400).send({msg:"failed"}) */
        }
        const hash = SHA256(result.salt + req.body.password).toString();
        if (hash != result.hash) {
          res.send({
            success: false,
            msg: "Password and Email combination does not match",
          });
          return;
        }
        const token = jwt.sign(
          {
            name: result.name,
            email: result.email,
          },
          jwtSecret,
          {
            algorithm: "HS384",
            expiresIn: "1h",
          }
        );

        const decodedJWT = jwt.decode(token);
        res.send({
          success: true,
          token: token,
          expiresAt: decodedJWT.exp,
        });
        console.log(result);
      })
      .catch((err) => {
        console.log("login catch err", err);
        res.send({
          success: false,
          message: "Unable to login due to unexpected error",
        });
      });
  },
  userprofile: async (req, res) => {
    if (req.body && req.body.token) {
      const decodedJWT = jwt.decode(req.body.token);
      await UserModel.findOne({ email: decodedJWT.email })
        .then((result) => {
          res.send({
            name: result.name,
            email: result.email,
            address: result.address,
            fulladdress: result.fulladdress,
            emailnotification: result.emailNotification,
          });
          console.log(result);
        })
        .catch((err) => {
          console.log("err", err);
          res.sendStatus(400);
        });
    }
  },
  updateprofile: async (req, res) => {
    console.log(req.body);
    if (req.body && req.body.token) {
      const decodedJWT = jwt.decode(req.body.token);
      await UserModel.findOne({ email: decodedJWT.email })
        .then((result) => {
          UserModel.updateOne(
            { email: decodedJWT.email },
            req.body.profileinfo
          ).then(() => {
            const token = jwt.sign(
              {
                name: req.body.profileinfo.name,
                email: req.body.profileinfo.email,
              },
              jwtSecret,
              {
                algorithm: "HS384",
                expiresIn: "1h",
              }
            );
            res.send({ msg: "success", token: token });
          });
        })
        .catch((err) => {
          console.log("err", err);
          res.sendStatus(400);
        });
    }
  },

  getmyerplocations:async(req,res)=>{
    try{
     const result= await UserModel.findOne({_id:"64aa68d9a8ea139fb1b82141"})
     let locations=result.locations;
     const sortedLocations = locations.sort((a, b) => new Date(b.time) - new Date(a.time));
     res.json({locations:sortedLocations})
    }
    catch(e){
     res.json({error:true})
    }
  }

};

module.exports = controller;
