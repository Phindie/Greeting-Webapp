
module.exports = function(Pool) {
  // var name = '';
  var greetCount = 0;
  var nameAnLanguage = '';
  var peopleNames = {};

function greetingFunction(name,langNames) {
  if (name !== "" && langNames !== undefined) {
    if (peopleNames[name] === undefined) {
        peopleNames[name] = 0;

      }
      if (langNames === 'English') {
        nameAnLanguage = 'Hello, ' + name;
      }
      if (langNames === 'Afrikaans') {
        nameAnLanguage = 'Goeie Dag, ' + name;
      }
      if (langNames === 'IsiXhosa') {
        nameAnLanguage = 'Molo, ' + name;
      }
    }



  }

  function returnGreeting() {
    return nameAnLanguage
  }

  function greetCounter() {
    return Object.keys(peopleNames).length;
  }

  function enterName(storedUser) {
    return peopleNames
  }

  function reset() {
    peopleNames = {};
    nameAnLanguage = '';
    greetCount = 0;
  }

  return {
    greetingFunction,
    returnGreeting,
    greetCounter,
    enterName,
    reset

  }

}
