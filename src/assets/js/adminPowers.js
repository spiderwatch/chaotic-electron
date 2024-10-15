// function callAPI(action, type, claimType, workerId, item, timeOverride, adminOverride){
// }
const form = document.forms["adminPowers"];

form.onsubmit = async function(e){
    e.preventDefault();

    let adminStatus = document.getElementById('adminStatus')
    let adminMsg = document.getElementById('adminMsg')
    let targetUser = document.getElementById('targetUser')

    if(form.scope.value == 'worker'){
        let claimType = null;

        if(this.type.value == 'all' || this.type.value == 'All' || this.type.value == 'quickAll'){
            claimType = 'quickAll'
        } else {
            claimType = 'quickType'
        }

        let req = await fetch('https://oracle.acethewildfire.me/api/workers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "action": this.action.value,
                "claimType": claimType,
                "type": this.type.value,
                "timeOverride": this.timeOverride.checked,
                "target": targetUser.value,
            })
        })

        let res = await req.json()
        adminStatus.innerText = res.success
        adminMsg.innerText = res.message

    } else if(form.scope.value == 'item'){
        let req = await fetch('https://oracle.acethewildfire.me/api/items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "action": this.action.value,
                "type": this.type.value,
                "amount": parseInt(this.number.value),
                "adminOverride": this.adminOverride.checked,
                "target": targetUser.value,
            })
        })

        let res = await req.json()
        adminStatus.innerText = res.success
        adminMsg.innerText = res.message
    }

    updateUserInfo();
}
//document.getElementById('testButton').addEventListener('click', test)

document.getElementById('scope').addEventListener('change', event => {
    let scope = document.getElementById('scope')
    let actionContainer = document.getElementById('actionContainer')
    let action = document.getElementById('action')
    if(scope.value == 'worker'){
        actionContainer.hidden = false
        action.innerHTML = ''
        let opt0 = document.createElement('option')
        opt0.value = ''
        opt0.innerText = 'Select an action'
        opt0.selected = true
        opt0.disabled = true
        opt0.hidden = true
        let opt1 = document.createElement('option')
        opt1.value = 'claim'
        opt1.innerText = 'Claim'
        let opt2 = document.createElement('option')
        opt2.value = 'hire'
        opt2.innerText = 'Hire'
        let opt3 = document.createElement('option')
        opt3.value = 'fire'
        opt3.innerText = 'Fire'

        action.appendChild(opt0)
        action.appendChild(opt1)
        action.appendChild(opt2)
        action.appendChild(opt3)

    } else if (scope.value == 'item'){
        actionContainer.hidden = false
        action.innerHTML = ''
        let opt0 = document.createElement('option')
        opt0.value = ''
        opt0.innerText = 'Select an action'
        opt0.selected = true
        opt0.disabled = true
        opt0.hidden = true
        let opt1 = document.createElement('option')
        opt1.value = 'buy'
        opt1.innerText = 'Buy'
        let opt2 = document.createElement('option')
        opt2.value = 'sell'
        opt2.innerText = 'Sell'

        action.appendChild(opt0)
        action.appendChild(opt1)
        action.appendChild(opt2)
        
    } else {
        actionContainer.hidden = true
    }
})

document.getElementById('action').addEventListener('change', event => {
    let action = document.getElementById('action')
    let numberContainer = document.getElementById('numberContainer')
    let number = document.getElementById('number')
    let typeContainer = document.getElementById('typeContainer')
    let type = document.getElementById('type')
    let submitContainer = document.getElementById('submitContainer')
    let overrideContainer = document.getElementById('overrideContainer')
    if(action.value == 'buy' || action.value == 'sell'){
        numberContainer.hidden = false
        number.value = 1
        typeContainer.hidden = false  
        type.value = 'Tea'
        overrideContainer.hidden = false
        submitContainer.hidden = false
    } 
    else if(action.value == 'hire' || action.value == 'fire' || action.value == 'claim'){
        typeContainer.hidden = false
        type.value = 'Beggar'
        overrideContainer.hidden = false
        submitContainer.hidden = false  

    }
    else {
        numberContainer.hidden = true
    }
})


async function test(){
    console.log('test')
    let req = await fetch('https://oracle.acethewildfire.me/api/workers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"action":"claim","claimType":"quickAll","type":"All","timeOverride":false})
    })

    let res = await req.json()
    document.getElementById('testBox').innerText = JSON.stringify(res)
}