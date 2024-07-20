async function handleRequest() {
  // check validity of link entered
  var input = document.getElementById("petLink").value;
  if (input.includes("https://static.chickensmoothie.com/")) {
    // extract ID from link

    let temp1 = "";
    let temp2 = "";
    let temp3 = "";
    let petID = "";

    if (input.includes("archive")) {
      temp1 = input.replace(
        "https://static.chickensmoothie.com/archive/image.php?k=",
        ""
      );
      temp2 = temp1.replace("&bg", " ");
      temp3 = temp2.split(" ");
      petID = temp3[0];
    } else if (input.includes("pic.php")) {
      temp1 = input.replace(
        "https://static.chickensmoothie.com/pic.php?k=",
        ""
      );
      temp2 = temp1.replace("&bg", " ");
      temp3 = temp2.split(" ");
      petID = temp3[0];
    } else {
      document.getElementById("result").innerHTML =
        "Sorry, this is an invalid image address. Please try again.";
    }

    let data = JSON.stringify({
      dataSource: "CSpets",
      database: "csPets",
      collection: "pets",
      filter: {
        _id: petID,
      },
    });

    search(data, input, petID);
  } else if (input == "") {
    document.getElementById("result").innerHTML =
      "Please input a pet image address!";
  } else {
    document.getElementById("result").innerHTML =
      "Sorry, this is an invalid image address. Please try again.";
  }
}

async function display_result(
  imgURL,
  archive_l,
  name,
  month,
  year,
  species,
  litter,
  pps,
  artist_l,
  artist,
  notes
) {
  temp = imgURL.split("&bg=");

  imgURL = temp[0] + "&bg=fff5e0";

  document.getElementById("result").innerHTML =
    "<img src = " +
    imgURL +
    "> <br />" +
    "<a href = " +
    archive_l +
    ">" +
    "Archive link" +
    "</a> <br />" +
    "<b>Pet name: </b>" +
    name +
    "<br /> <b>Release date: </b>" +
    month +
    " " +
    year +
    "<br /> <b>Species: </b>" +
    species +
    "<br /> <b>Litter name: </b>" +
    litter +
    "<br /> <b>PPS: </b>" +
    pps +
    "<br /> <b>Artist: </b> <a href = " +
    artist_l +
    "> " +
    artist +
    " </a>" +
    "<br /> <b>Notes: </b>" +
    notes;
}

function checkNestedArray(array, item) {
  var stringified_item = JSON.stringify(item);

  var contains = array.some(function (ele) {
    return JSON.stringify(ele) === stringified_item;
  });
  return contains;
}

async function outcomes(response) {
  let results = response.data.documents;

  let IDS = [];
  let pet_names = [];
  let release_dates = [];
  let links = [];
  let litter_names = [];

  // get values consistent across the litter from the first
  // pet in the array
  let month = results[0].month;
  let year = results[0].year;
  let litter = results[0].litter_name;
  let archive_l = results[0].archive_link;

  results.forEach((element) => {
    // add each pet's information to its respective array
    IDS.push(element._id);
    pet_names.push(element.pet_name);
    release_dates.push([element.month, element.year]);
    links.push(element.archive_link);
    litter_names.push(element.litter_name);
  });

  if (IDS.length == 1) {
    // only one outcome for the newborn/baby pet

    let name = JSON.stringify(results[0].pet_name)
      .replace(/^"(.*)"$/, "$1")
      .replace(/\\/g, "");
    let pps = JSON.stringify(results[0].PPS).replace(/^"(.*)"$/, "$1");
    pps =
      pps.toLowerCase().charAt(0).toUpperCase() + pps.slice(1).toLowerCase();
    let species = JSON.stringify(results[0].species).replace(/^"(.*)"$/, "$1");
    species =
      species.toLowerCase().charAt(0).toUpperCase() +
      species.slice(1).toLowerCase();
    let artist = JSON.stringify(results[0].artist_name).replace(
      /^"(.*)"$/,
      "$1"
    );
    let artist_l = JSON.stringify(results[0].artist_link);
    let notes = JSON.stringify(results[0].notes)
      .replace(/^"(.*)"$/, "$1")
      .replace(/\\/g, "");

    let imgURL =
      "https://static.chickensmoothie.com/archive/image.php?k=" +
      IDS[0] +
      "&bg=fff5e0";

    // display

    display_result(
      imgURL,
      archive_l,
      name,
      month,
      year,
      species,
      litter,
      pps,
      artist_l,
      artist,
      notes
    );
  } else {
    // must display all outcomes

    let addresses = [];

    IDS.forEach((element) => {
      // construct addresses and add to array
      addresses.push(
        "https://static.chickensmoothie.com/archive/image.php?k=" +
          element +
          "&bg=fff5e0"
      );
    });

    // construct info blurb
    let output = "<b>Possible outcomes:</b> <br /><br />";

    let added_dates = [];
    let added_links = [];
    let added_litters = [];

    addresses.forEach((element) => {
      output += "<img src = " + element + ">";
    });

    for (let i = 0; i < addresses.length; i++) {
      current_date = [release_dates[i][0], release_dates[i][1]];
      current_link = links[i];
      current_litter = litter_names[i];

      if (!checkNestedArray(added_dates, current_date)) {
        added_dates.push([release_dates[i][0], release_dates[i][1]]);
      }
      if (!checkNestedArray(added_links, current_link)) {
        added_links.push(current_link);
      }
      if (!checkNestedArray(added_litters, current_litter)) {
        added_litters.push(current_litter);
      }
    }

    output += "<br />";

    if (added_links.length > 1) {
      for (let i = 0; i < added_links.length; i++) {
        output +=
          "<a href = " +
          added_links[i] +
          ">" +
          "Archive link " +
          (i + 1) +
          "</a>  ";
      }
    } else {
      output +=
        "<a href = " + added_links[0] + ">" + "Archive link " + "</a>  ";
    }

    output += "<br /> <b>Litter name(s)</b>: ";

    for (let i = 0; i < added_litters.length; i++) {
      output += added_litters[i] + ", ";
    }

    output = output.substring(0, output.length - 2);

    output += "<br /> <b>Pet names:</b> ";
    for (let i = 0; i < pet_names.length; i++) {
      output += pet_names[i] + ", ";
    }
    // remove last comma
    output = output.substring(0, output.length - 2);
    output += "<br /> <b>Release date(s):</b> ";

    // adds the dates of all pets w/ no repeats
    added_dates.forEach((element) => {
      output += element[0] + " " + element[1] + ", ";
    });

    output = output.substring(0, output.length - 2);

    document.getElementById("result").innerHTML = output;
  }
}

async function search(data, imgURL, pID) {
  try {
    // before querying, check if the given pet ID is reused often for many
    // different pets (ex. the default green butterfly wolf chrysalis img)

    if (pID === "3B46301A6C8B850D87A730DA365B0960") {
      temp = imgURL.split("&bg=");
      imgURL = temp[0] + "&bg=fff5e0";

      output =
        "<img src =" +
        imgURL +
        "> <br /><br /> This chrysalis is the default 'baby' stage for most butterfly wolves-";
      output +=
        " there are too many <br /> potential outcomes  to display, please come back once the pet is fully grown!";

      document.getElementById("result").innerHTML = output;

      console.log(pID);

      return;
    }

    // get authorization token

    let c = {
      method: "post",
      url: "https://us-east-2.aws.realm.mongodb.com/api/client/v2.0/app/data-qmnzi/auth/providers/anon-user/login",
    };

    // query database

    axios(c)
      .then(function (response) {
        let token = response.data.access_token;

        // query database

        let config = {
          method: "post",
          maxBodyLength: Infinity,
          url: "https://us-east-2.aws.data.mongodb-api.com/app/data-qmnzi/endpoint/data/v1/action/findOne",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          data: data,
        };

        axios(config)
          .then(function (response) {
            // check for a null response
            if (response.data.document == null) {
              // search database to see if it's a newborn ID

              let data2 = JSON.stringify({
                dataSource: "CSpets",
                database: "csPets",
                collection: "pets",
                filter: {
                  newborn_id: pID,
                },
              });

              let config2 = {
                method: "post",
                maxBodyLength: Infinity,
                url: "https://us-east-2.aws.data.mongodb-api.com/app/data-qmnzi/endpoint/data/v1/action/find",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: token,
                },
                data: data2,
              };

              // search all pets with the given ID as their newborn ID
              axios(config2)
                .then(function (response2) {
                  if (response2.data.documents.length == []) {
                    // if none found, search all pets with given ID as their baby ID

                    let data3 = JSON.stringify({
                      dataSource: "CSpets",
                      database: "csPets",
                      collection: "pets",
                      filter: {
                        baby_id: pID,
                      },
                    });

                    let config3 = {
                      method: "post",
                      maxBodyLength: Infinity,
                      url: "https://us-east-2.aws.data.mongodb-api.com/app/data-qmnzi/endpoint/data/v1/action/find",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: token,
                      },
                      data: data3,
                    };

                    axios(config3)
                      .then(function (response3) {
                        if (response3.data.documents.length == 0) {
                          // if none found, display error message

                          document.getElementById("result").innerHTML =
                            "Sorry, the given pet either does not exist or has yet to be added to the database.";
                        } else {
                          outcomes(response3);
                        }
                      })
                      .catch(function (error) {
                        console.log(error);
                      });
                  } else {
                    outcomes(response2);
                  }
                })
                .catch(function (error) {
                  console.log(error);
                });
            } else {
              // format pet info

              var pet = JSON.stringify(response.data.document.pet_name)
                .replace(/^"(.*)"$/, "$1")
                .replace(/\\/g, "");
              var month = JSON.stringify(response.data.document.month).replace(
                /^"(.*)"$/,
                "$1"
              );
              var year = JSON.stringify(response.data.document.year).replace(
                /^"(.*)"$/,
                "$1"
              );
              var pps = JSON.stringify(response.data.document.PPS).replace(
                /^"(.*)"$/,
                "$1"
              );
              pps =
                pps.toLowerCase().charAt(0).toUpperCase() +
                pps.slice(1).toLowerCase();
              var species = JSON.stringify(
                response.data.document.species
              ).replace(/^"(.*)"$/, "$1");
              species =
                species.toLowerCase().charAt(0).toUpperCase() +
                species.slice(1).toLowerCase();
              var artist = JSON.stringify(
                response.data.document.artist_name
              ).replace(/^"(.*)"$/, "$1");
              var artist_l = JSON.stringify(response.data.document.artist_link);
              var litter = JSON.stringify(
                response.data.document.litter_name
              ).replace(/^"(.*)"$/, "$1");
              var archive_l = JSON.stringify(
                response.data.document.archive_link
              );
              var notes = JSON.stringify(response.data.document.notes)
                .replace(/^"(.*)"$/, "$1")
                .replace(/\\/g, "");

              // display

              display_result(
                imgURL,
                archive_l,
                pet,
                month,
                year,
                species,
                litter,
                pps,
                artist_l,
                artist,
                notes
              );
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      })
      .catch(function (error) {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
  }
}
