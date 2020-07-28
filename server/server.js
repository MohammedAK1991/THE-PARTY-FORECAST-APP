const express = require('express');
const cors = require('cors');
const eventsRouter = require('./router.js');


const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use('/events',eventsRouter);



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});