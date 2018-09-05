// "use strict"
let assert = require("assert");
const Greetings = require("../greet")

const pg = require('pg');
const Pool = pg.Pool;

const pool = new Pool({
  connectionString: 'postgresql://coder:pg123@localhost:5432/greeting_app_database'
});

it('should return the greeting in Afrikaans', async function() {
      var greet = Greetings(pool);

      assert.deepEqual( await greet.greetingFunction("Afrikaans", "Phindi"));
    });

    it('should return the greeting in IsiXhosa', async function() {
      var greet = Greetings(pool);

      assert.deepEqual( await greet.greetingFunction("isixhosa", "Amanda"));
    });
    it('should return the greeting in English', async function() {
      var greet = Greetings(pool);

      assert.deepEqual( await greet.greetingFunction("English", "Zee"));
    });

    it('should return empty users data', async function() {
      var greet = Greetings(pool);

      await greet.greetingFunction("English", "Phindi")
      await greet.greetingFunction("isixhosa", "Amanda")
      await greet.greetingFunction("isixhosa", "Zee")


      assert.deepEqual( await greet.reset());
    });

   it('should return the counter value of people counted', async function() {
      var greet = Greetings(pool);

      await greet.greetingFunction("English", "Phindi")
      await greet.greetingFunction("Afrikaans", "Zee")
      await greet.greetingFunction("isixhosa", "Yanda")

      assert.deepEqual( await greet.greetCounter(),3);

    });
    // it('should return object of different names greeted with number of greets per each person', async function() {
    //   var greet = Greetings(pool);
    //
    //   await greet.greetingFunction("English", "Lelo")
    //   await greet.greetingFunction("isixhosa", "Lihle")
    //   await greet.greetingFunction("isixhosa", "Zee")
    //
    //
    //   assert.deepEqual([ { people: 'Lelo' }, { people: 'Zee' } ], await greet.enterName());
    // });
