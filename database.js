const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

const userName = process.env.MONGOUSER;
const password = process.env.MONGOPASSWORD;
const hostname = process.env.MONGOHOSTNAME;

if (!userName) {
  throw Error('Database not configured. Set environment variables');
}

const url = `mongodb+srv://${userName}:${password}@${hostname}`;

const client = new MongoClient(url);
const userCollection = client.db('simon').collection('users');
const scoreCollection = client.db('simon').collection('scores');

async function getUser(username) {
  let response = await userCollection.findOne({ username: username });
  return response;
}

async function getUserByToken(token) {
  return userCollection.findOne({ token: token });
}

async function createUser(username, password) {
  // Hash the password before we insert it into the database
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    username: username,
    password: passwordHash,
    token: uuid.v4(),
  };
  await userCollection.insertOne(user);

  return user;
}

function addScore(score) {
  scoreCollection.insertOne(score);
}

async function updateScores(data) {
    let new_high = false;
    let {name, score} = data;
    let all_scores = await getScores();
    let score_records = {};
    for (const record of all_scores) {
      score_records[record.name] = record;
    }
    if (name in score_records) {
        if (score_records[name].score < score) {
          let query = {name: name};
          scoreCollection.replaceOne(query, {
            name: name,
            score: score,
            date: new Date().toLocaleDateString()
          });
          new_high = true;
        }
    } else {
      scoreCollection.insertOne({
        name: name,
        score: score,
        date: new Date().toLocaleDateString()
      });
      new_high = true;
    }
    return new_high;
  }

async function getScores() {
    let cursor = scoreCollection.find();
    return cursor.toArray();
  }

module.exports = {
  getUser,
  getUserByToken,
  createUser,
  addScore,
  getScores,
  updateScores,
};