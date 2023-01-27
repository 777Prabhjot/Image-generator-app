const express = require('express');
const app = express();
const cors = require('cors');
const ejs = require('ejs');
const dotenv = require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");

app.use(express.json());
app.use(cors());
app.use(express.urlencoded());
app.set('view engine', 'ejs');


const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

let url = "";

app.get('/', (req, res) => {
    res.render("home.ejs", {url: url})
})

app.post('/generateImage', async (req, res) => {
    const { image } = req.body;
    try {
        const response = await openai.createImage({
            prompt: image,
            n: 1,
            size: "512x512",
          });
         const image_url = response.data.data[0].url;
          url = image_url;
         return res.status(200).json({url: image_url});
        
    } catch (error) {
        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
          } else {
            console.log(error.message);
          }
    }
})

app.listen(5000, () => {
    console.log('server is running');
    console.log(process.env.OPENAI_API_KEY)
})