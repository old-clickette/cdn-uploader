const uuid = document.getElementById("uuid").innerHTML;
const authorizationToken = document.getElementById("authorization-token").innerHTML;
function deleteUser() {
fetch(`https://cdn.clickette.net/api/user/${uuid}`, {
  method: 'DELETE',
  headers: {
    'Authorization': authorizationToken,
    'Content-Type': 'application/x-www-form-urlencoded',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'DELETE, POST'
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