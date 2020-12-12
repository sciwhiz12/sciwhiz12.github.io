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
    avatar.alt = "avatar for " + user

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