function registerAccount() {
  const username = document.getElementById("username").value.trim();
  const password1 = document.getElementById("password").value;
  const password2 = document.getElementById("confirmPassword").value;
  const inviteCode = document.getElementById("invite-code").value.trim();

  // Validate username
  const reservedUsernames = ['ROOT', 'SUPERUSER', 'ADMIN', 'DEFAULT', 'SUDO', 'SU', 'ADMINISTRATOR', 'GUEST', 'ANONYMOUS', 'SUPPORT', 'HELPDESK', 'SECURITY', 'SYSTEM', 'TEST', 'DEBUG', 'SERVICE', 'WEBMASTER', 'OWNER', 'CEO', 'CFO', 'CTO', 'CIO', 'COO', 'PRESIDENT', 'VICEPRESIDENT', 'MANAGER'];
  if (reservedUsernames.includes(username.toUpperCase())) {
    alert('That username is not allowed');
    return;
  }

  // Validate password
  if (password1.length < 8) {
    alert('Password must be at least 8 characters long');
    return;
  }

  // Check for password match
  if (password1 !== password2) {
    alert('Passwords do not match');
    return;
  }

  // Construct request data
  const data = new URLSearchParams({
    username: username,
    password: password1,
    meta: "Self-registration"
  });

  // Construct request headers
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: inviteCode
  };

  // Send request to server
  fetch("https://cdn.clickette.net/api/user/", {
    method: "POST",
    body: data,
    headers: headers
  })
    .then(response => {
      if (response.ok) {
        alert("User created!");
        window.location.replace("/");
      } else if (response.status === 401) {
        alert("Invalid invite code");
      } else {
        alert("Registration failed, please try again later");
      }
    })
    .catch(error => {
      alert(error.message);
    });
}
