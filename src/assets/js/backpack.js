let selection = false;
let first = true;

async function updateBackpackData() {                                 
    await fetch('/api/me', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json().then(data => {
        console.log(data.user.items);
        
        let tbody = document.querySelector("#userItemsBody")
        tbody.innerHTML = "";
        let user = data.user;
        if (user.items === undefined) user.items = {};
        for (let [item, quantity] of Object.entries(user.items)) {
            let tr1 = document.createElement("tr");
            let td1 = document.createElement("td");
            let td2 = document.createElement("td");
            let td3 = document.createElement("td");
            let td4 = document.createElement("td");
            
            //Setup the checkbox
            td1.setAttribute("rowspan", "2");
            td1.classList.add("selectCell");
            let label = document.createElement("label");
            label.setAttribute("for", `${item}-Checkbox`);
            label.classList.add("sr-only");
            label.innerHTML = "Select";
            let input = document.createElement("input");
            input.setAttribute("type", "checkbox");
            input.setAttribute("name", "item");
            input.setAttribute("value", item);
            input.setAttribute("id", `${item}-Checkbox`);
            input.classList.add("itemCheckbox");
            td1.appendChild(label);
            td1.appendChild(input);
            
            //Setup the icon cell
            td2.setAttribute("rowspan", "2");
            td2.classList.add("iconCell");
            let img = document.createElement("img");
            img.classList.add("fa-sharp", "fa-square-dashed", "fa-2x");
            td2.appendChild(img);

            //Setup the name cell
            td3.classList.add("nameCell");
            let p = document.createElement("p");
            p.innerHTML = item;
            td3.appendChild(p);

            //Setup the actions cell
            td4.setAttribute("rowspan", "2");
            td4.classList.add("actionsCell");
            let form = document.createElement("form");
            form.setAttribute("id", "sellItemFormBackpack");
            let inputType = document.createElement("input");
            inputType.setAttribute("type", "hidden");
            inputType.setAttribute("name", "itemType");
            inputType.setAttribute("value", item);
            let div = document.createElement("div");
            div.classList.add("quickButtons");
            let button1 = document.createElement("button");
            button1.classList.add("quickSellButton");
            button1.setAttribute("id", "sellOne");
            button1.setAttribute("name", "sellOne");
            button1.innerHTML = "Sell One";
            let button2 = document.createElement("button");
            button2.classList.add("quickSellButton");
            button2.setAttribute("id", "sellAll");
            button2.setAttribute("name", "sellAll");
            button2.innerHTML = "Sell All";
            let button3 = document.createElement("button");
            button3.classList.add("quickClaimButton");
            button3.innerHTML = "Gift";
            div.appendChild(button1);
            div.appendChild(button2);
            div.appendChild(button3);
            form.appendChild(inputType);
            form.appendChild(div);
            td4.appendChild(form);

            tr1.appendChild(td1);
            tr1.appendChild(td2);
            tr1.appendChild(td3);
            tr1.appendChild(td4);
            tbody.appendChild(tr1);
                        
            //Setup the attributes cell
            let tr2 = document.createElement("tr");
            let td5 = document.createElement("td");
            let id = item.split(" ").join("_").replaceAll("'", "APOS").replaceAll("+", "PLUS");
            tr2.id = `item-${id}-Row`;
            td5.classList.add("attributesCell");
            let ul = document.createElement("ul");
            let li = document.createElement("li");
            li.id = "itemAmount";
            li.innerHTML = `Quantity: ${quantity}`;
            ul.appendChild(li);
            td5.appendChild(ul);

            tr2.appendChild(td5);
            tbody.appendChild(tr2);
        }
            
        if (Object.keys(user.items).length === 0) {
            let tr = document.createElement("tr");
            let td = document.createElement("td");
            td.setAttribute("colspan", "4");
            td.innerHTML = "You have no items.";
            tr.appendChild(td);
            tbody.appendChild(tr);
        }
        
        // // Items is an object with keys as item types and values as quantities
        // for(let itemType in items) {
        //     let quantity = items[itemType];
        //     let itemRow = document.querySelector(`#${itemType}-Row`);
        //     let itemQuantity = itemRow.querySelector("#itemAmount");
        //     if (itemQuantity != null) {
        //         itemQuantity.innerHTML = `Quantity: ${quantity}`;
        //     }
        // }
    }));

    updateListeners();
    updateDataSections(true);

}

function updateListeners() {
    if (first) {
        setupListeners();
        first = false;
    } else {
        destroyListeners();
        setupListeners();
    }
}


async function sellOneButtonListener(e, form) {
    e.preventDefault();
    const formData = new FormData(form);
    if (formData.get("itemType") != null){
        await fetch('/api/items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "action": "sell",
                "type": formData.get("itemType"),
                "amount": 1
            })
        }).then( response => {
            try {
                response.json().then(async (reply) => {
                    console.log(reply)
                    if (reply.success == false){
                        // new Notification("Hold on!", { body: reply.message });
                        //await window.electronAPI.newNotification("Error!", reply.message);
                        toast("Error!", reply.message, "fa-exclamation-triangle");
                    } else {
                        //await window.electronAPI.newNotification("Hurray!", `You sold 1 ${formData.get("itemType")} for ⵇ ${reply.profit}.`);
                        toast("Hurray!", `You sold 1 ${formData.get("itemType")} for ⵇ ${reply.profit}.`, "fa-coins");
                    }
                })
            } catch (error) {
                console.log(error)
            }
            console.log("items sold, updating data sections");
            updateBackpackData();
        });
    } else {
        alert("Please select an item and quantity to sell.");
    }
}

async function sellAllButtonListener(e, form) {
    e.preventDefault();
    const formData = new FormData(form);
    let itemRow = document.querySelector(`#item-${formData.get("itemType").replaceAll(" ", "_").replaceAll("'", "APOS").replaceAll("+", "PLUS")}-Row`);
    let itemQuantity = itemRow.querySelector("#itemAmount");
    if (formData.get("itemType") != null){
        await fetch('/api/items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "action": "sell",
                "type": formData.get("itemType"),
                "amount": itemQuantity.innerHTML.split(" ")[1]
            })
        }).then(response => {
            try {
                response.json().then(async (reply) => {
                    console.log(reply)
                    if (reply.success == false){
                        // new Notification("Hold on!", { body: reply.message });
                        //await window.electronAPI.newNotification("Error!", reply.message);
                        toast("Error!", reply.message, "fa-exclamation-triangle");
                    } else {
                        //await window.electronAPI.newNotification("Hurray!", `You sold ${itemQuantity.innerHTML.split(" ")[1]} ${formData.get("itemType")} for ⵇ ${reply.profit}.`);
                        toast("Hurray!", `You sold ${itemQuantity.innerHTML.split(" ")[1]} ${formData.get("itemType")} for ⵇ ${reply.profit}.`, "fa-coins");
                    }
                })
            } catch (error) {
                console.log(error)
            }
            console.log("items sold, updating data sections");
            updateBackpackData();
        });
    } else {
        alert("Please select an item and quantity to sell.");
    }
}

function selectAllButtonListener(e) {
    if(selection === false){
        selection = true;
        selectAllLabel.innerHTML = "Deselect All";
        
        let checkboxes = document.querySelectorAll("input[type=checkbox]");
        checkboxes.forEach((checkbox) => {
            if (checkbox.classList.contains("itemCheckbox")){
                checkbox.checked = true;
            }
        });
    } else {
        selection = false;
        selectAllLabel.innerHTML = "Select All";
        let checkboxes = document.querySelectorAll("input[type=checkbox]");
        checkboxes.forEach((checkbox) => {
            if (checkbox.classList.contains("itemCheckbox")){
                checkbox.checked = false;
            }
        });
    }
}

function promiseToSell(items, amounts) {
    // Ace has decreed that we must sell items one by one or else the server will
    // return the wrong messages because we asked too fast.
    return new Promise((resolve, reject) => {
        let it_len = items.length;
        let profits = 0;

        function next(it){
            fetch('/api/items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "action": "sell",
                    "type": items[it],
                    "amount": amounts[it]
                })
            }).then(response => {
                response.json().then((reply) => {
                    console.log(reply);
                    if (reply.success == false) {
                        // Do nothing
                    } else {
                        console.log("Adding profit");
                        console.log(reply.profit);
                        profits += reply.profit;
                        console.log(profits);
                    }
                    if (it == it_len-1) {
                        resolve(profits);
                    } else {
                        next(it+1);
                    }
                });
            });
        };
        next(0);
    });
}

async function quickSellAllButtonListener(e) {
    e.preventDefault();
    let checkboxes = document.querySelectorAll("input[type=checkbox]:checked");
    let items = [];
    let amounts = [];
    checkboxes.forEach((checkbox) => {
        if (checkbox.classList.contains("itemCheckbox")){
            items.push(checkbox.value);
        }
    });
    console.log(items);
    if (items.length > 0) {
        let promises = [];
        for (let i = 0; i < items.length; i++) {
            let search = `#item-${items[i].replaceAll(" ", "_").replaceAll("'", "APOS").replaceAll("+", "PLUS")}-Row`;
            let itemRow = document.querySelector(search);
            let itemQuantity = itemRow.querySelector("#itemAmount");
            amounts.push(itemQuantity.innerHTML.split(" ")[1]);
        }
        await promiseToSell(items, amounts).then(async (profits) => {
            let msgs = [];
            for (let i = 0; i < items.length; i++) {
                msgs.push(`${amounts[i]} ${items[i]}`);
            }
            let msg = msgs.join(", ");
            //await window.electronAPI.newNotification("Hurray!", `You sold ${msg} for ⵇ ${profits}.`);
            toast("Hurray!", `You sold ${msg} for ⵇ ${profits.toFixed(2)}.`, "fa-coins");
            updateBackpackData();
        });
        
        console.log("items sold, updating data sections");
    } else {
        alert("Please select an item and quantity to sell.");
    }
}

function setupListeners() {
    let sellForms = document.querySelectorAll("#sellItemFormBackpack");

    sellForms.forEach((form) => {
        //console.log(form);
        let sellOneButton = form.querySelector("#sellOne"); 
        let sellAllButton = form.querySelector("#sellAll");
        sellOneButton.addEventListener("click", (e) => {
            sellOneButtonListener(e, form);
        });

        sellAllButton.addEventListener("click", (e) => { 
            sellAllButtonListener(e, form)
        });
    });

    // Select all button
    let selectAllButton = document.querySelector("#selectAllItem");
    let selectAllLabel = document.querySelector("#selectAllLabel");
    selection = false;
    selectAllLabel.innerHTML = "Select All";
    selectAllButton.checked = false;
    let checkboxes = document.querySelectorAll("input[type=checkbox]");
    checkboxes.forEach((checkbox) => {
        if (checkbox.classList.contains("itemCheckbox")){
            checkbox.checked = false;
        }
    });
    selectAllButton.addEventListener("click", selectAllButtonListener);

    let quickSellAllButton = document.querySelector("#quickSellButton");
    quickSellAllButton.addEventListener("click", quickSellAllButtonListener);
}

function destroyListeners() {
    let sellForms = document.querySelectorAll("#sellItemFormBackpack");

    sellForms.forEach((form) => {
        //console.log(form);
        let sellOneButton = form.querySelector("#sellOne"); 
        let sellAllButton = form.querySelector("#sellAll");
        sellOneButton.removeEventListener("click", (e) => {
            sellOneButtonListener(e, form);
        });

        sellAllButton.removeEventListener("click", (e) => { 
            sellAllButtonListener(e, form)
        });
    });

    // Select all button
    let selectAllButton = document.querySelector("#selectAllItem");
    let selectAllLabel = document.querySelector("#selectAllLabel");
    selectAllButton.removeEventListener("click", selectAllButtonListener);

    let quickSellAllButton = document.querySelector("#quickSellButton");
    quickSellAllButton.removeEventListener("click", quickSellAllButtonListener);
}


// setupListeners();
updateBackpackData();




