function deleteUser() {
let uuidText = document.getElementById("uuid").value;
let authorizationToken = document.getElementById("authorization-token").value;
fetch('https://cdn.clickette.net/api/user/' + uuidText, {
  method: 'DELETE',
  headers: {
    'Authorization': authorizationToken,
    'Content-Type': 'application/x-www-form-urlencoded',
  },
})
.then(response => {
  if (response.ok) {
    alert("User deleted");
  } else {
    throw new Error('Something went wrong');
  }
})
.catch(error => {
  alert(error.message);
});
}