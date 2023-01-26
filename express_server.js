const express = require("express");
const app = express();
const PORT = 8080;
const cookieParser = require('cookie-parser');
const {findUserByEmail, findMatchingPassword, urlsForUser } = require("./helpers");


app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

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
  z3roGr: {
    longURL: "https://www.google.ca",
    userID: "i9o6ty",
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
  aJ48lW: {
    id: "aJ48lW",
    email: "test@user.com",
    password: "easy",
  },
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});






app.get("/urls", (req, res) => {
  const userID = req.cookies.user_id;
  const user = users[userID];
  const authURLs = urlsForUser(userID, urlDatabase);
  if (user) {
    const templateVars = {
      urls: authURLs,
      user: user,
    };
    res.render("urls_index", templateVars);
  } else {
    res.status(401);
    res.redirect("/login");
  }
});

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


app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  const longURL = req.body.longURL;
  const userID = req.cookies.user_id;
  const user = users[userID];
  const authURLs = urlsForUser(userID, urlDatabase);
  if (!user) {
    return res.status(401).send("Login required");
  }
  if (!urlDatabase[id]) {
    return res.status(401).send(" ID not valid");
  }
  if (authURLs[id]) {
    urlDatabase[id].longURL = longURL;
    return res.redirect("/urls");
  } else {
    res.status(401).send(" Not authorized");
    res.redirect("/login");
  }
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
  if (urlsForUser(userID, urlDatabase)) {
    const templateVars = {
      id: req.params.id,
      longURL: urlDatabase[req.params.id].longURL,
      urls: urlDatabase,
      user: user,
    };
    return res.render("urls_show", templateVars);
  } else {
    res.status(400).send(" Access denied, URL not linked to this account ")
    return res.redirect("/login");
  }
});


app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  if (longURL === undefined) {
    return res.status(404).send('Short URL  not found');
  }
  return res.redirect(longURL);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const userID = req.cookies.user_id;
  const authURLs = urlsForUser(userID, urlDatabase);
  if (authURLs) {
    delete urlDatabase[req.params.shortURL];
    return res.redirect("/urls");
  } else {
    res.status(401).send(" Not authorized");
    res.redirect("/login");
  }
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
  if (user) {
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

