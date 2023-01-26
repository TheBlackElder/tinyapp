

const findUserByEmail = (email, users) => {
  for (const id in users) {
    if (users[id].email === email) return users[id];
  }
  return null;
};

const findMatchingPassword = (email,password, users) => {
  for (const id in users) {
    if (users[id].email === email && users[id].password === password) return true;
  }
  return false;
};




const urlsForUser = (userID, urlDatabase) => {
  let result = {};
  for (const id in urlDatabase) {
    if (urlDatabase[id].userID  === userID) {
      result[id] = urlDatabase[id];
    }
  }
  return result;
};




module.exports = { findUserByEmail, findMatchingPassword, urlsForUser};

// Instruction
// Create a function named urlsForUser(id) which returns the URLs where the userID is equal to the id of the currently logged-in user.

// aJ48lW
// test@user.com
// easy


// const urlDatabase = {
//   b6UTxQ: {
//     longURL: "https://www.tsn.ca",
//     userID: "aJ48lW",
//   },
//   i3BoGr: {
//     longURL: "https://www.google.ca",
//     userID: "aJ48lW",
//   },
// };

// const users = {
//   userRandomID: {
//     id: "userRandomID",
//     email: "user@example.com",
//     password: "purple-monkey-dinosaur",
//   },
//   user2RandomID: {
//     id: "user2RandomID",
//     email: "user2@example.com",
//     password: "dishwasher-funk",
//   },
// };


