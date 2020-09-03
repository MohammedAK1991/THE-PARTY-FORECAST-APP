const express = require('express');
const cors = require('cors');
const morgan = require('morgan')
const partyRouter = require('./router.js');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true })); //from cloudinary
app.use(cors());
app.use(morgan('tiny'));

app.use('/', partyRouter);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..','build')));
  app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, '..', 'build', 'index.html'))
  })
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});