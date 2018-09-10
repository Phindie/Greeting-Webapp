
let assert = require("assert");
const Services = require('../database');
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

describe('Greeting App test for both front-end and back-ends', function() {

  beforeEach(async function(){
    await pool.query('Delete from greet');
  });
it('should return empty users data ', async function() {
    var services = Services(pool);
    let results = await services.selectAlldata();
    assert.strictEqual(results.length, 0);
  });

it('Should return the greet in English ', async function() {
    var services = Services(pool);
    await services.addUsersOrIncrement('Phindi', 'Hello');
    let results = await services.selectAlldata();
    assert.strictEqual(results.length, 1);
  });

it('Should return the greet in isiXhosa', async function() {
    var services = Services(pool);
    await services.addUsersOrIncrement('Amanda', 'Molo');
    let results = await services.selectAlldata();
    assert.strictEqual(results.length, 1);
  });

it('Should return the greet in Afrikaans', async function() {
    var services = Services(pool);
    await services.addUsersOrIncrement('Amanda', 'Goeie Dag');
    let results = await services.selectAlldata();
    assert.strictEqual(results.length, 1);
  });

it('Should return the insert value of people', async function() {
    var services = Services(pool);
    await services.addUsersOrIncrement('Phindi', 'Goeie Dag');
    await services.addUsersOrIncrement('Zee', 'Molo');
    await services.addUsersOrIncrement('Amanda', 'Molo');
    let results = await services.selectAlldata();
    assert.strictEqual(results.length, 3);
  });

it('Should return the counter value of people counted ', async function() {
    var services = Services(pool);
    await services.addUsersOrIncrement('Phindi','Molo');
    await services.addUsersOrIncrement( 'lihle','Molo');
    await services.addUsersOrIncrement('Phindi','Molo');
    let results = await services.counting();
    assert.strictEqual(results,2);
  });

  it('should return the name of a user selected', async function() {
      var services = Services(pool);
      await services.addUsersOrIncrement('Amanda','Molo');
      await services.addUsersOrIncrement( 'Zee','Molo');
      await services.addUsersOrIncrement('Zee','Molo');
      let results = await services.selectUsers('Zee');
      assert.strictEqual(results[0].users_greeted, 'Zee');
    });

    it('should return the the language of a user selected', async function() {
        var services = Services(pool);
        await services.addUsersOrIncrement('Amanda','Molo');
        await services.addUsersOrIncrement( 'Zee','Molo');
        await services.addUsersOrIncrement('Zee','Molo');
        let results = await services.selectUsers('Zee');
        assert.strictEqual(results[0].user_language, 'Molo');
      });
  after(function() {
    pool.end();
  });
});
