// Top repos from last month:
// curl -o ./api_response.txt "https://api.github.com/search/repositories?q=stars:>1000+created:2020-02-01..2020-02-28&sort=stars&order=desc"

//Top users from last month:
// curl -o ./api_response.txt "https://api.github.com/search/users?q=followers:>1000+created:2019-03-01..2020-03-01&sort=followers&order=desc"

//Query number of followers for specific user
// curl https://api.github.com/users/DanielPetelin



const start_date = '2020-02-01'
const end_date = '2020-02-28'

const repo_query = "https://api.github.com/search/repositories?q=stars:>1000+created:${start_date}..${end_date}&sort=stars&order=desc" 
const user_query = "https://api.github.com/search/users?q=followers:>1000+created:2019-03-01..2020-03-01&sort=followers&order=desc"
const followers_query = "https://api.github.com/users/DanielPetelin"

async function queryGitHubAPI(query) {
    // return fetch(query)
    //     .then(response => {
    //         return response.json()
    //     })
    //     .then(data => {
    //         let followers = data.followers
    //         return followers
    //     })
    //     .catch(err => {
    //         // TODO: add error handling
    //     })


    const resp = await fetch(query);
    const data = await resp.json();
    
    return data.followers
}

// queryGitHubAPI(repo_query);
// queryGitHubAPI(user_query);
const followers = queryGitHubAPI(followers_query);
console.log(followers);











