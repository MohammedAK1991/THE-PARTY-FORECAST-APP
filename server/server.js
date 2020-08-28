const express = require('express');
const cors = require('cors');
const partyRouter = require('./router.js');

const app = express();
const port = 3001;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true })); //from cloudinary
app.use(cors());

app.use('/', partyRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});