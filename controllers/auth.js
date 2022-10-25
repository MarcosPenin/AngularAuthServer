const { response } = require('express');
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { db } = require('../models/User');
const { generateJWT } = require("../helpers/jwt")


const createUser = async (req, res = response) => {
    const { email, name, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                ok: true,
                msg: "There is an user with that email"
            })
        }

        user = new User(req.body);

        //password hash
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        //generate JWT

        const token = await generateJWT(user.id, name)

        await user.save();

        return res.status(201).json({
            ok: true,
            uid: user.id,
            name,
            email,
            token
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: true,
            msg: "Create user"
        })
    }
}

const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {
        
        const dbUser = await User.findOne({ email });

        if(  !dbUser ) {
            return res.status(400).json({
                ok: false,
                msg: "Email doesnt exists"
            });
        }

        const validPassword = bcrypt.compareSync( password, dbUser.password );

        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Invalid password'
            });
        }

        const token = await generateJWT( dbUser.id, dbUser.name );

        return res.json({
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            email:dbUser.email,
            token
        });



    } catch (error) {
        console.log(error);

        return res.status(500).json({
            ok: false,
            msg: 'Login error. Contact with admin'
        });
    }

}

const renew = async(req, res = response ) => {

    const { uid } = req;

    const dbUser=await User.findById(uid)

    const token = await generateJWT( uid, dbUser.name );

    return res.json({
        ok: true,
        uid, 
        name:dbUser.name,
        email:dbUser.email,
        token
    });

}




module.exports = {
    createUser, login, renew
}