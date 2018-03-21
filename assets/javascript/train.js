// Link to our Firebase: This is working
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
//declare variables being submitted to the database
var name = "Septa"; //send to firebase
var destination = "30th Street Station"; //send to firebase
var firstTime = "03:30"; //send to firebase
var tFrequency = 3; //send to firebase 


//Submit button, send data to Firebase
$("#submit").on("click", function (event) {
  event.preventDefault();
  console.log("We're sending data to Firebase");
  //trim and validate data here, before it's sent to firebase
  name = $("#name").val().trim();
  destination = $("#destination").val().trim();
  firstTime = $("#firstTime").val().trim();
  tFrequency = $("#tFrequency").val();

  //use PUSH instead of SET to keep values of trains in firebase
  database.ref().push({
    name: name,
    destination: destination,
    firstTime: firstTime,
    tFrequency: tFrequency
  });
});


// let's fill in a table!!!
database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function (childsnapshot) {

  var tRow = $("<tr>");
  var tBody = $("#schedule");

    // 
    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTime=childsnapshot.val().firstTime; 
    var timeFormat = "HH:mm"
    var firstTimeConverted = moment(firstTime, timeFormat).subtract(1, "year"); //This is "date math"
    console.log(firstTimeConverted); //an object

    var tFrequencyFormat = "minutes"; // //CHECK ON THIS = for momentjs

    // Current Time
    var currentTime = moment(); 
    console.log("CURRENT TIME: " + moment(currentTime).format(timeFormat)); //works 

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime); //returns a number of minutes as string object
    console.log(("type of diffTime " + typeof diffTime))//it's a number
    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder); //this is also a number

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
    console.log(typeof tMinutesTillTrain);

    // Next Train
    var nextTrain= moment().add(tMinutesTillTrain, "minutes");
    var nextTrainTime= moment(nextTrain).format("hh:mm");
    // var nextTrain = moment().add(tMinutesTillTrain);
    console.log("ARRIVAL TIME: " + nextTrainTime); //this doesn't seem to work
  


  //Check these names. Use childsnapshot.val() if pulling from database, otherwise put calculated


  var nameTd = $("<td>").text(childsnapshot.val().name);//from database
  var destinationTd = $("<td>").text(childsnapshot.val().destination);//from database
  var tFrequencyTd = $("<td>").text(childsnapshot.val().tFrequency);//from database


  var nextTrainTd = $("<td>").text(nextTrainTime); //calculated above
  var tMinutesTillTrainTd = $("<td>").text(tMinutesTillTrain); //calculated above
  tRow.append(nameTd, destinationTd, tFrequencyTd, nextTrainTd, tMinutesTillTrainTd);
  console.log(tRow);
  tBody.append(tRow);
})
