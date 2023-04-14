const express = require('express');
const app = express();
const router = express.Router();
const { google } = require('googleapis');
const User = require('./models/users');
require('dotenv').config();

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
    "998691270905-fctdoikdtrqp8mgcrruahopiljdfs64i.apps.googleusercontent.com",
    "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",
    process.env.REDIRECT_URI

);

const scopes = ['https://www.googleapis.com/auth/calendar', 'profile', 'email'];


router.get('/', async (req, res) => {
    try {
        const uri = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            prompt: 'consent',
            scope: scopes,
        });

        res.redirect(uri);
    } catch (err) {
        res.status(400).json({ message: 'Something went wrong. Try again' });
    }
});

router.get('/google/callback', async (req, res) => {
    try {
        const { tokens } = await oauth2Client.getToken(req.query.code);
        oauth2Client.setCredentials(tokens);
        const people = google.people({ version: 'v1', auth: oauth2Client });
        const { data } = await people.people.get({ resourceName: 'people/me', personFields: 'names,emailAddresses' });
        const profile = data.names[0].displayName;
        const email = data.emailAddresses[0].value;
        const user = await User.find({ email: email });
        console.log(user);
        console.log(tokens.refresh_token, " ", typeof tokens.refresh_token);
        if (user.length === 0) {
            User.create({ email: email, name: profile, accessToken: tokens.access_token, refreshToken: tokens.refresh_token });
        }
        else {
            User.findByIdAndUpdate(user._id, { accessToken: tokens.access_token, refreshToken: tokens.refresh_token });
        }
        res.send('You have successfully logged in. Your name is ' + profile + ' and your email is ' + email + '.');
    } catch (err) {
        res.status(400).json({ message: 'Something went wrong. Try again' });
    }
});

module.exports = router;