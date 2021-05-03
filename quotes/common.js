function createPopup(userkey, roles, userdata) {
    // The main div for the popup
    const popupDiv = document.createElement("div")
    popupDiv.className = "popup"

    // The top part of the poppup, for the user's info (name, discriminator, etc)
    const popupHead = popupDiv.appendChild(document.createElement("div"))
    popupHead.className = "popup_head"

    // Part of the popup head, the user's avatar
    const avatar = popupHead.appendChild(document.createElement("img"))
    avatar.className = "popup_avatar"
    avatar.src = userdata?.avatar
    avatar.alt = "avatar for " + userkey

    // An optional tag, attached to the name of the user (such as for bots)
    var tagSpan = null
    if (userdata?.tag) {
        tagSpan = document.createElement("span")
        tagSpan.className = "tag"
        tagSpan.innerHTML = userdata.tag
    }

    const discriminator = "#" + userdata.discriminator
    if (userdata?.nickname) {
        // If there is a nickname, have that in bold
        const bold = popupHead.appendChild(document.createElement("div"))
        bold.className = "popup_bold"
        bold.innerText = userdata.nickname

        // And the discriminator as smaller text
        const smaller = popupHead.appendChild(document.createElement("span"))
        smaller.className = "popup_smaller"
        smaller.innerText = userdata.username + discriminator

        // Append the tag to the userinfo, if any
        if (tagSpan) {
            smaller.appendChild(tagSpan)
        }
    } else {
        // Make a container div for the userinfo
        const div = popupHead.appendChild(document.createElement("div"))

        // Have the username in bold
        const bold = div.appendChild(document.createElement("span"))
        bold.className = "popup_bold"
        bold.innerText = userdata.username

        // And the discriminator as regular text
        div.appendChild(document.createTextNode(discriminator))

        // Append the tag to the userinfo, if any
        if (tagSpan) {
            div.appendChild(tagSpan)
        }
    }

    // The rest of the popup (the body)
    const popupBody = popupDiv.appendChild(document.createElement("div"))
    popupBody.className = "popup_body"

    // The roles of the user
    const roleHeader = popupBody.appendChild(document.createElement("div"))
    roleHeader.className = "popup_body_header"
    var userRoles = userdata?.roles

    if (userRoles && userRoles.length > 0) {
        const rolesProperties = Object.getOwnPropertyNames(roles)
        userRoles.sort(function(a, b) {
            return rolesProperties.indexOf(a) - rolesProperties.indexOf(b);
        })

        roleHeader.innerText = userRoles.length == 1 ? "Role" : "Roles"

        // List out all the roles
        for (const roleName of userRoles) {
            const role = roles[roleName]

            // The surrounding div for the role
            const roleDiv = popupBody.appendChild(document.createElement("div"))
            roleDiv.className = role?.css ? role.css : "role_default"

            // The name of the role
            const roleP = roleDiv.appendChild(document.createElement("p"))
            roleP.innerText = role.name
        }
    } else {
        roleHeader.innerText = "No Roles"
    }

    return popupDiv
}

// Parses the roles data, creates a stylesheet for each entry, and returns a 'map' of role name -> css class
function parseRoles(roles) {
    var rolesMap = {}

    var dynStyle = document.createElement("style")
    dynStyle.innerText = ""
    
    for (const roleName in roles) {
        var save = false

        var cssKey = "role_custom_" + roleName
        var css = "." + cssKey + " {\n"
        var role = roles[roleName]

        if (role.hasOwnProperty("color")) {
            css += "color: " + role.color + ";\n"
            save = true
        }
        css += "}\n"

        if (save) {
            dynStyle.innerText = css + dynStyle.innerText
            roles[roleName].css = cssKey
        }
    }

    document.body.appendChild(dynStyle)
    return roles
}