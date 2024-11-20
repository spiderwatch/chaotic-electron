function populateOutgoing(outgoingReqs){
    let outgoingLength = outgoingReqs.length;
    let outgoingTable = document.querySelector('#outgoingRequestsTable');
    let outgoingTableBody = document.createElement('tbody');
    return new Promise((resolve, reject) => {
        if (outgoingLength == 0 || outgoingTable == null){
            resolve();
        } else {
            console.log("EXEC OUTGOING");
            function next(i){
                fetch('/api/assets', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        target: outgoingReqs[i].user_2
                    })
                }).then(response => response.json()).then((userIconSet) => {
                    let row = document.createElement('tr');
                    let icon = document.createElement('td');
                    let name = document.createElement('td');
                    console.log(userIconSet);
                    icon.innerHTML = `<img src="${userIconSet.profileImage}" alt="${outgoingReqs[i].user_2}'s profile image">`;
                    name.innerText = outgoingReqs[i].user_2;
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
                                sender: outgoingReqs[i].user_1,
                                recipient: outgoingReqs[i].user_2
                            })
                        }).then(response =>  {
                            try {
                                response.json().then(async (reply) => {
                                    console.log(reply)
                                    if (reply.success == false){
                                        // new Notification("Hold on!", { body: reply.message });
                                        await window.electronAPI.newNotification("Hold on!", reply.message);
                                    } else {
                                        await window.electronAPI.newNotification("Hurray!", reply.message);
                                    }
                                })
                            } catch (error) {
                                console.log(error)
                            }
                            populateTables();
                        });
                    });
                    actionsCell.appendChild(cancelButton);
                    row.appendChild(actionsCell);
                    outgoingTableBody.appendChild(row);
                    if (i < outgoingLength - 1){
                        next(i + 1);
                    } else {
                        outgoingTable.innerHTML = '';
                        outgoingTable.appendChild(outgoingTableBody);
                        resolve();
                    }
                });
            }
            next(0);
        }
    });
}

function populateIncoming(incomingReqs){
    let incomingLength = incomingReqs.length;
    let incomingTable = document.querySelector('#incomingRequestsTable');
    let incomingTableBody = document.createElement('tbody');
    return new Promise((resolve, reject) => {
        if (incomingLength == 0 || incomingTable == null){
            resolve();
        } else {
            console.log("EXEC INCOMING");
            function next(i){
                fetch('/api/assets', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        target: incomingReqs[i].user_1
                    })
                }).then(response => response.json()).then((userIconSet) => {
                    let row = document.createElement('tr');
                    let icon = document.createElement('td');
                    let name = document.createElement('td');
                    console.log(userIconSet);
                    icon.innerHTML = `<img src="${userIconSet.profileImage}" alt="${incomingReqs[i].user_1}'s profile image" loading="lazy" class="fURuserIcon">`;
                    name.innerText = incomingReqs[i].user_1;
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
                                sender: incomingReqs[i].user_1,
                                recipient: incomingReqs[i].user_2
                            })
                        }).then(response =>  {
                            try {
                                response.json().then(async (reply) => {
                                    console.log(reply)
                                    if (reply.success == false){
                                        // new Notification("Hold on!", { body: reply.message });
                                        await window.electronAPI.newNotification("Hold on!", reply.message);
                                    } else {
                                        await window.electronAPI.newNotification("Hurray!", reply.message);
                                    }
                                })
                            } catch (error) {
                                console.log(error)
                            }
                            populateTables();
                        });
                    });
                    actionsCell.appendChild(cancelButton);
                    row.appendChild(actionsCell);
                    incomingTableBody.appendChild(row);

                    if (i < incomingLength - 1){
                        next(i + 1);
                    } else {
                        incomingTable.innerHTML = '';
                        incomingTable.appendChild(incomingTableBody);
                        resolve();
                    }
                });
            }
            next(0);
        }
    });
}

function populateFriends(friends){
    console.log(friends);
    let friendsLength = friends.list.length;
    let friendsTable = document.querySelector('#friendsTable');
    let friendsTableBody = document.createElement('tbody');
    return new Promise((resolve, reject) => {
        if (friendsLength == 0 || friendsTable == null){
            resolve();
        } else {
            console.log("EXEC FRIENDS");
            function next(i){
                fetch('/api/assets', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        target: friends.list[i]
                    })
                }).then(response => response.json()).then((userIconSet) => {
                    let row = document.createElement('tr');
                    let icon = document.createElement('td');
                    let name = document.createElement('td');
                    console.log(userIconSet);
                    icon.innerHTML = `<img src="${userIconSet.profileImage}" alt="${friends.list[i]}'s profile image">`;
                    name.innerText = friends.list[i];
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
                                action: "remove",
                                sender: friends.entries[i].user_1,
                                recipient: friends.entries[i].user_2
                            })
                        }).then(response =>  {
                            try {
                                response.json().then(async (reply) => {
                                    console.log(reply)
                                    if (reply.success == false){
                                        // new Notification("Hold on!", { body: reply.message });
                                        await window.electronAPI.newNotification("Hold on!", reply.message);
                                    } else {
                                        await window.electronAPI.newNotification("Hurray!", reply.message);
                                    }
                                })
                            } catch (error) {
                                console.log(error)
                            }
                            populateTables();
                        });
                    });
                    actionsCell.appendChild(cancelButton);
                    row.appendChild(actionsCell);
                    friendsTableBody.appendChild(row);

                    if (i < friendsLength - 1){
                        next(i + 1);
                    } else {
                        friendsTable.innerHTML = '';
                        friendsTable.appendChild(friendsTableBody);
                        resolve();
                    }
                });
            }
            next(0);
        }
    });
}

async function populateTables(){
    await fetch('/api/friends', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json().then(async data => {
        let { friends, inbound_requests, outbound_requests } = data;
        await populateIncoming(inbound_requests);
        await populateOutgoing(outbound_requests);
        await populateFriends(friends);
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
            }).then(response => {
                console.log(window)
                try {
                    response.json().then(async (reply) => {
                        console.log(reply)
                        if (reply.success == false){
                            // new Notification("Hold on!", { body: reply.message });
                            await window.electronAPI.newNotification("Hold on!", reply.message);
                        } else {
                            await window.electronAPI.newNotification("Hurray!", reply.message);
                        }
                    })
                } catch (error) {
                    console.log(error)
                }
                populateTables();
            });
        } else {
            console.error('No friend specified');
        }
    });
}