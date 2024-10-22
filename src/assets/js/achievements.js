async function populateAchievements() {
    await fetch('/api/me', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json().then(data => {
        //console.log(data.user.achievements);
        let achievements = data.user.achievements;
        let tbody = document.querySelector("#userAchievementsBody");
        tbody.innerHTML = "";
        for (let achievement of achievements) {
            let row = document.createElement("tr");
            let icon = document.createElement("td");
            let name = document.createElement("td");
            let description = document.createElement("td");
            let reward = document.createElement("td");
            icon.innerHTML = `<i class="fas fa-user-plus"></i>`;
            name.innerHTML = achievement.name;
            description.innerHTML = achievement.description;
            reward.innerHTML = achievement.reward;
            name.classList.add('achARNcol', 'achARN');
            description.classList.add('achARDcol', 'achARD');
            reward.classList.add("achARRcol", "achARR");
            row.classList.add("ARC");
            row.appendChild(icon);
            row.appendChild(name);
            row.appendChild(description);
            row.appendChild(reward);
            tbody.appendChild(row);
        }
            
    }))

}

populateAchievements();