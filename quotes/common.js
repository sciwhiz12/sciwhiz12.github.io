// Add the .no-touch css class to the root document when ontouchstart doesn't exist
// Used to disable the spoiler hide effects that won't trigger otherwise
if ("ontouchstart" in document.documentElement === false) document.documentElement.classList.add("no-touch");

/**
 * @param {QuoteData} data
 */
function createPopups(data) {
    const fragment = document.createDocumentFragment();
    const root     = fragment.appendChild(document.createElement("div"))
    root.id = "popup-container"

    for (const userName in data.users) {
        const hidden = root.appendChild(document.createElement("div"))
        hidden.id = "popup-container-" + userName
        hidden.className = "collapse"
        hidden.tabIndex = 1
        hidden.appendChild(createPopup(userName, data.roles, data.users[userName]))
    }

    document.body.appendChild(fragment)
}

/**
 *
 * @param {UserName} userkey
 * @param {Object.<RoleName, Role>} roles
 * @param {User} userdata
 * @return {HTMLDivElement}
 */
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
    let tagSpan = null;
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
        bold.innerHTML = userdata.nickname

        // And the discriminator as smaller text
        const smaller = popupHead.appendChild(document.createElement("span"))
        smaller.className = "popup_smaller"
        smaller.innerHTML = userdata.username + discriminator

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
        bold.innerHTML = userdata.username

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
    const userRoles = userdata?.roles;

    if (userRoles && userRoles.length > 0) {
        const rolesProperties = Object.getOwnPropertyNames(roles)
        userRoles.sort(function(a, b) {
            return rolesProperties.indexOf(a) - rolesProperties.indexOf(b);
        })

        roleHeader.innerText = userRoles.length === 1 ? "Role" : "Roles"

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

/**
 * Parses the roles data, creates a stylesheet for each entry, and returns the combined sheet
 * @param {Object.<RoleName, Role>} roles
 * @return {HTMLStyleElement}
 */
function parseRoles(roles) {
    const dynStyle = document.createElement("style");
    dynStyle.innerText = ""

    for (const roleName in roles) {
        if (!roles.hasOwnProperty(roleName)) continue;

        const role = roles[roleName];
        if (!role.hasOwnProperty("color")) continue;

        const cssKey = "role_custom_" + roleName;
        let css = "." + cssKey + " {\n";
            css += "color: " + role.color + ";\n"
            css += "}\n"

        dynStyle.innerText = css + dynStyle.innerText
        roles[roleName].css = cssKey
    }

    return dynStyle
}