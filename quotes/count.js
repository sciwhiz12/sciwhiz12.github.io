fetch("data.json")
    .then(req => req.json())
    .then(/** @param {QuoteData} data */ data => {
        document.body.appendChild(parseRoles(data.roles))
        createPopups(data)

        const counts = calculateCounts(data.quotes);
        const table = document.getElementById("counts");
        const root  = document.createDocumentFragment()

        for (const entry of counts) {
            addRow(data, root, entry[0], entry[1])
        }

        table.appendChild(root)
    })
    .catch(err => {
        console.error("Error while loading: " + err)
        document.getElementById("loading_error").style.display = ""
    })

/**
 * @param {QuoteData} data
 * @param {Node} parent
 * @param {UserName} user
 * @param {number} count
 */
function addRow(data, parent, user, count) {
    const userdata = data.users[user];

    const row = parent.appendChild(document.createElement("tr"))

    const username = row.appendChild(document.createElement("td"))
    username.className = "collapse"
    username.tabIndex = 1

    const userSpan = username.appendChild(document.createElement("span"))
    userSpan.innerHTML = userdata ? (userdata.hasOwnProperty("nickname") ? userdata.nickname : userdata.username) : user

    if (userdata) {
        const userRoles = userdata.roles
        if (userRoles && userRoles.length > 0) {
            userRoles.forEach(roleName => {
                if (data.roles[roleName]?.css) userSpan.classList.add(data.roles[roleName].css)
            });
        }
        if (userdata.hasOwnProperty("tag")) {
            const tagSpan = username.appendChild(document.createElement("span"))
            tagSpan.className = "tag"
            tagSpan.innerHTML = userdata.tag
        }

        username.onfocus = () => document.getElementById("popup-container-" + user)?.focus({preventScroll:true})
    } else {
        userSpan.className = "non_user"
    }

    const countData = row.appendChild(document.createElement("td"))
    countData.className = "count"
    countData.innerText = String(count)
}

/**
 *
 * @param {Quote[]} quotes
 * @return {Map<UserName, number>}
 */
function calculateCounts(quotes) {
    const quoteCount = new Map();
    quotes.forEach(element => {
        if (element) {
            const number = quoteCount.has(element.user) ? quoteCount.get(element.user) : 0;
            quoteCount.set(element.user, number + 1)
        }
    });
    return new Map([...quoteCount.entries()].sort((a, b) => b[1] - a[1]))
}