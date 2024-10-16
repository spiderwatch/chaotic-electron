/*

    Welcome to the game client. I'm so sorry if you were looking for master craftsmanship.

    The main function of the client is to regularly interface with Chaotic Capital's APIs to keep the info on the page up to date.
    Could this be done better? Absolutely. Am I going to do it better? Absolutely not. To Oracle's office with you for even suggesting it.
    WebSockets? Pfft. Who needs 'em. We're going to poll the server every minute like it's 2005.

    OH! And I wrote all of this after midnight on a Wednesday. So, you know, it's probably garbage. Enjoy!


    To-dos:
     - Global Stat Handlers
         - .balance
         - .netWorth
         - .netWorthRank
         - .nwChange
     - Backpack Card Generation
     - Item Sell Card <option> Generation
     - Item Sell Card <input> Manager
     - Item Sell As Specified event handler
     - Item Sell All event handler
     - WorkersAggregate Card Generation
     - Worker Hire Card <option> Generation
     - Worker Hire Card <input> Manager (need quantity added to API!!!!)
     - WorkerClaimable Card Generation
     - Claim all event handler
     - UserCard (dash) info generation
         - Stat Emblems
     - To Next Rank Card Generation
     - LB Card Generation
     - Worker Prices object auto-generation (need to add to API!!!!)
     - Item Prices object auto-generation (need to add to API!!!!)

*/

// Global Variables
let user = {};
let items = {};
let workers = {};
let leaderboard = {};
let apiPollingInterval = 60000;
let apiPolling;

// API Polling
async function pollAPI(route) {
    switch (route) {
        case "user":
            console.log("waiting for user data")
            let userReq = await fetch('/api/me').then((res) => res.json()).then((data) => {
                user = data.user;
                user["nextWorkerClaim"] = data.nextWorkerClaim;
            });
            console.log("user data received")
            break;
        case "items":
            console.log("waiting for items data")
            let itemsReq = await fetch('/api/items').then((res) => res.json()).then((data) => {
                items = data.items;
            });
            console.log("items data received")
            break;
        case "workers":
            console.log("waiting for workers data")
            let workersReq = await fetch('/api/workers').then((res) => res.json()).then((data) => {
                workers = data;
            });
            console.log("workers data received")
            break;
        case "leaderboard":
            console.log("waiting for leaderboard data")
            let leaderboardReq = await fetch('/api/leaderboard').then((res) => res.json()).then((data) => {
                leaderboard = data.leaderboard;
            });
            console.log("leaderboard data received")
            break;
        default:
            break;
    }
}

// Global Stat Handlers
async function updateBalance() {
    console.log("updating balance to " + user.balance)
    document.querySelectorAll('.balance').forEach((el) => {
        el.innerText = user.balance.toLocaleString({ style: 'currency', currency: 'USD' });
    });
}

async function updateNetWorth() {
    console.log("updating net worth to " + user.netWorth)
    document.querySelectorAll('.netWorth').forEach((el) => {
        el.innerText = leaderboard.netWorthActual.toLocaleString({ style: 'currency', currency: 'USD' });
    });
}

async function updateNetWorthRank() {
    if (document.querySelector('.netWorthRank') == null) return;
    console.log("updating net worth rank to " + leaderboard.nwRank)
    document.querySelectorAll('.netWorthRank').forEach((el) => {
        el.innerText = leaderboard.nwRank.toLocaleString();
    });

    if (document.querySelector('.nwStatEmblem') == null) return;
    if (leaderboard.nwRank == 1) {
        console.log("user is rank 1, setting stat emblem.");
        document.querySelector('.nwStatEmblem svg').classList.remove('third');
        document.querySelector('.nwStatEmblem svg').classList.remove('second');
        document.querySelector('.nwStatEmblem svg').classList.add('first');
        document.querySelector('.nwStatEmblem svg').classList.remove('fa-ellipsis');
        document.querySelector('.nwStatEmblem svg').classList.remove('fa-medal');
        document.querySelector('.nwStatEmblem svg').classList.add('fa-crown');
    } else if (leaderboard.nwRank == 2) {
        console.log("user is rank 2, setting stat emblem.");
        document.querySelector('.nwStatEmblem svg').classList.remove('first');
        document.querySelector('.nwStatEmblem svg').classList.remove('third');
        document.querySelector('.nwStatEmblem svg').classList.add('second');
        document.querySelector('.nwStatEmblem svg').classList.remove('fa-ellipsis');
        document.querySelector('.nwStatEmblem svg').classList.remove('fa-crown');
        document.querySelector('.nwStatEmblem svg').classList.add('fa-medal');
    } else if (leaderboard.nwRank == 3) {
        console.log("user is rank 3, setting stat emblem.");
        document.querySelector('.nwStatEmblem svg').classList.remove('first');
        document.querySelector('.nwStatEmblem svg').classList.remove('second');
        document.querySelector('.nwStatEmblem svg').classList.add('third');
        document.querySelector('.nwStatEmblem svg').classList.remove('fa-ellipsis');
        document.querySelector('.nwStatEmblem svg').classList.remove('fa-crown');
        document.querySelector('.nwStatEmblem svg').classList.add('fa-medal');
    } else {
        console.log("user is not in the top 3, hiding stat emblem.");
        document.querySelector('.nwStatEmblem svg').classList.remove('first');
        document.querySelector('.nwStatEmblem svg').classList.remove('second');
        document.querySelector('.nwStatEmblem svg').classList.remove('third');
        document.querySelector('.nwStatEmblem svg').classList.remove('fa-crown');
        document.querySelector('.nwStatEmblem svg').classList.remove('fa-medal');
        document.querySelector('.nwStatEmblem svg').classList.remove('fa-ellipsis');
    }
}

async function updateNetWorthChange() {
    console.log("updating net worth change to " + leaderboard.netWorthChange)
    document.querySelectorAll('.nwChange').forEach((el) => {
        el.innerText = leaderboard.netWorthChange.toLocaleString({ style: 'currency', currency: 'USD' });
    });
}

// Backpack Card Generation
let backpackCard = document.querySelector("#itemsSection")

async function generateBackpackCard() {
    if (backpackCard == null) return;
    console.log("generating backpack card")
    let thisTable = backpackCard.querySelector("table");
    thisTable.innerHTML = "";
    if (user.items) {
        let tableHead = document.createElement("thead");
        let tableBody = document.createElement("tbody");
        let tableHeadRow = document.createElement("tr");

        tableHeadRow.innerHTML = "<th>Item</th><th>Quantity</th><th>Price</th>";
        tableHead.appendChild(tableHeadRow);

        let userItemTypes = Object.keys(user.items);
        let totalValue = 0;
        for (let item in items) {
            if (!userItemTypes.includes(item)) continue;
            let quantity = user.items[item];
            let realPrice = items[item];
            let price = realPrice
            if (typeof realPrice != typeof 1){
                price = 0
            }
            totalValue += quantity * price;
            if (typeof realPrice !== typeof 1) {
                price = "N/S";
            }
            tableBody.innerHTML += `<tr><td class="left">${item}</td><td class="right">${quantity}</td><td class="left">${price}</td></tr>`;
        }

        totalValue = totalValue * 0.8;
        tableBody.innerHTML += `<tr><td class="right" colspan="2">Total value:</td><td class="left">${totalValue.toLocaleString({style: "currency", currency:"USD"})}</td></tr>`;

        thisTable.appendChild(tableHead);
        thisTable.appendChild(tableBody);
    } else {
        thisTable.innerHTML = "<tr><td colspan=\"3\">You have no items in your backpack.</td></tr>";
    }
}

// Item Sell Card <option> Generation
let itemSellCard = document.querySelector("#itemSellSection");

async function generateItemSellCard() {
    if (itemSellCard){
        let thisSelect = itemSellCard.querySelector("select");
        let totalItems = 0;

        function selectCallback(){
            let thisInput = itemSellCard.querySelector("input");

            if (!user.items) {
                thisInput.placeholder = "You have no items to sell.";
                return;
            }

            if (totalItems == 0) {
                thisInput.placeholder = "You have no items to sell.";
                return;
            }

            if (thisSelect.value == "") {
                thisInput.placeholder = "Select an item...";
                return;
            }

            let selectedQuantity = user.items[thisSelect.value];
            thisInput.value = 0;
            thisInput.type = "number";
            thisInput.min = 0;
            thisInput.max = selectedQuantity;
            thisInput.step = 1;
            thisInput.removeAttribute("disabled");
        }

        thisSelect.removeEventListener("change", selectCallback);
        
        if (user.items) {
            thisSelect.innerHTML = "<option value=\"\" selected disabled>Select an item...</option>";
            let userItemTypes = Object.keys(user.items);
            for (let item of userItemTypes) {
                if (items[item] == null) continue;
                let quantity = user.items[item];
                let option = document.createElement("option");
                option.value = item;
                option.innerText = `${item}`;
                thisSelect.appendChild(option);
                totalItems += quantity;
            }
            if (totalItems > 0) {
                thisSelect.removeAttribute("disabled");
            } else {
                thisSelect.innerHTML = "<option value=\"\">You have no items to sell.</option>";
            }
        } else {
            thisSelect.innerHTML = "<option value=\"\">You have no items to sell.</option>";
        }

        thisSelect.addEventListener("change", selectCallback);
        selectCallback();
    }
}

// Item Sell Card <input> Manager - handled by generateItemSellCard

// Item Sell As Specified event handler
if (itemSellCard) {
    let sellItemButton = itemSellCard.querySelector("#sellItemSubmit"); 
    let itemForm = itemSellCard.querySelector("form");

    sellItemButton.addEventListener("click", async function(e) {
        e.preventDefault();
        const formData = new FormData(itemForm);
        if (formData.get("itemType") != null && formData.get("itemQuantity") != 0){
            await fetch('/api/items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "action": "sell",
                    "type": formData.get("itemType"),
                    "amount": parseInt(formData.get("itemQuantity"))
                })
            }).then(() => {
                console.log("items sold, updating data sections");
                updateDataSections(true);
            });
        } else {
            alert("Please select an item and quantity to sell.");
        }
    });


    // Item Sell All event handler
    let sellAllButton = itemSellCard.querySelector("#sellAllItemsSubmit");

    sellAllButton.addEventListener("click", async function(e) {
        e.preventDefault();
        await fetch('/api/items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "action": "sell",
                "type": "All"
            })
        }).then(() => {
            console.log("all items sold, updating data sections");
            updateDataSections(true);
        });
    });
}

// WorkersAggregate Card Generation
let workersAggregateCard = document.querySelector("#workersSection");

async function generateWorkersAggregateCard() {
    if (workersAggregateCard){
        let thisTable = workersAggregateCard.querySelector("table");
        thisTable.innerHTML = "";
        if (workers) {
            let tableHead = document.createElement("thead");
            let tableBody = document.createElement("tbody");
            let tableHeadRow = document.createElement("tr");

            tableHeadRow.innerHTML = "<th>Worker</th><th>Quantity</th><th>Price</th>";
            tableHead.appendChild(tableHeadRow);

            let parsedWorkers = {}

            let workerTypes = Object.keys(workers.global);
            workerTypes.forEach((worker) => {
                parsedWorkers[worker] = {
                    quantity: 0,
                    price: workers.global[worker]
                };
            });

            workers.user.forEach((worker) => {
                parsedWorkers[worker.name].quantity += 1;
            });

            let totalFeesPaid = 0;
            for (let worker in parsedWorkers) {
                if (parsedWorkers[worker].quantity == 0) continue;
                let quantity = parsedWorkers[worker].quantity;
                let price = parsedWorkers[worker].price;
                totalFeesPaid += quantity * price;
                tableBody.innerHTML += `<tr><td class="left">${worker}</td><td class="right">${quantity}</td><td class="left">${price}</td></tr>`;
            }
            tableBody.innerHTML += `<tr><td class="right" colspan="2">Total fees paid:</td><td class="left">${totalFeesPaid.toLocaleString()}</td></tr>`;

            thisTable.appendChild(tableHead);
            thisTable.appendChild(tableBody);
        } else {
            thisTable.innerHTML = "<tr><td>You have no workers.</td></tr>";
        }
    }
}

// Worker Hire Card <option> Generation
let workerHireCard = document.querySelector("#workerHireSection");

async function generateWorkerHireCard() {
    if (workerHireCard == null) return;
    let thisSelect = workerHireCard.querySelector("select");
    let totalWorkers = 0;

    function selectCallback(){
        let thisInput = workerHireCard.querySelector("input");

        if (!workers.global) {
            thisInput.placeholder = "You have no workers to hire.";
            return;
        }

        if (totalWorkers == 0) {
            thisInput.placeholder = "You have no workers to hire.";
            return;
        }

        if (thisSelect.value == "") {
            thisInput.placeholder = "Select a worker...";
            return;
        }

        thisInput.value = 0;
        thisInput.type = "number";
        thisInput.min = 0;
        thisInput.max = Math.floor(user.balance / workers.global[thisSelect.value]);
        thisInput.step = 1;
        thisInput.removeAttribute("disabled");
    }

    thisSelect.removeEventListener("change", selectCallback);
    
    if (workers.global) {
        thisSelect.innerHTML = "<option value=\"\" selected disabled>Select a worker...</option>";
        let workerTypes = Object.keys(workers.global);
        for (let worker of workerTypes) {
            if (workers.global[worker] == null) continue;
            let option = document.createElement("option");
            option.value = worker;
            option.innerText = `${worker} - ⵇ ${workers.global[worker].toLocaleString()}`;
            thisSelect.appendChild(option);
            totalWorkers += 1;
        }
        if (totalWorkers > 0) {
            thisSelect.removeAttribute("disabled");
        } else {
            thisSelect.innerHTML = "<option value=\"\">You have no workers to hire.</option>";
        }
    } else {
        thisSelect.innerHTML = "<option value=\"\">You have no workers to hire.</option>";
    }

    thisSelect.addEventListener("change", selectCallback);
    selectCallback();
}

// Worker Hire Card <input> Manager - handled by generateWorkerHireCard

// Worker Hire event handler
if (workerHireCard){
    let hireWorkerButton = workerHireCard.querySelector("#hireWorkerSubmit");

    hireWorkerButton.addEventListener("click", async function(e) {
        e.preventDefault();
        const formData = new FormData(workerHireCard.querySelector("form"));
        if (formData.get("workerType") != null && formData.get("workerQuantity") != 0){
            await fetch('/api/workers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "action": "hire",
                    "type": formData.get("workerType"),
                    "amount": parseInt(formData.get("workerQuantity"))
                })
            }).then(() => {
                console.log("workers hired, updating data sections");
                updateDataSections(true);
            });
        } else {
            alert("Please select a worker and quantity to hire.");
        }
    });
}

// nextClaim timer generation
let nextClaimTimer;
let nextClaimCached;
let nextClaimTimerInterval = 1000;
let nextClaimTimerID;

function updateNextClaimTimer() {
    if (nextClaimTimer == null) console.log("timer not found?");
    if (nextClaimTimer == null) return;
    if (nextClaimTimerID && nextClaimCached == user.nextWorkerClaim) return;
    else if (nextClaimTimerID) clearInterval(nextClaimTimerID);
    nextClaimCached = user.nextWorkerClaim;
    nextClaimTimerID = setInterval(updateNextClaimTimer, nextClaimTimerInterval);

    let thisDate = new Date();
    let nextClaim = new Date(user.nextWorkerClaim);
    if (nextClaim <= thisDate) {
        nextClaimTimer.innerText = "Ready to claim!";
        clearInterval(nextClaimTimerID);
        nextClaimTimerID = null;
        return;
    } else {
        nextClaimTimerID = setInterval(() => {
            let thisDate = new Date();
            let timeDiff = nextClaim - thisDate;
            if (timeDiff <= 0) {
                nextClaimTimer.innerText = "Ready to claim!\n";
                nextClaimTimer.innerHTML += "<i class=\"fa-sharp fa-solid fa-ellipsis fa-flip fa-beat-fade fa-2x\"></i>";
                clearInterval(nextClaimTimerID);
                nextClaimTimerID = null;
                updateDataSections(true);
                return;
            }
            // let timeString = "Your next worker will be ready for claim in:\n<HH> hours, <MM> minutes, and <SS> seconds.";
            let timeString = "Your next worker will be ready for claim in:\n";
            let hours = Math.floor(timeDiff / 3600000);
            if (hours > 0) timeString += `${hours} hours, `;
            timeDiff -= hours * 3600000;
            let minutes = Math.floor(timeDiff / 60000);
            if (minutes > 0) timeString += `${minutes} minute`;
            if (minutes > 1) timeString += "s";
            if (hours > 0) timeString += ", ";
            if (minutes > 0) timeString += " and ";
            timeDiff -= minutes * 60000;
            let seconds = Math.floor(timeDiff / 1000);
            timeString += `${seconds} second`;
            if (seconds != 1) timeString += "s";
            timeString += ".";
            nextClaimTimer.innerText = timeString;
        }, nextClaimTimerInterval);
        console.log("timer started");
    }
}

// WorkerClaimable Card Generation
let workerClaimableCard = document.querySelector("#workersClaimSection");
let cachedWorkersClaimable;

async function generateWorkerClaimableCard() {
    if (workerClaimableCard == null) return;
    let thisTable = workerClaimableCard.querySelector("table");
    if (workers.user) {
        let claimableWorkers = {};
        let totalClaimable = 0;
        let thisDate = new Date();
        workers.user.forEach((worker) => {
            if (new Date(worker.nextClaim) <= thisDate) {
                if (claimableWorkers[worker.name]) {
                    claimableWorkers[worker.name] += 1;
                } else {
                    claimableWorkers[worker.name] = 1;
                }
                totalClaimable += 1;
            }
        });

        if (totalClaimable == cachedWorkersClaimable && user.nextWorkerClaim == nextClaimCached) return;
        cachedWorkersClaimable = totalClaimable;

        if (totalClaimable == 0) {
            thisTable.innerHTML = "<tr><td colspan=\"3\">You have no workers ready to be claimed from.</td></tr><tr><td class=\"claimTimerCell\"><i class=\"fa-sharp fa-solid fa-ellipsis fa-flip fa-beat-fade fa-2x\"></i></td></tr>";
            nextClaimTimer = thisTable.querySelector(".claimTimerCell");
            updateNextClaimTimer();
            return;
        }

        let tableHead = document.createElement("thead");
        let tableBody = document.createElement("tbody");
        let tableHeadRow = document.createElement("tr");

        tableHeadRow.innerHTML = "<th>Worker</th><th>Amount Ready to Claim</th>";
        tableHead.appendChild(tableHeadRow);

        thisTable.innerHTML = "";
        let workerTypes = Object.keys(claimableWorkers);
        for (let worker of workerTypes) {
            let quantity = claimableWorkers[worker];
            tableBody.innerHTML += `<tr><td class="left">${worker}</td><td class="right">${quantity}</td></tr>`;
        }

        thisTable.appendChild(tableHead);
        thisTable.appendChild(tableBody);
    } else {
        thisTable.innerHTML = "<tr><td colspan=\"3\">You have no workers to claim from.</td></tr>";
    }
}

// Claim all event handler
let claimWorkerCard = document.querySelector("#workerClaimSection");
let claimAllButton;
if (claimWorkerCard) claimAllButton = claimWorkerCard.querySelector("#claimWorkerSubmit");

if (claimAllButton){
    claimAllButton.addEventListener("click", async function(e) {
        e.preventDefault();
        await fetch('/api/workers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "action": "claim",
                "claimType": "quickAll"
            })
        }).then(() => {
            console.log("all workers claimed, updating data sections");
            updateDataSections(true);
        });
    });
}

// UserCard (dash) info generation - handled by global stat handlers

// To Next Rank Card Generation - handled by global stat handlers

// LB Card Generation
let lbCard = document.querySelector("#leaderboardByNetWorthSection");

async function generateLBCard() {
    if (lbCard == null) return;
    let thisTable = lbCard.querySelector("table");
    thisTable.innerHTML = "";
    if (leaderboard) {
        let tableHead = document.createElement("thead");
        let tableBody = document.createElement("tbody");
        let tableHeadRow = document.createElement("tr");

        tableHeadRow.innerHTML = "<th>Rank</th><th>User</th><th>Net Worth</th>";
        tableHead.appendChild(tableHeadRow);

        let lbData = leaderboard.netWorth;
        for (let i = 0; i < lbData.length; i++) {
            let user = lbData[i];
            let rank = i + 1;
            let netWorth = user.netWorth.toLocaleString({ style: 'currency', currency: 'USD' });
            tableBody.innerHTML += `<tr><td class="right">${rank}</td><td class="left">${user.screenName}</td><td class="left">${netWorth}</td></tr>`;
        }

        thisTable.appendChild(tableHead);
        thisTable.appendChild(tableBody);
    } else {
        thisTable.innerHTML = "<tr><td colspan=\"3\">Leaderboard data is not available.</td></tr>";
    }
}

// Worker Prices object auto-generation (need to add to API!!!!) - handled by API

// Item Prices object auto-generation (need to add to API!!!!) - handled by API

// function to update data sections
async function updateDataSections(pollBefore = false) {
    if (pollBefore) {
        await Promise.all([
            pollAPI("user"),
            pollAPI("items"),
            pollAPI("workers"),
            pollAPI("leaderboard")
        ]);
    }
    await Promise.all([
        updateBalance(),
        updateNetWorth(),
        updateNetWorthRank(),
        updateNetWorthChange(),
        generateBackpackCard(),
        generateItemSellCard(),
        generateWorkersAggregateCard(),
        generateWorkerHireCard(),
        generateWorkerClaimableCard(),
        generateLBCard(),
    ]);
}

// poll API on startup
async function startAPIPolling() {
    if (apiPolling) {
        console.log("API polling already started.");
        return;
    }

    await Promise.all([
        pollAPI("user"),
        pollAPI("items"),
        pollAPI("workers"),
        pollAPI("leaderboard")
    ]);

    updateDataSections();

    apiPolling = setInterval(updateDataSections, apiPollingInterval);
};

startAPIPolling();

// function to pause API polling
function pauseAPIPolling() {
    clearInterval(apiPolling);
}