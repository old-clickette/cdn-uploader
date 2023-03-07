function registerAccount() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const inviteCode = document.getElementById("invite-code").value;
  if (username.toUpperCase() != 'ROOT' || username.toUpperCase() != 'SUPERUSER' || username.toUpperCase() != 'ADMIN' || username.toUpperCase() != 'DEFAULT' || username.toUpperCase() != 'SUDO' || username.toUpperCase() != 'SU') {
    const data = new URLSearchParams({
      username: username,
      password: password,
      meta: "Self-registration"
    });

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: inviteCode
    };

    fetch("https://cdn.clickette.net/api/user/", {
      method: "POST",
      body: data,
      headers: headers
    })
      .then(response => {
        if (response.ok) {
          alert("User created!");
          window.location.replace("/");
        } else {
          throw new Error("Invalid invite code");
        }
      })
      .catch(error => {
        alert(error.message);
      });
  } else {
    alert('That username is not allowed')
  }
}
