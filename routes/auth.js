const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/user');
const verifyUser = require('./verifyUser');
const Privatemessage = require('../models/privatemessage');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
    cloud_name: 'nishant007-tech-cloud',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_KEY_SECRET
})

let storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'attachments',
        resource_type: 'auto',
        public_id: (req, file) => file.filename,
    }
})

let upload = multer({ storage: storage });

router.get('/authuser', verifyUser, async (req, res) => {
    try {
        let user = await userModel.findOne({ _id: req.user });
        res.status(200).json({
            user: user
        });
    } catch (err) {
        res.status(400).json(err);
    }

})
router.post('/register', async (req, res) => {
    //First check Whether email is already exist or not
    const emailExist = await userModel.findOne({ email: req.body.email });
    if (emailExist) {
        return res.status(400).json({ message: "Usersname/Email Already Exist" });
    }
    //bcrypt the password basically into hash format for security reasons
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const user = new userModel({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });
    try {
        const savedUser = await user.save();
        res.json(savedUser);
    } catch (err) {
        res.status(400).json(err);
    }
});

router.post('/login', async (req, res) => {

    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
        return res.status(404).json({ message: "Email or Password is Wrong!!" })
    }
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) {
        return res.status(404).json({ message: "Invalid Password or Email!!" })
    }
    const token = jwt.sign({ id: user._id }, "NishantRana");

    res.cookie("jwt", token, {
        expires: new Date(Date.now() + 47336400000), httpOnly: true, secure: true
    })
    // httpOnly flag to prevent attackers from accessing the cookie from the client-side.
    //2000000 => 33 minutes 86400000 => 1day 47336400000=> 18months
    res.json({ token: token, user: user, message: " Login Successfully!" });
});

router.get('/logout', verifyUser, async (req, res) => {
    try {
        res.clearCookie('jwt');
        res.status(200).send('Logout Successfully');
    } catch (error) {
        res.status(500).send(error);
    }
})

router.get('/getallusers', verifyUser, async (req, res) => {
    try {
        let users = await userModel.find({});
        res.status(200).json({
            users: users
        })
    } catch (error) {
        res.status(500).send(error);
    }
})
router.get('/getallmessages', verifyUser, async (req, res) => {
    try {
        let messages = await Privatemessage.find({});
        res.status(200).json({
            messages: messages
        })
    } catch (error) {
        res.status(500).send(error);
    }
})

router.get('/userinfo/:id', async (req, res) => {
    const id = req.params.id;
    if (id) {
        const foundUser = await userModel.findById(id);
        if (foundUser) {
            res.send(foundUser);
        }
    }
});

router.get('/privateconvo', async (req, res) => {
    const foundMessages = await Privatemessage.find({
        $and: [
            { participants: { $in: [req.query.friendid] } },
            { participants: { $in: [req.query.userid] } }
        ]
    })
        .sort({ createdAt: -1 })
        .limit(20);

    res.send(foundMessages.reverse());
});

router.post('/messages', upload.single('content'), async (req, res) => {
    try {
        if (req.file) {
            var newMessage = new Privatemessage({
                author: req.body.author,
                authorId: req.body.authorId,
                content: req.file.path,
                receiver: req.body.receiver,
                receiverName: req.body.receiverName,
                participants: req.body.participants.split(","),
                type: req.file.mimetype
            });
        } else {
            var newMessage = new Privatemessage(req.body);
        }
        try {
            const savedMessage = await newMessage.save();
            res.status(200).json(savedMessage);
        } catch (err) {
            res.status(500).json(err);
        }
    }
    catch (err) {
        console.log(err.response.body)
    }

});


module.exports = router;