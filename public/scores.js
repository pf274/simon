async function loadScores() {
  const response = await fetch("/api/scores");
  const scores = await response.json();
  const tableBodyElement = document.getElementById("tableBody");
  let top_scores = Object.values(scores);
  top_scores.sort((a, b) => {
    return a.score - b.score;
  });
  top_scores.reverse();
  console.log(top_scores);
  top_scores = top_scores.slice(0, Math.min(top_scores.length, 10));
  let rows = [];
  if (top_scores.length < 1) {
    tableBodyElement.innerHTML = '<tr><td colSpan=4>Be the first to score</td></tr>';
    return 1;
  }
  for (let index = 0; index < top_scores.length; index++) {
    const info = top_scores[index];

    const positionTdElement = document.createElement('td');
    const nameTdElement = document.createElement('td');
    const scoreTdElement = document.createElement('td');
    const dateTdElement = document.createElement('td');

    positionTdElement.textContent = index + 1;
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
  for (const row of rows) {
    tableBodyElement.appendChild(row.element);
  }
  return 1;
}

loadScores();