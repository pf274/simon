async function loadScores() {
  const response = await fetch("/api/scores");
  const scores = await response.json();
  
    const tableBodyElement = document.getElementById("tableBody");
    let top_scores = Object.values(scores).map((player_data) => player_data.score);
    top_scores.sort();
    top_scores.reverse();
    let rows = [];
    if (Object.keys(scores).length) {
      for (const info of Object.values(scores)) {
        const positionTdElement = document.createElement('td');
        const nameTdElement = document.createElement('td');
        const scoreTdElement = document.createElement('td');
        const dateTdElement = document.createElement('td');
  
        positionTdElement.textContent = top_scores.indexOf(info.score) + 1;
        nameTdElement.textContent = info.name;
        scoreTdElement.textContent = info.score;
        dateTdElement.textContent = info.date;
  
        const rowElement = document.createElement('tr');
        rowElement.appendChild(positionTdElement);
        rowElement.appendChild(nameTdElement);
        rowElement.appendChild(scoreTdElement);
        rowElement.appendChild(dateTdElement);
        rows.push({
          score: info.score,
          element: rowElement,
        });
      }
      // sort the rows by score
      rows.sort((a, b) => {
        return a.score - b.score;
      });
      for (const row of rows) {
        tableBodyElement.appendChild(row.element);
      }
    } else {
      tableBodyElement.innerHTML = '<tr><td colSpan=4>Be the first to score</td></tr>';
    }
  }
  
loadScores();