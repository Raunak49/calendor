const { google } = require('googleapis');
const nodemailer = require('nodemailer');
const express = require('express');
const router = express.Router();
const app = express();
const User = require('./models/users');
const moment = require('moment-timezone');

const calendar = google.calendar({ version: 'v3' });

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    service: 'gmail',
    auth: {
        user: 'raunakkakkar899@gmail.com',
        pass: 'octiymfpkcwggbpd',
    },
});

router.post('/', async (req, res) => {
    try {
        const { summary, startDateTime, endDateTime, description, location, email } = req.body;

        const user = await User.findOne({ email });

        if (!user) { 
            res.send('User not found');
        }

        const event = {
            summary,
            start: {
                dateTime: startDateTime,
            },
            end: {
                dateTime: endDateTime, 
            },
            description,
            location,
            reminders: {
                useDefault: true,
            },
            conferenceData: {
                createRequest: {
                    requestId: "sample123",
                    conferenceSolutionKey: { type: "hangoutsMeet" },
                },
            },
        };

        const { data } = await calendar.events.insert({
            access_token: user.accessToken,
            refresh_token: user.refreshToken,
            calendarId: 'primary',
            resource: event,
            conferenceDataVersion: 1,
        });

        const mailOptions = {
            from: 'raunakkakkar899@gmail.com',
            to: email,
            subject: 'New event created',
            html: `
      <p>A new event has been created in your Google Calendar:</p>
      <ul>
        <li>Summary: ${summary}</li>
        <li>Location: ${location}</li>
        <li>Start time: ${moment(startDateTime).format('MMMM D, YYYY, h:mm a z')}</li>
        <li>End time: ${moment(endDateTime).format('MMMM D, YYYY, h:mm a z')}</li>
        <li>Google Meet link: <a href="${data.hangoutLink}">meet link</a></li>
      </ul>
    `,
        };
        transporter.sendMail(mailOptions);
        res.send(`Event created, meeting link is ${data.hangoutLink}}`);
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ message: 'Error creating event' });
    }
});

module.exports = router;
