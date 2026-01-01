const srcbutton = document.getElementById('srcbutton');
const usernameInput = document.getElementById('username');
const profileDiv = document.getElementById('profile');
const reposDiv = document.getElementById('repos');
const errormesg = document.getElementById('error');

srcbutton.addEventListener('click', searchUser);
usernameInput.addEventListener("keypress", function(e){
    if(e.key === 'Enter'){
        searchUser();
    }
});

function searchUser() {
    const username= usernameInput.value.trim();
    if (username===""){
        alert("Please enter a username");
        return;
    }
    errormesg.textContent = "";
    profileDiv.innerHTML="";
    reposDiv.innerHTML="";

    fetchUserProfile(username);
    fetchUserRepo(username);
}

function fetchUserProfile(username) {
    fetch(`https://api.github.com/users/${username}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('User not found');
        }
        return response.json();
    })
    .then(data=>displayProfile(data))
    .catch(errormesg=>{
        errormesg.textContent = "User not found...";
    });
}

function displayProfile(user) {
    profileDiv.innerHTML = `
        <div class="profile-card">
            <img src="${user.avatar_url}" width="120">

            <div class="profile-info">
                <h2>${user.name || "No Name"}</h2>
                <p>@${user.login}</p>
                <p>${user.bio || "No bio available"}</p>

                <div class="badges">
                    <span>👥 Followers: ${user.followers}</span>
                    <span>▶️ Following: ${user.following}</span>
                </div>

                <a href="${user.html_url}" target="_blank">
                    View GitHub Profile
                </a>
            </div>
        </div>
    `;
}

function fetchUserRepo(username) {
    fetch(`https://api.github.com/users/${username}/repos`)
        .then(response => response.json()) 
        .then(data => displayprofileRepos(data))
        .catch(error => {
            console.error("Error fetching repos:", error);
        });
}

function displayprofileRepos(repos) {
    reposDiv.innerHTML = '<h2>Repositories</h2>';

    repos.forEach(repo => {
        const repoCard = document.createElement('div');
        repoCard.classList.add('repo-card');

        repoCard.innerHTML = `
            <a href="${repo.html_url}" target="_blank">
                <h3>${repo.name}</h3>
            </a>
            <p>${repo.description || "No description"}</p>
            <div class="repo-stats">
                <span>⭐: ${repo.stargazers_count}</span>
                <span>🍴: ${repo.forks_count}</span>
            </div>
        `;

        reposDiv.appendChild(repoCard);
    });
}
