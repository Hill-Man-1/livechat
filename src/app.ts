import express from 'express';
import router from './router/mainRouter';
import 'dotenv/config'
import insertAdmin from './config/superAdmin';
import appMiddleware from './middleware';

const port = process.env.PORT;
const app = express()

app.use(express.json())

appMiddleware(app)
app.use(router)

// super admin account:
app.post('/setupadmin', async (req, res) => {
  await insertAdmin(req);
  res.status(200).send('Admin setup complete');
});

app.listen(port, () => {
    console.log(`Server is running on port:${port}`)
  })