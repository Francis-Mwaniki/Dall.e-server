import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
const port = process.env.PORT || 3000;
import dalleRouter from './routes/dalle.routes.js';
import { Configuration, OpenAIApi } from 'openai';
const app = express();

dotenv.config();
app.use(cors());
app.use('/api/v1/dalle', dalleRouter);
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello from DALL.E!' });

});

const config= new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(config);

app.post('/', async (req, res) => {
    const prompt = 'logo';
    console.log(prompt);
    console.log(req.body);
    try {
      const response = await openai.createImage({
        prompt,
        n: 1,
        size: '1024x1024',
        response_format: 'b64_json'
      });
  
      const image = response.data.data[0].b64_json;
  
      res.status(200).json({ photo: image });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" })
    }
});




app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}
);