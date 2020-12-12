fetch("data.json")
    .then(req => req.json())
    .then(data => {
        var counts = calculateCounts(data.quotes)
        var table = document.getElementById("counts")
        for (const entry of counts) {
            addRow(data, table, entry[0], entry[1])
        }
    })
    .catch(err => {
        console.error("Error while loading: " + err)
        document.getElementById("loading_error").style.display = ""
    })

function addRow(data, parent, user, count) {
    var userdata = null
    if (data.users.hasOwnProperty(user)) {
        userdata = data.users[user]
    }

    const row = parent.appendChild(document.createElement("tr"))

    const username = row.appendChild(document.createElement("td"))
    username.className = "collapse"
    username.tabIndex = 1

    const userSpan = username.appendChild(document.createElement("span"))
    userSpan.innerText = userdata && userdata.hasOwnProperty("nickname") ? userdata.nickname : user

    if (userdata) {
        const roles = userdata.roles
        if (roles.length > 0) {
            userSpan.className = data.roles[roles[0]].css_class
        }
        if (userdata.hasOwnProperty("tag")) {
            const tagSpan = username.appendChild(document.createElement("span"))
            tagSpan.className = "tag"
            tagSpan.innerHTML = userdata.tag
        }

        username.appendChild(createPopup(data, user))
    } else {
        userSpan.className = "non_user"
    }

    const countData = row.appendChild(document.createElement("td"))
    countData.className = "count"
    countData.innerText = count
}

function calculateCounts(quotes) {
    var quoteCount = new Map();
    quotes.forEach(element => {
        if (element) {
            var number = quoteCount.has(element.user) ? quoteCount.get(element.user) : 0
            quoteCount.set(element.user, number + 1)
        }
    });
    const sorted = new Map([...quoteCount.entries()].sort((a, b) => b[1] - a[1]));
    return sorted
}