async function populateTables(){
    await fetch('/api/friends', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json().then(data => {
        let { friends, inbound_requests, outbound_requests } = data;
        let incomingSection = document.querySelector('#incomingRequestsSection');
        if (incomingSection) {
            let incomingTable = document.querySelector('#incomingRequestsTable');
            let incomingTableBody = incomingTable.querySelector('tbody');
            incomingTableBody.innerHTML = '';
            if (inbound_requests.length === 0) {
                incomingSection.style.display = 'none';
            }
            inbound_requests.forEach(request => {
                let row = document.createElement('tr');
                let icon = document.createElement('td');
                let name = document.createElement('td');
                icon.innerHTML = `<i class="fas fa-user-plus"></i>`;
                name.innerText = request.user_1;
                row.appendChild(icon);
                row.appendChild(name);
                let accept = document.createElement('td');
                let acceptButton = document.createElement('button');
                acceptButton.innerHTML = `<i class="fas fa-check"></i>`; 
                acceptButton.classList.add('fORURacceptActionButton');
                acceptButton.addEventListener('click', async function(event){
                    await fetch('/api/friends', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            action: "accept",
                            sender: request.user_1,
                            recipient: request.user_2
                        })
                    }).then(response => response.json().then(data => {
                        populateTables();
                    }));
                });
                accept.appendChild(acceptButton);
                row.appendChild(accept);
                incomingTableBody.appendChild(row);        
            });
        }

        let outgoingTable = document.querySelector('#outgoingRequestsTable');
        if (outgoingTable) {
            let outgoingTableBody = outgoingTable.querySelector('tbody');
            outgoingTableBody.innerHTML = '';
            outbound_requests.forEach(request => {
                let row = document.createElement('tr');
                let icon = document.createElement('td');
                let name = document.createElement('td');
                icon.innerHTML = `<i class="fas fa-user-plus"></i>`;
                name.innerText = request.user_2;
                row.appendChild(icon);
                row.appendChild(name);
                let actionsCell = document.createElement('td');
                let cancelButton = document.createElement('button');
                cancelButton.innerHTML = `<i class="fas fa-times"></i>`;
                cancelButton.classList.add('fORURcancelActionButton');
                cancelButton.addEventListener('click', async function(event){
                    await fetch('/api/friends', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            action: "cancel",
                            sender: request.user_1,
                            recipient: request.user_2
                        })
                    }).then(response => response.json().then(data => {
                        populateTables();
                    }));
                });
                actionsCell.appendChild(cancelButton);
                row.appendChild(actionsCell);
                outgoingTableBody.appendChild(row);
            });
        }

        let friendsTable = document.querySelector('#friendsTable');
        if (friendsTable) {
            let friendsTableBody = friendsTable.querySelector('tbody');
            friendsTableBody.innerHTML = '';
            friends.forEach(friend => {
                let row = document.createElement('tr');
                let icon = document.createElement('td');
                let name = document.createElement('td');
                icon.innerHTML = `<i class="fas fa-user-plus"></i>`;
                name.innerText = friend;
                row.appendChild(icon);
                row.appendChild(name);
                let actionsCell = document.createElement('td');
                let removeButton = document.createElement('button');
                removeButton.innerHTML = `<i class="fas fa-user-minus"></i>`;
                removeButton.classList.add('fORURremoveActionButton');
                removeButton.addEventListener('click', async function(event){
                    await fetch('/api/friends', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            action: "remove",
                            sender: friend,
                            recipient
                        })
                    }).then(response => response.json().then(data => {
                        populateTables();
                    }));
                });
                actionsCell.appendChild(removeButton);
                row.appendChild(actionsCell);
                friendsTableBody.appendChild(row);
            });
        }
    }));
}

populateTables();

if (document.querySelector('#addFriendSection')) {
    document.querySelector('#addFriendButton').addEventListener('click', async function(event){
        event.preventDefault();
        let friend = document.querySelector('#addFriendForm input').value;
        if (friend) {
            await fetch('/api/friends', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: "send",
                    recipient: friend
                })
            }).then(response => response.json().then(data => {
                console.log(data);
                populateTables();
            }));
        } else {
            console.error('No friend specified');
        }
    });
}