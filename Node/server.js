const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const http = require('http');
const { socketServerInit } = require('./socketServer/socketServer');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(cors());

app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/items', require('./routes/usersRoutes'));
// app.use('/api/items', require('./routes/contentRoutes'));
app.use('/api/items', require('./routes/chatRoutes'));
app.use('/api/items', require('./routes/publicationsRoutes'));
app.use('/api/items', require('./routes/punctuationsRoutes'));
app.use('/api/items', require('./routes/commentRoutes'));
app.use('/api/items', require('./routes/lyricsRoutes'));
app.use('/api/items', require('./routes/uploadRoutes'));
app.use('/api/items', require('./routes/historyRoutes'));


// Radio routes
app.use('/api/items', require('./routes/radioRoutes'));

// Home route
app.get('/', (req, res) => {
  res.send('API is running...');
});

socketServerInit(server);

const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));