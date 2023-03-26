const registerPage = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="shortcut icon" href="https://clickette.net/assets/favicon.ico" type="image/x-icon">
  <link rel="stylesheet" href="/style.css" />
  <title>Clickette CDN</title>
</head>

<body>
  <h1>Clickette CDN</h1>
  <input type="username" id="username" name="username" autocomplete="off" placeholder="Username"><br><br>
  <input type="password" id="password" name="password" autocomplete="off" placeholder="Password"><br><br>
  <input type="password" id="confirmPassword" name="password" autocomplete="off" placeholder="Confirm Password"><br><br>
  <input type="text" id="invite-code" name="invite-code" autocomplete="off" placeholder="Invite Code"><br><br>
  <label> Looking for an invite code? <a
      href="mailto:contact@clickette.net?subject=I%20would%20like%20access%20to%20the%20Clickette%20CDN">Let us
      know!</a></label><br><br>
  <button onclick="registerAccount()">Register</button><br><br>
  <label>Already have an account? <a onclick='document.location.reload()'>Use the CDN</a>.</label>
  <script src="/register.js"></script>
</body>

</html>`;

var fileType;
async function checkPassword(username, password) {
  const response = await fetch('https://cdn.clickette.net/api/user/password/check', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
  });

  if (!response.ok) {
    alert("Incorrect username or password");
    document.getElementsByTagName('progress')[0].remove();
  }

  const data = await response.text();

  return data;
}
function getLatestUpload() {
  let lastUploadContainer = document.getElementById('last');
  if (getCookie('latestUpload')) {
    let cookie = JSON.parse(getCookie('latestUpload'));
    let cookieUrl = cookie[0].url;
    let cookiePreviewUrl = cookie[0].previewUrl;
    let cookieDeleteUrl = cookie[0].deleteUrl;
    let cookieFileType = cookie[0].fileType;
    if (cookieFileType == 'img') {
      lastUploadContainer.innerHTML = `<h3>Last Upload</h3><img src="${cookiePreviewUrl}">
<br><br><a href="${cookieUrl}">${cookieUrl}</a><br><a onclick="document.cookie.split(';').forEach(function(c) { document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/'); });document.querySelector('#last').innerHTML=\`<h3>Last Upload</h3><p>Nothing yet!</p>\`;document.querySelector('#result').innerHTML = '';window.open('${cookieDeleteUrl}', '_blank', 'location=yes,height=110,width=420,scrollbars=yes,status=yes');" id="delete">Delete</a>`
    } else if (cookie[0].fileType == 'audio') {
      lastUploadContainer.innerHTML = `<h3>Last Upload</h3><audio controls=""><source src="${cookiePreviewUrl}"></audio>
<br><br><a href="${cookieUrl}">${cookieUrl}</a><br><a onclick="document.cookie.split(';').forEach(function(c) { document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/'); });document.querySelector('#last').innerHTML=\`<h3>Last Upload</h3><p>Nothing yet!</p>\`;document.querySelector('#result').innerHTML = '';window.open('${cookieDeleteUrl}', '_blank', 'location=yes,height=110,width=420,scrollbars=yes,status=yes');" id="delete">Delete</a>`;
    } else if (cookie[0].fileType == 'video') {
      lastUploadContainer.innerHTML = `<h3>Last Upload</h3><video controls=""><source src="${cookiePreviewUrl}"></video>
<br><br><a href="${cookieUrl}">${cookieUrl}</a><br><a onclick="document.cookie.split(';').forEach(function(c) { document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/'); });document.querySelector('#last').innerHTML=\`<h3>Last Upload</h3><p>Nothing yet!</p>\`;document.querySelector('#result').innerHTML = '';window.open('${cookieDeleteUrl}', '_blank', 'location=yes,height=110,width=420,scrollbars=yes,status=yes');" id="delete">Delete</a>`;
    }
  } else {
    lastUploadContainer.innerHTML = `<h3>Last Upload</h3><p>Nothing yet!</p>`;
  }
}
getLatestUpload();
async function uploadFile() {
  getLatestUpload();
  const usernameInput = document.getElementById("username");
  const username = usernameInput.value;
  const passwordInput = document.getElementById("password");
  const password = passwordInput.value;
  const fileInput = document.getElementById("file");
  const file = fileInput.files[0];
  const url = "https://cdn.clickette.net/";
  const formData = new FormData();
  formData.append("file", file);

  const xhr = new XMLHttpRequest();

  // Set up progress bar
  const progressBar = document.createElement("progress");
  progressBar.value = 0;
  progressBar.max = 100;
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "";
  resultDiv.appendChild(progressBar);

  // Disable the upload button if no file is selected
  const uploadButton = document.getElementById("upload-button");

  // Set up event listeners
  xhr.upload.addEventListener("progress", (e) => {
    if (e.lengthComputable) {
      const percentComplete = Math.round((e.loaded / e.total) * 100);
      progressBar.value = percentComplete;
    }
  });

  xhr.addEventListener("load", () => {
    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);

      // Create a file preview element
      let filePreview;
      if (file.type.startsWith("image/")) {
        // For image files, create an <img> element
        filePreview = document.createElement("img");
        let oldSourceImg = data.resource;
        fileType = 'img';
        filePreview.src = oldSourceImg.replace(/.{4}$/, "/direct");
      } else if (file.type.startsWith("audio/")) {
        // For audio files, create an <audio> element
        filePreview = document.createElement("audio");
        filePreview.controls = true;
        let oldSourceAudio = data.resource;
        fileType = 'audio';
        const source = document.createElement("source");
        source.src = oldSourceAudio.replace(/.{4}$/, "/direct");
        source.type = file.type;
        filePreview.appendChild(source);
      } else if (file.type.startsWith("video/")) {
        // For video files, create a <video> element
        filePreview = document.createElement("video");
        let oldSourceVideo = data.resource;
        fileType = 'video';
        filePreview.controls = true;
        const source = document.createElement("source");
        source.src = oldSourceVideo.replace(/.{4}$/, "/direct");
        source.type = file.type;
        filePreview.appendChild(source);
      }

      // Create a link to the uploaded file
      const resourceLink = document.createElement("a");
      resourceLink.href = data.resource;
      resourceLink.textContent = data.resource;

      // Display the file preview and link
      resultDiv.innerHTML = "";
      resultDiv.appendChild(filePreview);
      resultDiv.appendChild(document.createElement("br"));
      resultDiv.appendChild(resourceLink);

      // Add a "Delete" link
      const deleteLink = document.createElement("a");
      deleteLink.href = `javascript:document.cookie.split(';').forEach(function(c) { document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/'); });document.querySelector('#last').innerHTML=\`<h3>Last Upload</h3><p>Nothing yet!</p>\`;document.querySelector('#result').innerHTML = '';window.open('${data.delete}', '_blank', 'location=yes,height=110,width=420,scrollbars=yes,status=yes');`;
      deleteLink.textContent = "Delete";
      deleteLink.id = 'delete';
      resultDiv.appendChild(document.createElement("br"));
      resultDiv.appendChild(deleteLink);

      // Add to recent uploads cookie
      let oldSourceCookie = data.resource;
      const uploadData = {
        url: data.resource,
        deleteUrl: data.delete,
        previewUrl: oldSourceCookie.replace(/.{4}$/, "/direct"),
        fileType: fileType,
      };
      const MAX_UPLOADS = 1;
      let latestUpload = [];
      const existingCookie = getCookie("latestUpload");
      if (existingCookie) {
        latestUpload = JSON.parse(existingCookie);
      }
      latestUpload.unshift(uploadData);
      if (latestUpload.length > MAX_UPLOADS) {
        latestUpload.pop();
      }
      document.cookie = `latestUpload=${JSON.stringify(latestUpload)}; path=/; max-age=${60 * 60 * 24 * 7}`;
    } else if (xhr.status == 500) {
      alert("An unknown error occurred. (did you remember to upload a file?)");
      document.getElementsByTagName('progress')[0].remove();
    } else if (xhr.status == 429) {
      alert("Error: Too many requests");
      document.getElementsByTagName('progress')[0].remove();
    }
  });

  function getCookie(name) {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length === 2) {
      return parts.pop().split(";").shift();
    }
    return null;
  }


  xhr.addEventListener("error", (e) => {
    console.error(e);
  });

  // Send request
  xhr.open("POST", url);
  xhr.setRequestHeader("Authorization", await checkPassword(username, password));
  xhr.send(formData);
}

function getCookie(name) {
  const cookies = document.cookie.split('; ');
  for (let i = 0; i < cookies.length; i++) {
    const [cookieName, cookieValue] = cookies[i].split('=');
    if (cookieName === name) {
      return cookieValue;
    }
  }
  return '';
}

