
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { connectToDatabase } = require('./db');
const { router: petsRouter, setDatabase } =
  require('./routes/pets');

const app = express();

app.use(cors({
  origin: 'http://localhost:4200'
}));

const PORT = process.env.PORT || 3000;

let db;

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// temporary endpoint to test database
app.get('/api/test-pet', async (req, res) => {
  try {
    const pet = await db.collection('pets').findOne();

    if (!pet) {
      return res.status(404).json({
        message: 'No documents found in the pets collection.'
      });
    }

    res.json(pet);
  } catch (error) {
    console.error('Error querying pets:', error);
    res.status(500).json({ message: 'Database query failed.' });
  }
});

async function startServer() {
  try {
    db = await connectToDatabase();

    setDatabase(db);
    app.use('/api/pets', petsRouter);

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
}

startServer();
