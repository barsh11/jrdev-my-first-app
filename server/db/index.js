
const { init: initUser, User } = require("./user");
const { init: initPost, Post } = require("./post");
const { getConnection } = require("./connection");


const db = {
  initialized: false,
  user: null,
  post: null,
}

async function getDB() {
  if(!db.initialized) {
    const connection = getConnection();
    db.user = await initUser(connection);
    db.post = await initPost(connection, User);
    
    db.initialized = true;
  }
  return db
}

module.exports = getDB