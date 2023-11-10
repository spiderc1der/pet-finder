
async function handleRequest() {

  // check validity of link entered  
  var input = document.getElementById("petLink").value;
  if (input.includes("https://static.chickensmoothie.com/archive/image.php?k=")) {
    
    //document.getElementById("result").innerHTML = "Valid link!";

    // extract ID from link
    let temp1 = input.replace("https://static.chickensmoothie.com/archive/image.php?k=", "");
    let temp2 = temp1.replace("&bg", " ");
    let temp3 = temp2.split(" ");
    let petID = temp3[0];

    console.log(petID);

    let data = JSON.stringify({
      "dataSource": "CSpets",
      "database": "csPets",
      "collection": "pets",
      "filter": {
        "_id": petID
      }
    });

    search(data, input, petID);

  }
  else if (input == "") {
    document.getElementById("result").innerHTML = "Please input a pet image address!";
  }
  else {
    document.getElementById("result").innerHTML = "Sorry, this is an invalid image address. Please try again.";
  }

}

async function search(data, imgURL, pID) {
  try {

    // get authorization token 

    let c = {
      method: 'post',
      url: 'https://us-east-2.aws.realm.mongodb.com/api/client/v2.0/app/data-qmnzi/auth/providers/anon-user/login'
    };

    // query database using database

    axios(c).then(function (response) {

      let token = response.data.access_token; 

      // query database

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://us-east-2.aws.data.mongodb-api.com/app/data-qmnzi/endpoint/data/v1/action/findOne',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': token
        },
        data : data
      };

      // test output

      axios(config).then(function (response) {
        console.log(JSON.stringify(response.data));

        //document.getElementById("result").innerHTML = response.data.document.pet_name;


        // check for a null response 
        if (response.data.document == null) {

          // search database to see if it's a newborn ID 

          let data2 = JSON.stringify({
            "dataSource": "CSpets",
            "database": "csPets",
            "collection": "pets",
            "filter": {
              "newborn_id": pID
            }
          });

          let config2 = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://us-east-2.aws.data.mongodb-api.com/app/data-qmnzi/endpoint/data/v1/action/find',
            headers: { 
              'Content-Type': 'application/json', 
              'Authorization': token
            },
            data : data2
          };

          // search all pets with the given ID as their newborn ID 
          axios(config2).then(function (response2) {

            // if none are found, update with message
            if (response2.data.documents == null) {
              document.getElementById("result").innerHTML =
                "Sorry, the given pet either does not exist or has yet to be added to the database.";
            }

            else {
              let results = response2.data.documents;
              let IDS = [];
              let pet_names = [];

              // get values consistent across the litter from the first 
              // pet in the array 
              let month = results[0].month;
              let year = results[0].year;
              let litter = results[0].litter_name;
              let archive_l = results[0].archive_link; 

              results.forEach(element => {
                // add each pet's information to its respective array 
                IDS.push(element._id);
                pet_names.push(element.pet_name);
                
              });

              if (IDS.length == 1) {
                // only one outcome for the newborn

                let name = JSON.stringify(results[0].pet_name).replace(/^"(.*)"$/, '$1');
                let pps = JSON.stringify(results[0].PPS).replace(/^"(.*)"$/, '$1');
                pps = pps.toLowerCase().charAt(0).toUpperCase() + pps.slice(1).toLowerCase();
                let species = JSON.stringify(results[0].species).replace(/^"(.*)"$/, '$1');
                species = species.toLowerCase().charAt(0).toUpperCase() + species.slice(1).toLowerCase();
                let artist = JSON.stringify(results[0].artist_name).replace(/^"(.*)"$/, '$1');
                let artist_l = JSON.stringify(results[0].artist_link);

                document.getElementById("result").innerHTML =
                "<img src = " + imgURL + "> <br />" +
                "<a href = " + archive_l + ">" + "Archive link" + "</a> <br />" +
                "<b>Pet name: </b>" + name +
                "<br /> <b>Release date: </b>" + month + " " + year +
                "<br /> <b>Species: </b>" + species + "<br /> Litter name: " + litter +
                "<br /> <b>PPS: </b>" + pps + 
                "<br /> <b>Artist: </b> <a href = " + artist_l + "> " + artist + " </a>";
          

              }
              else {
                // must display all pets

                let addresses = [];

                IDS.forEach(element => {
                  // construct addresses and add to array 
                  addresses.push("https://static.chickensmoothie.com/archive/image.php?k=" + element + "&bg=99c57c");
                });
                
                // construct info blurb 
                let output = "<b>Potential outcomes:</b> <br />";
                addresses.forEach(element => { 
                  output += "<img src = " + element + ">";
                });
                output += "<br /> <a href = " + archive_l + ">" + "Archive link" +
                  "</a> <br /> <b>Litter name</b>: " + litter + "<br /> <b>Pet names:</b> ";
                for (let i = 0; i < pet_names.length; i++){
                  output += pet_names[i] + ", ";
                }
                // remove last comma
                output = output.substring(0, output.length - 2);
                output += "<br /> <b>Release date:</b> " + month + " " + year;

                document.getElementById("result").innerHTML = output;


              }

            
            }


          })
            .catch(function (error2) {
              console.log(error2);
          });
          
        

        }
        else {

          // format pet info

          var pet = JSON.stringify(response.data.document.pet_name).replace(/^"(.*)"$/, '$1');
          var month = JSON.stringify(response.data.document.month).replace(/^"(.*)"$/, '$1');
          var year = JSON.stringify(response.data.document.year).replace(/^"(.*)"$/, '$1');
          var pps = JSON.stringify(response.data.document.PPS).replace(/^"(.*)"$/, '$1');
          pps = pps.toLowerCase().charAt(0).toUpperCase() + pps.slice(1).toLowerCase();
          var species = JSON.stringify(response.data.document.species).replace(/^"(.*)"$/, '$1');
          species = species.toLowerCase().charAt(0).toUpperCase() + species.slice(1).toLowerCase();
          var artist = JSON.stringify(response.data.document.artist_name).replace(/^"(.*)"$/, '$1');
          var artist_l = JSON.stringify(response.data.document.artist_link);
          var litter = JSON.stringify(response.data.document.litter_name).replace(/^"(.*)"$/, '$1');
          var archive_l = JSON.stringify(response.data.document.archive_link); 
          
          // display pet info 

          document.getElementById("result").innerHTML =
            "<img src = " + imgURL + "> <br />" +
            "<a href = " + archive_l + ">" + "Archive link" + "</a> <br />" +
            "<b>Pet name: </b>" + pet +
            "<br /> <b>Release date: </b>" + month + " " + year +
            "<br /> <b>Species: </b>" + species + "<br /> Litter name: " + litter +
            "<br /> <b>PPS: </b>" + pps + 
            "<br /> <b>Artist: </b> <a href = " + artist_l + "> " + artist + " </a>";
          
        }


        
        
      })
        .catch(function (error) {
          console.log(error)
        });

    })
      .catch(function (error) {
        console.log(error);
      });

  }
  catch (error){
      console.log(error);
  }
}

