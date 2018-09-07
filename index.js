const exphbs = require('express-handlebars');
const flash = require('express-flash');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
// const Greetings = require("./greet");
const greetRoutes = require("./databaseRoutes");
const pg = require("pg");
const Pool = pg.Pool;



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



const routes = greetRoutes(pool);
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

app.get('/',routes.takeNamesHome);
app.post('/greetings', routes.postRoute);
app.get('/greetings/:name/:language', routes.getRoute);
app.get('/reset',routes.resRoute);
app.get('/greeted', routes.greetedRouted);
app.get('/counter/:users_greeted',routes.greetcounts);
app.get('/clear',async function (req,res){
    await pool.query(' Delete from greet');
    res.render('greeted');
});




const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
    console.log("started on: ", this.address().port);
});
