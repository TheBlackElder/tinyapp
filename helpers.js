const generateRandomString = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};


const findUserByEmail = (email, users) => {
  for (const id in users) {
    // console.log("usersId", users[id]);
    if (users[id].email === email) return users[id];
  }
  return null;
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




module.exports = { generateRandomString, findUserByEmail, urlsForUser};

