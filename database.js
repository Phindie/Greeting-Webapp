module.exports = function dataSet(pool){

  async function selectAlldata(){
      let keep = await pool.query('SELECT * FROM greet');
      return keep.rows;
  }
async function insertName(people, languages){
    await pool.query('insert into greet (users_greeted, user_language, counter) values ($1,$2,$3)',[people,languages,1]);
  }
async function counting(){
        let counter = await pool.query('select count(*) from greet');
      return parseInt(counter.rows[0].count);

  }
async function selectUsers(people){
        let user = await pool.query('select * from greet WHERE users_greeted = $1', [people]);
      return user.rows;
 }
async function incrementUsers(increment, people,language){
    await pool.query('UPDATE greet set counter = $1, user_language = $3 where users_greeted = $2', [increment, people,language]);
}

async function deleteAll(){
    await pool.query(' Delete from greet');
}

async function addUsersOrIncrement(name,language){
  let user = await selectUsers(name);
  if(user.length != 0){
    let increment = user[0].counter +1;
    await incrementUsers(increment, name,language);
  }
  else {
    await insertName(name,language);
  }


}

  return {
    selectAlldata,
    counting,
    selectUsers,
    addUsersOrIncrement,
    deleteAll
  }
}
