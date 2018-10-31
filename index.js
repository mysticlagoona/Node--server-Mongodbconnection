'use strict';

const port = process.env.PORT || "3000";
const express = require("express");
var cors = require("cors");
var bodyParser = require('body-parser')
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
//Database
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/mydb");

const db = mongoose.connection;


//Making schema
const studentsSchema = new mongoose.Schema({
  name: {type :String},
  email:{type :String},
  phone: {type :String}
 /*  skills: [{ skill: String, rate: Number }],
  date: { type: Date, default: Date.now } */
});

//Creating a Model
const dummyStudents = mongoose.model('dummyStudents', studentsSchema);

db.on('error', console.error.bind(console, ' XXX__connection error:'));
db.once('open', function() {

  // Database connection is open now
  app.get("/", (req, res) => {

    res.send("Hello Express JS World.. We are in root now ");
  });

  // find a single name provided in the url
  app.get('/api/:field', (req, res) => {
    let field = req.params.field;
    dummyStudents.find({}, `${field}` , function(err, result) {
      if(err) 
        {
         return  console.log(err);
        } else 
        {
         res.json(result);
        }
      })
  });
  // find all names from the database
  app.get('/api/all/names', (req, res) => {
		dummyStudents.find({}, function(err, results) {
			if(err) return console.log(err);
      if(results.length === 0)  res.send("No Information Found!");
      //res.send(results);
      res.send(results.map(items => items.name));  
		});
	});
  // Insert in Database
  app.post('/api/post/:name', (req,res) => {
    let studentName = req.params.name;
    dummyStudents.find({}, function(err, newStudent)  {
      let student = new dummyStudents({
        name : studentName,
        email : 'abc@ghj',
        phone : '98754321'
      });
      if(newStudent.length !== 0 ) {
        student.save(function (err, student) {
          if(err) return HTMLFormControlsCollection.log(err);

          res.send('new data saved ' + student);
        });
      }
    });
  });

    //Update database
  app.put("/api/put/:name/update", (req, res) => {
    let query=req.params.name;
    dummyStudents.findOneAndUpdate(query, { $set: { name: 'jason bourne' }},
    function(err,result) {
      if (err) return console.log(err);

      else { return  res.send(result + 'updated database');}
    })
  });
  app.delete("/api/delete/:name", (req, res) => {
    dummyStudents.findOneAndDelete({name : req.params.name }, function (err, doc) {
      if (err) return console.log(err);
      
       else {return res.send('data deleted ' + doc);} 
      });  
  });

});


app.listen(port, () => console.log(`Listning to port:${port}`));

