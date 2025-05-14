
const login = document.querySelector(".login")
const loginForm = login.querySelector(".login__form")
const loginInput = login.querySelector(".login__input")

const chat = document.querySelector(".chat")
const chatForm = chat.querySelector(".chat__form")
const chatInput = chat.querySelector(".chat__input")
const chatMessages = chat.querySelector(".chat__messages")

const colors = [
    "cadetblue",
    "darkgoldenrod",
    "cornflowerblue",
    "darkkhaki",
    "hotpink",
    "gold",
    "aquamarine",
    "chocolate",
    "firebrick",
    "deeppink",
    "khaki"
]


const user = {id: "", name: "", color: ""}

let ws;

const createMessageSelfElement = (content) => {
    const div = document.createElement("div")
    
    div.classList.add("message--self")
    div.innerHTML = content

    return div
}

const createMessageOtherElement = (content, sender, senderColor) => {
    const div = document.createElement("div")
    const span = document.createElement("span")

    div.classList.add("message-other")
    
    div.classList.add("message--self")
    span.classList.add("message--sender")

    div.appendChild(span)

    span.style.color = senderColor
    span.innerHTML = sender
    div.innerHTML += content


    return div
}

const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length)
    return colors[randomIndex]
}


const sendSystemMessage = (content, isConnected = true) => {
    const message = JSON.stringify({
        content,
        userId: "system",
        userName: "System",
        userColor: "#808080",
        type: isConnected ? "connected" : "disconnected"    
    })
    ws.send(message)
}

const clientMessage = (content) => {
    
    const div = document.createElement("div");
    div.innerHTML = content;
    div.classList.add("message-server");

    div.classList.add("message-server")
    div.style.backgroundColor = content.includes("saiu") ? "#ff4c4c" : "#57b42c"


    return div;
}

const processMessage = async ({ data }) => {
    const { userId, userName, userColor, content, type } = JSON.parse(data);

    let message;

    if (type === "connected" || type === "disconnected")  {
        message = clientMessage(content);
    } else {
        message = userId == user.id 
            ? createMessageSelfElement(content) 
            : createMessageOtherElement(content, userName, userColor);
    }

    chatMessages.appendChild(message);
    message.scrollIntoView({ behavior: "smooth" });
}

const handleLogin = e => {
    e.preventDefault();

    user.id = crypto.randomUUID();
    user.name = loginInput.value;
    user.color = getRandomColor();

    login.style.display = "none";
    chat.style.display = "flex";

    ws = new WebSocket("wss://chat-em-tempo-real-dxs8.onrender.com");
    ws.onmessage = processMessage;

     ws.onopen = () => {
        sendSystemMessage(`${user.name} entrou no chat!`)
    }

    ws.onclose = () => {
        processMessage({ data: JSON.stringify({
            content: `${user.name} saiu do chat!`,
            type: "disconnected"
        })})
    }
}


const sendMessage = (event) => {
    event.preventDefault()

    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value
    }

    ws.send(JSON.stringify(message))

    chatInput.value = ""
}

loginForm.addEventListener("submit", handleLogin)
chatForm.addEventListener("submit", sendMessage)

window.addEventListener("unload", () => {
    if (ws) {
        sendSystemMessage(`${user.name} saiu do chat!`, false)
    }
})
