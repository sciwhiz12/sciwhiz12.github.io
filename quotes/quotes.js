fetch("data.json")
    .then(req => req.json())
    .then(data => {
        const container = document.getElementById("quotes")
        var quotes = data.quotes
        for (let i = 0; i < quotes.length; i++) {
            const quote = quotes[i];
            if (!quote || !quote.user) {
                container.appendChild(createNoQuote(i + 1))
            } else {
                container.appendChild(createQuote(data, i + 1, quote))
            }
        }
    })
    .catch(err => {
        console.error("Error while loading: " + err)
        document.getElementById("loading_error").style.display = ""
    })

function createNoQuote(number) {
    const quoteDiv = document.createElement("div")
    quoteDiv.className = "quote"
    quoteDiv.id = number

    const numberElement = quoteDiv.appendChild(document.createElement("a"))
    numberElement.className = "count"
    numberElement.href = numberElement.innerText = "#" + number

    const content = quoteDiv.appendChild(document.createElement("div"))
    content.className = "content"

    const nameDiv = content.appendChild(document.createElement("div"))
    nameDiv.className = "name"

    const metaText = nameDiv.appendChild(document.createElement("span"))
    metaText.className = "meta-text"
    metaText.innerText = "Quote does not exist."

    return quoteDiv;
}

function createQuote(data, number, quote) {
    const user = quote.user
    const text = quote.text
    var userdata = null
    if (data.users.hasOwnProperty(user)) {
        userdata = data.users[user]
    }

    const quoteDiv = document.createElement("div")
    quoteDiv.className = "quote"
    quoteDiv.id = number

    const numberElement = quoteDiv.appendChild(document.createElement("a"))
    numberElement.className = "count"
    numberElement.href = numberElement.innerText = "#" + number

    const avatar = quoteDiv.appendChild(document.createElement("img"))
    avatar.classList = userdata ? "collapse-avatar avatar" : "avatar"
    avatar.tabIndex = 1
    if (userdata) {
        avatar.src = userdata.avatar
    }

    const content = quoteDiv.appendChild(document.createElement("div"))
    content.className = "content"

    const nameDiv = content.appendChild(document.createElement("div"))
    nameDiv.classList = userdata ? "collapse-name name" : "name"
    nameDiv.tabIndex = 1

    const userSpan = nameDiv.appendChild(document.createElement("span"))
    userSpan.innerText = userdata && userdata.hasOwnProperty("nickname") ? userdata.nickname : user
    if (userdata) {
        const roles = userdata.roles
        if (roles.length > 0) {
            userSpan.className = data.roles[roles[0]].css_class
        }
        if (userdata.hasOwnProperty("tag")) {
            const tagSpan = nameDiv.appendChild(document.createElement("span"))
            tagSpan.className = "tag"
            tagSpan.innerHTML = userdata.tag
        }

        content.appendChild(createPopup(data, user))
    } else {
        userSpan.className = "non_user"
    }

    if (quote.hasOwnProperty("side_text")) {
        content.appendChild(document.createTextNode(" "))
        const sideTextSpan = content.appendChild(document.createElement("span"))
        sideTextSpan.className = "side-text"
        sideTextSpan.innerHTML = quote.side_text
    }

    const textDiv = content.appendChild(document.createElement("div"))
    textDiv.className = "text"
    textDiv.innerHTML = text

    return quoteDiv
}

function createPopup(data, user) {
    const userdata = data.users[user]
    const roles = userdata.roles

    const popupDiv = document.createElement("div")
    popupDiv.className = "popup"

    const popupHead = popupDiv.appendChild(document.createElement("div"))
    popupHead.className = "popup_head"

    const avatar = popupHead.appendChild(document.createElement("img"))
    avatar.className = "popup_avatar"
    avatar.src = userdata.avatar

    var tagSpan = null
    if (data.users[user].hasOwnProperty("tag")) {
        tagSpan = document.createElement("span")
        tagSpan.className = "tag"
        tagSpan.innerHTML = data.users[user].tag
    }

    const tag = "#" + data.users[user].discriminator
    if (data.users[user].hasOwnProperty("nickname")) {
        const bold = popupHead.appendChild(document.createElement("div"))
        bold.className = "popup_bold"
        bold.innerText = data.users[user].nickname

        const smaller = popupHead.appendChild(document.createElement("span"))
        smaller.className = "popup_smaller"
        smaller.innerText = user + tag

        if (tagSpan) {
            smaller.appendChild(tagSpan)
        }
    } else {
        const div = popupHead.appendChild(document.createElement("div"))

        const bold = div.appendChild(document.createElement("span"))
        bold.className = "popup_bold"
        bold.innerText = user

        div.appendChild(document.createTextNode(tag))
        if (tagSpan) {
            div.appendChild(tagSpan)
        }
    }

    const popupBody = popupDiv.appendChild(document.createElement("div"))
    popupBody.className = "popup_body"

    const roleHeader = popupBody.appendChild(document.createElement("div"))
    roleHeader.className = "popup_body_header"
    if (roles.length < 1) {
        roleHeader.innerText = "NO ROLES"
    } else if (roles.length == 1) {
        roleHeader.innerText = "ROLE"
    } else {
        roleHeader.innerText = "ROLES"
    }
    for (const roleName of roles) {
        const role = data.roles[roleName]
        const roleDiv = popupBody.appendChild(document.createElement("div"))
        roleDiv.className = role.css_class
        const roleP = roleDiv.appendChild(document.createElement("p"))
        roleP.innerText = role.name
    }

    return popupDiv
}