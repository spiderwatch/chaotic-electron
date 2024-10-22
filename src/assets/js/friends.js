
async function populateTables(){
    await fetch('/api/friends', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json().then(data => {
        console.log("LOOK AT ME", data);
        let { friends, inbound_requests, outbound_requests } = data;

        let incomingTable = document.querySelector('#incomingRequestsTable');
        let outgoingTable = document.querySelector('#outgoingRequestsTable');
        let friendsTable = document.querySelector('#friendsTable');

        let incomingTableBody = incomingTable.querySelector('tbody');
        let outgoingTableBody = outgoingTable.querySelector('tbody');
        let friendsTableBody = friendsTable.querySelector('tbody');

        incomingTableBody.innerHTML = '';
        outgoingTableBody.innerHTML = '';
        friendsTableBody.innerHTML = '';

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
            incomingTableBody.appendChild(row);        
        });

        outbound_requests.forEach(request => {
            let row = document.createElement('tr');
            let icon = document.createElement('td');
            let name = document.createElement('td');
            icon.innerHTML = `<i class="fas fa-user-plus"></i>`;
            name.innerText = request.user_2;
            row.appendChild(icon);
            row.appendChild(name);
            let cancel = document.createElement('td');
            let cancelButton = document.createElement('button');
            cancelButton.innerHTML = `<i class="fas fa-times"></i>`;
            cancel.appendChild(cancelButton);
            row.appendChild(cancel);
            outgoingTableBody.appendChild(row);
        });

        friends.forEach(friend => {
            let row = document.createElement('tr');
            let icon = document.createElement('td');
            let name = document.createElement('td');
            icon.innerHTML = `<i class="fas fa-user-plus"></i>`;
            name.innerText = friend;
            row.appendChild(icon);
            row.appendChild(name);
            friendsTableBody.appendChild(row);
        });

    }));
}

populateTables();