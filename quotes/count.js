fetch("data.json")
    .then(req => req.json())
    .then(data => {
        var roles = parseRoles(data.roles)
        var counts = calculateCounts(data.quotes)
        var table = document.getElementById("counts")
        for (const entry of counts) {
            addRow(data, roles, table, entry[0], entry[1])
        }
    })
    .catch(err => {
        console.error("Error while loading: " + err)
        document.getElementById("loading_error").style.display = ""
    })

function addRow(data, roles, parent, user, count) {
    var userdata = data.users[user]

    const row = parent.appendChild(document.createElement("tr"))

    const username = row.appendChild(document.createElement("td"))
    username.className = "collapse"
    username.tabIndex = 1

    const userSpan = username.appendChild(document.createElement("span"))
    userSpan.innerText = userdata ? (userdata.hasOwnProperty("nickname") ? userdata.nickname : userdata.username) : user

    if (userdata) {
        const userRoles = userdata.roles
        if (userRoles && userRoles.length > 0) {
            userRoles.forEach(roleName => {
                if (roles[roleName]?.css) {
                    userSpan.classList.add(roles[roleName].css)
                }
            });
        }
        if (userdata.hasOwnProperty("tag")) {
            const tagSpan = username.appendChild(document.createElement("span"))
            tagSpan.className = "tag"
            tagSpan.innerHTML = userdata.tag
        }

        username.appendChild(createPopup(user, roles, userdata))
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