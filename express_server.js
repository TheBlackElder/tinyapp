const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser');
const {findUserByEmail, findMatchingPassword } = require("./helpers");


app.use(cookieParser());

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

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


const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});



app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});



app.get("/urls", (req, res) => {
  const userID = req.cookies.user_id;
  const user = users[userID];
  const templateVars = {
    urls: urlDatabase,
    user: user,
  };
  res.render("urls_index", templateVars);
});


app.post("/urls/:id", (req, res) => {
  console.log("edit");
  const id = req.params.id;
  const longURL = req.body.longURL;
  urlDatabase[id].longURL = longURL;
  res.redirect("/urls");
});

//changed to equal a new object
app.post("/urls", (req, res) => {
  const userID = req.cookies.user_id;
  if (userID === undefined) {
    return res.status(401).send('Login required to access');
  }
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = {longURL: longURL, userID: userID };
  console.log(urlDatabase);
 
  res.redirect("./urls");
});





app.get("/urls/new", (req, res) => {
  const userID = req.cookies.user_id;
  const user = users[userID];
  if (userID === undefined) {
    return res.redirect("/login");
  }
  const templateVars = {
    urls: urlDatabase,
    user: user,
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const userID = req.cookies.user_id;
  const user = users[userID];
 
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id].longURL,
    urls: urlDatabase,
    user: user,
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  if (longURL === undefined) {
    return res.status(404).send('Short URL  not found');
  }
  return res.redirect(longURL);
});




app.get("/register", (req, res) => {
  const userID = req.cookies.user_id;
  const user = users[userID];
  if (userID !== undefined) {
    return res.redirect("/urls");
  }
  const templateVars = {
    user: user,
  };
  res.render("register", templateVars);
});

app.post("/register", (req, res) => {
  const newUserID = generateRandomString();
  users[newUserID]  = {
    id: newUserID,
    email: req.body.email,
    password: req.body.password,
  };
  const newUser = users[newUserID];
  if (newUser.email === "" || newUser.password === "")
    res.status(400).send('Invalid entries of email and password');
  if (findUserByEmail(newUser.email)) {
    res.status(400).send('User account with this email already exists');
  }
  res.cookie("user_id", newUserID);
  res.redirect("/urls");
});

app.get("/login", (req, res) => {
  const userID = req.cookies.user_id;
  const user = users[userID];
  if (userID !== undefined) {
    return res.redirect("/urls");
  }
  const templateVars = {
    user: user,
  };
  res.render("login", templateVars);
});

app.post("/login", (req, res) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  if (!findUserByEmail(userEmail, users)) {
    return res.status(403).send('This email is not registered');
  }
  if (findUserByEmail(userEmail, users) && !findMatchingPassword(userEmail, userPassword, users))
    return res.status(403).send('Password does not match user account with this email');
  const user = findUserByEmail(userEmail, users);
  if (findUserByEmail(userEmail, users) && (findMatchingPassword(userEmail,userPassword, users)))
    res.cookie("user_id", user.id);
  return res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

