const services = require('./database');

module.exports = function(pool) {

  const serviceData = services(pool);

  async function takeNamesHome(req, res) {
    try {
      let count = await serviceData.counting();
      res.render('home', {
        count
      });
    } catch (err) {}
  }

  async function postRoute(req, res) {
    try {
      const people = req.body.people;
      const languages = req.body.langNames;

      if (people === '' && languages === undefined) {
        req.flash('info', 'Please select language and enter name')
      } else if (people === '') {
        req.flash('info', 'Please enter name')
      } else if (languages === undefined) {
        req.flash('info', 'Please select a language')
      } else {
        req.flash('info', languages + " ," + people);
        await serviceData.addUsersOrIncrement(people, languages);
      }
      res.redirect('/');

    } catch (err) {}
  }

  async function getRoute(req, res) {
    try {
      const people = req.params.name;
      const languages = req.params.language;

      if (people === '' && languages === undefined) {
        req.flash('info', 'Please select language and enter name')
      } else if (people === '') {
        req.flash('info', 'Please enter name')
      } else if (languages === undefined) {
        req.flash('info', 'Please select a language')
      } else {
        req.flash('info', languages + " ," + people);
        await serviceData.addUsersOrIncrement(people, languages);
      }
      res.redirect('/');

    } catch (err) {}
  }
  async function resRoute(req, res) {
    try {
      // routes.reset();
      await serviceData.deleteAll();
      res.redirect('/');
    } catch (err) {

    }
  }

  async function greetedRouted(req,res){
    try {
      let keep = await serviceData.selectAlldata();
      res.render('greeted', {keep});

    } catch (err) {
      res.send(err.stack);
    }
  }

  return {
    takeNamesHome,
    postRoute,
    resRoute,
    getRoute,
    greetedRouted
  }
}
