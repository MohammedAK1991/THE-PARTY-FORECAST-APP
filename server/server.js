const express = require('express');
const cors = require('cors');
const partyRouter = require('./router.js');


const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use('/',partyRouter);



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});