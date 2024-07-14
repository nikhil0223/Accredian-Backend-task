const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const nodemailer = require('nodemailer');


require('dotenv').config();

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/',(req,res)=>{
    res.json("HI");
})

app.post('/referrals', async (req, res) => {
    const { name, email, phone } = req.body;
    console.log(req.body);
    const referralid = uuidv4();

    try {
        const existingReferral = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { phone },
                ],
            },
        });
        if (existingReferral) {
            return res.json({ referralId: existingReferral.referralid,message:"User Already Exist" });
        }
        const newReferral = await prisma.user.create({
            data: {
                name,
                email,
                phone,
                referralid,
            },
        });
        console.log(newReferral);
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        const mailOptions = {
            from: `Accredian <donotreply@accredian.com>`,
            to: email,
            subject: 'Referral Created',
            text: `<html>
          <body>
            <p>Dear ${name},</p>
            <p>Your referral ID has been successfully created.</p>
            <h1>Id:-${referralid} </h6>
          </body>
        </html>`,
            headers: {
                'Content-Type': 'text/html',
            },
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                return res.status(500).send(error);
            }
            res.status(200).send({ message: 'Email sent: ' + info.response });
        });
        res.json({ referralId: newReferral.referralid });
    } catch (error) {
        console.error('Error creating referral:', error);
        res.status(500).json({ error: 'Failed to create referral.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
