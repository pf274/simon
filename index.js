const express = require('express');
const app = express();

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
apiRouter.get('/scores', (_req, res) => {
  res.send(scores);
});

// SubmitScore
apiRouter.post('/score', (req, res) => {
  let {new_high, new_scores} = updateScores(req.body, scores);
  scores = new_scores;
  res.send(new_high);
});

function updateScores(data, old_scores) {
  let new_high = false;
  let {name, score} = data;
  let new_scores = {...old_scores};
  if (name in new_scores) {
      if (new_scores[name].score < score) {
        new_scores[name] = {
              name: name,
              score: score,
              date: new Date().toLocaleDateString(),
          };
        new_high = true;
      }
  } else {
    new_scores[name] = {
          name: name,
          score: score,
          date: new Date().toLocaleDateString(),
      };
    new_high = true;
  }
  return {new_high, new_scores};
}

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});