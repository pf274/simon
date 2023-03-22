const express = require('express');
const {MongoClient} = require('mongodb');
const app = express();
let scoreCollection;
// The service port. In production the front-end code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the front-end static content hosting
app.use(express.static('public'));

// Router for service endpoints
const apiRouter = express.Router();
app.use(`/api`, apiRouter);

let scores = {};
// GetScores
apiRouter.get('/scores', async (_req, res) => {
  let all_scores = await getScores();
  res.send(all_scores);
});

// SubmitScore
apiRouter.post('/score', async (req, res) => {
  let new_high = await updateScores(req.body);
  res.send(new_high);
});

async function getScores() {
  let cursor = scoreCollection.find();
  return cursor.toArray();
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

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

const username = process.env.MONGOUSER;
const password = process.env.MONGOPASSWORD;
const hostname = process.env.MONGOHOSTNAME;

async function dbSetup() {
  const url = `mongodb+srv://${username}:${password}@${hostname}`;
  const client = new MongoClient(url);
  scoreCollection = client.db('simon').collection('scores');
}

dbSetup();