const connectToMongo = require('./db.js');
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

app.use(cors());
connectToMongo();

// Increase payload size limit
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
//to parse request as json
app.use(express.json());
app.use('/api/auth', require('./routes/auth.routes.js'));
app.use('/api/note', require('./routes/note.routes.js'));
app.use('/api/comment', require('./routes/comment.routes.js'));

app.listen(5000, (req, res)=>{
    console.log("listening the server at http://localhost:5000");
})


