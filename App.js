const today = moment().format('YYYY-MM-DD');
const oneYearAgo = moment().subtract(1, 'years').format('YYYY-MM-DD');
const lastMonthStart = moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD')
const lastMonthEnd = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD')
const base = 'https://api.github.com'
const repoQuery = `${base}/search/repositories?q=stars:>1000+created:${lastMonthStart}..${lastMonthEnd}&sort=stars&order=desc`
const userQuery = `${base}/search/users?q=followers:>1000+created:${oneYearAgo}..${today}&sort=followers&order=desc`
var autoRefreshRunning = false

async function fetchWrapper(url) {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    }
  });
  if (response.ok) {
    return response.json();
  } else {
    console.error(response.statusText);
  }
}

function populateTable(tableId, data) {
  const table = document.getElementById(tableId);
  table.removeChild(table.getElementsByTagName('tbody')[0]);
  table.appendChild(document.createElement('tbody')); // Ensure the body is empty.
  table.getElementsByTagName('thead')[0].style.visibility = 'visible'; // Reveal the header.
  const tbody = table.getElementsByTagName('tbody')[0];
  if (tableId === 'top_5_repos') {
    data.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = '<td><img src=' + item.owner.avatar_url + ' height=60 width=60></img></td>' +
      '<td>' + item.name + '</td>' +
      '<td>' + item.stargazers_count.toLocaleString() + '</td>' +
      '<td>' + item.description + '</td>' +
      '<td class=nowrap>' + moment(item.created_at).format('MM-DD-YYYY') + '</td>' +
      '<td>' + item.id + '</td>';
      tbody.appendChild(row) // Add a row to the table for every item in data.
    });
  } else if (tableId === 'top_5_users') {
    data.forEach(async item => {
      const row = document.createElement('tr');
      const userInfo = await fetchWrapper(`${base}/users/${item.login}`);
      row.innerHTML = '<td><img src=' + item.avatar_url + ' height=60 width=60></img></td>' +
      '<td>' + item.login + '</td>' +
      '<td>' + userInfo.followers.toLocaleString() + '</td>' +
      '<td class=nowrap>' + moment(userInfo.created_at).format('MM-DD-YYYY') + '</td>' +
      '<td>' + item.id + '</td>';
      tbody.appendChild(row);
    });
  }
}

async function autoRefresh(){
  console.log('Refreshing followers column now.');
  const table = document.getElementById('top_5_users');
  for (let i = 1, row; row = table.rows[i]; i++) {
    const user = row.cells[1].innerHTML; // User Name is the 2nd column
    const userInfo = await fetchWrapper(`${base}/users/${user}`);
    const followersCol = row.cells[2]; // Followers is the 3rd column
    followersCol.innerHTML = userInfo.followers.toLocaleString();
  }
}

async function queryGitHubAPI(url, query_name) {
  const data = await fetchWrapper(url);
  const topFive = data.items.slice(0, 5);
  if (query_name === 'repo_query') {
    populateTable('top_5_repos', topFive);
  } else if (query_name === 'user_query') {
    populateTable('top_5_users', topFive);
    if (autoRefreshRunning == false) {
      setInterval(autoRefresh, 120000); // Refresh the 'Followers' column every 2 minutes
      autoRefreshRunning = true;
    }
  }  
}
