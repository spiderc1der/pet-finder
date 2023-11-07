let EXAMPLE_URL = "\"" + "https://static.chickensmoothie.com/archive/image.php?k=C5057EC610648C14A89E48D89EC4656A&bg=ffffff" + "\"";


let data = JSON.stringify({
    "dataSource": "CSpets",
    "database": "csPets",
    "collection": "pets",
    "filter": {
      "_id": "C5057EC610648C14A89E48D89EC4656A"
    }
  });
  
  

async function handleRequest() {

  // check validity of link entered  
  var input = document.getElementById("petLink").value;
  if (input.includes("https://static.chickensmoothie.com/archive/image.php?k=")) {
    document.getElementById("result").innerHTML = "Valid link!";

  

  }
  else if (input == "") {
    document.getElementById("result").innerHTML = "Please input a pet image address!";
  }
  else {
    document.getElementById("result").innerHTML = "Sorry, this is an invalid image address. Please try again.";
  }


}



async function search() {
  try {

    // get authorization token 

    let c = {
      method: 'post',
      url: 'https://us-east-2.aws.realm.mongodb.com/api/client/v2.0/app/data-qmnzi/auth/providers/anon-user/login'
    };

    // query database using database

    axios(c).then(function (response) {

      let token = response.data.access_token; 

      let c2 = {
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

      axios(c2).then(function (response) {
        console.log(JSON.stringify(response.data));

        console.log("dfsfsdfdsfds");

        let name = JSON.stringify(response.data.document.pet_name);
        console.log(name);

        document.getElementById("result").innerHTML = response.data.document.pet_name;

        var pet = JSON.stringify(response.data.document.pet_name).replace(/^"(.*)"$/, '$1');
        var month = JSON.stringify(response.data.document.month).replace(/^"(.*)"$/, '$1');
        var year = JSON.stringify(response.data.document.year).replace(/^"(.*)"$/, '$1');
        var species = JSON.stringify(response.data.document.species).replace(/^"(.*)"$/, '$1');
        var artist = JSON.stringify(response.data.document.artist_name).replace(/^"(.*)"$/, '$1');
        var artist_l = JSON.stringify(response.data.document.artist_link);
        var litter = JSON.stringify(response.data.document.litter_name).replace(/^"(.*)"$/, '$1');
        var archive_l = JSON.stringify(response.data.document.archive_link); 
        

        document.getElementById("result").innerHTML = "<img src = " + EXAMPLE_URL + "> <br />" +
          "<a href = " + archive_l + ">" + "Archive link" + "</a> <br />" + "Release date: " + month + " " + year + "<br />Pet name: " + pet +
          "<br /> Litter name: " + litter + "<br /> Species: " + species +
          "<br /> Artist: <a href = " + artist_l + "> " + artist + " </a>";


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

