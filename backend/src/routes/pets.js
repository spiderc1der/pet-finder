const express = require('express');
const router = express.Router();

let db;

function setDatabase(database) {
  db = database;
}

router.get('/lookup', async (req, res) => {
  const { link } = req.query;

  if (typeof link !== 'string') {
    return res.status(400).json({
      message: 'Please provide a pet image URL.'
    });
  }

  let url;

  // check for valid link
  try {
    url = new URL(link);
  } catch {
    return res.status(400).json({
      message: 'Please provide a valid URL.'
    });
  }

  const validHost =
    url.hostname === 'static.chickensmoothie.com';

  const validPath =
    url.pathname === '/archive/image.php' ||
    url.pathname === '/pic.php';

  const petID = url.searchParams.get('k');

  // check that link is Chicken Smoothie 
  if (
    url.protocol !== 'https:' ||
    !validHost ||
    !validPath ||
    !petID
  ) {
    return res.status(400).json({
      message: 'Please provide a valid pet image URL.'
    });
  }

  try {
    const collection = db.collection('pets');

    // first look for exact match of pet ID 
    const pet = await collection.findOne({
    _id: petID
    });

    if (pet) {
    return res.json({
        type: 'pet',
        data: pet
    });
    }

    // next look for pets with matching newborn ID 
    const newbornPets = await collection.find({
    newborn_id: petID
    }).toArray();

    if (newbornPets.length > 0) {
    return res.json({
        type: 'outcomes',
        data: newbornPets
    });
    }

    // finally look for pets with matching baby ID
    const babyPets = await collection.find({
    baby_id: petID
    }).toArray();

    if (babyPets.length > 0) {
    return res.json({
        type: 'outcomes',
        data: babyPets
    });
    }

    // if no matches found
    return res.status(404).json({
    message: 'Sorry, the given pet either does not exist or has yet to be added to the database.'
    });
  } catch (error) {
    console.error('Error looking up pet:', error);

    res.status(500).json({
      message: 'Database lookup failed.'
    });
  }
});

module.exports = { router, setDatabase };