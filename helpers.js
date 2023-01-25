

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







module.exports = { findUserByEmail, findMatchingPassword};

// const findUserByEmail = (email) => {
//   for (const key in users) {
//     if (users[key]["email"] === email) return true;
//   }
//   return false;
// };

// const (let id in user) {
//   if (req.body.email === users[id].email) {
//     console.log("found email that matches");
//     if (req.body.password === users[id].password) {
//       console.log("email and password has matched");
//     } else {
//       console.log("email matched, but password didn't");
//     }
//   }
// }
