const signup = document.querySelector("#signup")

document.addEventListener("submit", (event) => {
    event.preventDefault()

    const formData = Object.fromEntries(new FormData(signup).entries())

    console.log(formData)

    fetch("/auth/signup", {
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
                document.location.href="/auth/login"
                return
            }
            const span = document.querySelector("#on_error_hint")
            span.textContent = hint.text
        })
    .catch(error => console.error(error))
})