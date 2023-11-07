
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://spdercider:fiAAe8DWSReWbgtp@cspets.phatbmu.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);


// Create a MongoClient with a MongoClientOptions object to set the Stable API version


/*const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});*/

/*function reset() {
  document.getElementById("result").innerHTML = "dfdsffsd";
}

function search() {
  const address = document.getElementById("petLink").value;
  const pet = run(address);

  console.log(pet);

  if (pet) {
    document.getElementById("result").innerHTML = "fsfdfsd";
  }
  else {
    document.getElementById("result").innerHTML = "dfdsffsd";
  }

}*/
  
  
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      

    // Send a ping to confirm a successful connection
    //await client.db("admin").command({ ping: 1 });
    //console.log("Pinged your deployment. You successfully connected to MongoDB!");
    //await findListingByName(client, "Dogtag Moondog");
    //await findListingByName(client, "fake pet name");

    
    const submittedURL = document.getElementById("petLink").value;
    

    // split the provided URL and get the ID 
    const tempArray1 = submittedURL.split("https://static.chickensmoothie.com/pic.php?k=");
    const tempText = tempArray1[1];
    const tempArray2 = tempText.split("&bg=");

    const submittedID = tempArray2[0];

    const pet = findPetByID(client, submittedID.parseInt());
    if (pet) {
      document.getElementById("result").innerHTML = "fsfdfsd";
      }
      //return pet;
      
  }
  catch (e) {
    console.error(e);
  }
  finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


/// this function searches the database for a pet matching the provided ID from  
/// the pet image address
async function findPetByID(client, petID) {
    // first check to see if provided ID matches any "adult" pet ID in the database
    const result = await client.db("csPets").collection("pets").findOne({ _id: petID });

    if (result) {
        // if yes, return pet found
        
        //console.log(`Found pet in collection with the name ` + nameOfListing);
    
        return result;
    }
    else {
        // if no, check if ID matches any "newborn" pet ID in database
        
        const isNewbornPet = await client.db("csPets").collection("pets").findOne({ newborn_id: petID });

        if (isNewbornPet) {
            // return pet found

            return isNewbornPet;
        }
        else {
            // check if ID matches any "baby" pet ID in database

            const isBabyPet = await client.db("csPets").collection("pets").findOne({ baby_id: petID });

            if (isBabyPet) {
                // return pet found

                return isBabyPet;
            }
            else {
                // the given ID is either invalid or has not yet been added to the database

                return null;
            }
        }

    }
}