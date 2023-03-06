function loadScores() {
    let scores = {};
    const scoresText = localStorage.getItem('scores');
    if (scoresText) {
      scores = JSON.parse(scoresText);
    }
  
    const tableBodyElement = document.getElementById("tableBody");
    let top_scores = Object.values(scores).map((player_data) => player_data.score);
    top_scores.sort();
    top_scores.reverse();
    if (Object.keys(scores).length) {
      for (const [i, score] of Object.entries(scores)) {
        const positionTdElement = document.createElement('td');
        const nameTdElement = document.createElement('td');
        const scoreTdElement = document.createElement('td');
        const dateTdElement = document.createElement('td');
  
        positionTdElement.textContent = top_scores.indexOf(score.score) + 1;
        nameTdElement.textContent = score.name;
        scoreTdElement.textContent = score.score;
        dateTdElement.textContent = score.date;
  
        const rowEl = document.createElement('tr');
        rowEl.appendChild(positionTdElement);
        rowEl.appendChild(nameTdElement);
        rowEl.appendChild(scoreTdElement);
        rowEl.appendChild(dateTdElement);
  
        tableBodyElement.appendChild(rowEl);
      }
    } else {
      tableBodyElement.innerHTML = '<tr><td colSpan=4>Be the first to score</td></tr>';
    }
  }
  
  loadScores();