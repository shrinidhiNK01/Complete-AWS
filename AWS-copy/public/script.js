async function getMessage() {
    const res = await fetch("/api/message");
    const data = await res.json();

    document.getElementById("dynamicText").innerText = data.message;
}

function changeColor() {
    document.body.classList.toggle("dark");
}

function greetUser() {
    const name = document.getElementById("nameInput").value;
    document.getElementById("greeting").innerText = `Hello ${name} 👋`;
}