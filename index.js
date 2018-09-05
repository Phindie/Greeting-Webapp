const exphbs = require('express-handlebars');
const flash = require('express-flash');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const Greetings = require("./greet")
const pg = require("pg");
const Pool = pg.Pool;

const greets = Greetings();

let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
  useSSL = true;
}
const connectionString = process.env.DATABASE_URL || 'postgresql://coder:pg123@localhost:5432/greeting_app_database';

const pool = new Pool({
  connectionString,
  ssl: useSSL
});

const greet = Greetings(pool);
const app = express();

app.engine('handlebars',
  exphbs({
    defaultLayout: 'main',

  }));
  app.use(session({
    secret: "<add a string>",
    resave: false,
    saveUninitialized: true
  }));

  app.use(flash());

app.set('view engine', 'handlebars');
//bodyParser process or converting html data sent to the server
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/',async function(req, res) {
  const hello = greets.returnGreeting();
  let count = await pool.query('select count(*) from greet');
  let counting = count.rows[0].count;
  res.render('home', {
    counting,
    hello
  });
});
app.post('/greetings',async function(req, res) {
  const people = req.body.people;
  const languages = req.body.langNames;
  greets.greetingFunction(people, languages);

  if(people === '' && languages === undefined){
    req.flash('info', 'Please select language and enter name')
  }
else if(people === ''){
   req.flash('info', 'Please enter name')
 }
 else if(languages ===  undefined){
   req.flash('info','Please select a language')
 }
 else{

   let user = await pool.query('select * from greet WHERE users_greeted = $1', [people]);
   if(user.rows.length != 0){
     let currentCount = await pool.query('select counter from greet where users_greeted = $1', [people]);
     let increment = currentCount.rows[0].counter +1 ;
     await pool.query('UPDATE greet set counter = $1 where users_greeted = $2', [increment, people]);
   }
   else {
     await pool.query('insert into greet (users_greeted, user_language, counter) values ($1,$2,$3)',[people,languages,1]);
   }

 }
res.redirect('/');

});

app.get('/reset', async function(req, res) {
  greets.reset();
  await pool.query(' Delete from greet');
  res.redirect('/');
});

app.get('/greeted', async function(req, res) {
  try {
    let keep = await pool.query('SELECT * FROM greet');
    let keepName = keep.rows;
    res.render('greeted', {
      keepName
    });
  } catch (err) {
    res.send(err.stack);
  }
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
    console.log("started on: ", this.address().port);
});
