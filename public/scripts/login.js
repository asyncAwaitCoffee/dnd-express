const loginForm = document.querySelector("#login_form")

document.addEventListener("submit", (event) => {
    event.preventDefault()

    const formData = Object.fromEntries(new FormData(loginForm).entries())

    console.log(formData)

    fetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(
        hint => {
            if (hint.ok) {
                console.log("Should redirect now!")
                document.location.href="/account/list-of-characters"
                return
            }
            const span = document.querySelector("#on_error_hint")
            span.textContent = hint.text
        })
    .catch(error => console.error(error))
})