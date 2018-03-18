// Link to our Firebase: This is right!
var config = {
    apiKey: "AIzaSyBFItteSwAii_eYcCtGk2tITKwpUGMQqbw",
    authDomain: "trains-230d3.firebaseapp.com",
    databaseURL: "https://trains-230d3.firebaseio.com",
    projectId: "trains-230d3",
    storageBucket: "trains-230d3.appspot.com",
    messagingSenderId: "362734551936"
  };
  firebase.initializeApp(config);

var database = firebase.database();
//declare variables
var name = "Train Name Alpha"; //send to firebase
var destination = "Destination Alpha"; //send to firebase
var firstTrain =  "03:30"; //send to firebase
var firstTimeFormat="hh:mm" //CHECK ON THIS = for momentjs
var firstTimeConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
console.log(firstTimeConverted);
var frequency = 10; //send to firebase
var frequencyFormat = "minutes"; // //CHECK ON THIS = for momentjs
var nextArrival= "00:00" ; //CHECK ON THIS =send to the DOM
var minutesAway= "00:00"; //CHECK ON THIS =send to the DOM
var currentTime=moment(); //for calculations

// Difference between the times
var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
console.log("DIFFERENCE IN TIME: " + diffTime);

//Submit button, send data to Firebase
$("#submit").on("click", function (event) {
  event.preventDefault();
  console.log("We're sending data to Firebase");
  //trim and validate data here, before it's sent to firebase
  name = $("#name").val().trim();
  destination = $("#destination").val().trim();
  fristTrain = $("#firstTrain").val().trim();
  frequency = $("#frequency").val().trim();

  database.ref().push({
    name = name,
    destination = destination,
    fristTrain = firstTrain,
    frequency = frequency
  });
});


// let's fill in a table!!!
database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function (childsnapshot) {

  var tRow = $("<tr>");
  var tBody = $("tbody");
  // tBody.empty(); //remove this to get list of all new values
  // Calculate Next Arrival and Minues Away
  //nex arrival = lasttraintime-currenttime
  var startDate = childsnapshot.val().startDate;
  console.log(startDate); //does get last date, but as YYYY/MM/DD 
  var startMoment = moment(startDate).format("MM/DD/YYYY");
  console.log(startMoment);//this is an object
  var monthsDiffernce = moment().diff(moment(startMoment), "M"); //should be a number but isn't
  var monthsNumber = parseInt(monthsDiffernce);
  console.log(monthsNumber); //this is a negative number
  //calculate TOTAL
  var rate = childsnapshot.val().monthlyRate;
  console.log(rate); //this is a string
  var rateNumber = parseInt(rate);
  console.log(rateNumber); //a number!
  var total = monthsNumber * rateNumber;


  //Check these names. Use childsnapshot.val() if pulling from database, otherwise put calculated


  var nameTd = $("<td>").text(childsnapshot.val().name);//from database
  var destinationTd = $("<td>").text(childsnapshot.val().destination);//from database
  var frequencyTd = $("<td>").text(childsnapshot.val().frequency);//from database
  var nextArrivalTd = $("<td>").text(monthsDiffernce); //calculated value
  var minutesAwayTd = $("<td>").text("$" + childsnapshot.val().monthlyRate); //from database
  tRow.append(nameTd, destinationTd, frequencyTd, nextArrivalTd, minutesAwayTd);
  console.log(tRow);
  tBody.append(tRow);
})
