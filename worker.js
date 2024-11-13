function generateUUID() {
    return crypto.randomUUID();
  }
  
  function generatePassword(length = 16, options = {}) {
    let chars = '';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
    const similarChars = 'oOiIlL10';
    const ambiguousChars = '{}[]()/\'"`~,;:.<>';
  
    if (options.lowercase) chars += lowercase;
    if (options.uppercase) chars += uppercase;
    if (options.numbers) chars += numbers;
    if (options.symbols) chars += symbols;
    
    if (options.excludeSimilar) {
        chars = chars.split('').filter(c => !similarChars.includes(c)).join('');
    }
    if (options.excludeAmbiguous) {
        chars = chars.split('').filter(c => !ambiguousChars.includes(c)).join('');
    }
  
    return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
  }
  
  async function getQRCodeURL(text) {
    const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(text)}`;
    return qrCodeURL;
  }
  
  async function handleRequest(request) {
    const url = new URL(request.url);
    if (url.pathname === "/") {
        return new Response(getHTML(), {
            headers: { "Content-Type": "text/html" },
        });
    }
    
    if (url.pathname === "/generate-uuid") {
        return new Response(JSON.stringify({ uuid: generateUUID() }), {
            headers: { "Content-Type": "application/json" },
        });
    }
  
    if (url.pathname === "/generate-password") {
        const length = parseInt(url.searchParams.get("length")) || 16;
        const options = {
            lowercase: url.searchParams.get("lowercase") === "true",
            uppercase: url.searchParams.get("uppercase") === "true",
            numbers: url.searchParams.get("numbers") === "true",
            symbols: url.searchParams.get("symbols") === "true",
            excludeSimilar: url.searchParams.get("excludeSimilar") === "true",
            excludeAmbiguous: url.searchParams.get("excludeAmbiguous") === "true"
        };
        return new Response(JSON.stringify({ password: generatePassword(length, options) }), {
            headers: { "Content-Type": "application/json" },
        });
    }
  
    if (url.pathname === "/generate-qrcode") {
        const text = url.searchParams.get("text") || "Hello, World!";
        const qrCodeURL = await getQRCodeURL(text);
        return new Response(JSON.stringify({ qrCodeURL }), {
            headers: { "Content-Type": "application/json" },
        });
    }
  
    return new Response("Not Found", { status: 404 });
  }
  
  function getHTML() {
    return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Utility Generator</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body, .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
        }
        .card {
            width: 100%;
            max-width: 500px;
            margin-bottom: 20px;
        }
        .center-text {
            text-align: center;
            cursor: pointer;
        }
        .qr-code img {
            max-width: 100%;
            height: auto;
        }
        .copy-btn {
            margin-left: 10px;
        }
        .alert-box {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #4CAF50;
            color: white;
            padding: 15px 25px;
            font-size: 16px;
            border-radius: 5px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            opacity: 1;
            transition: opacity 0.5s ease;
        }
        .alert-box.fade-out {
            opacity: 0;
        }
        /* Centering the password card and inputs */
        .password-card {
            text-align: center;
            width: 100%;
        }
        .password-card .form-label {
            margin-bottom: 10px;
        }
        .password-card .form-select,
        .password-card .form-check,
        .password-card button {
            display: inline-block;
            margin-bottom: 10px;
            width: 100%;
            max-width: 300px;
        }
        body.dark-mode {
            background-color: #121212;
            color: white;
        }

        .dark-mode .card {
            background-color: #1e1e1e;
            color: white;
        }

        .dark-mode .btn {
            background-color: #4e4e4e;
            color: white;
            border: 1px solid #3c3c3c;
        }

        .dark-mode .alert-box {
            background-color: #333;
            color: white;
        }

        .dark-mode .form-control {
            background-color: #333;
            color: white;
            border-color: #555;
        }

        .dark-mode .form-check-label {
            color: white;
        }

    </style>
    
  </head>
  <body>
  <div class="container my-5">
    <h1 class="mb-4 text-center">Utility Generator</h1>
    <!-- Dark Mode Toggle Checkbox -->
    <div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" id="darkModeToggle">
        <label class="form-check-label" for="darkModeToggle">Dark Mode</label>
    </div>
    <div class="card mb-3">
        <div class="card-body center-text">
            <h5 class="card-title">Generate UUID</h5>
            <button id="generateUUIDBtn" class="btn btn-primary">Generate UUID</button>
            <div class="mt-3" id="uuidCard" style="display:none;">
                <p class="p-2 text-light bg-primary border center-text" id="uuidResult"></p>
                <button id="copyUUIDBtn" class="btn btn-secondary copy-btn" onclick="copyToClipboard('uuidResult')">Copy</button>
            </div>
        </div>
    </div>
  
    <div class="card mb-3 password-card">
        <div class="card-body">
            <h5 class="card-title center-text">Generate Password</h5>
            <label for="passwordLength" class="form-label">Password Length</label>
            <br />
            <select id="passwordLength" class="form-select mb-2">
                <option value="16">16</option>
                <option value="32">32</option>
                <option value="64">64</option>
                <option value="128">128</option>
                <option value="256">256</option>
            </select>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="includeLowercase" checked>
                <label class="form-check-label" for="includeLowercase">Include Lowercase Characters</label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="includeUppercase" checked>
                <label class="form-check-label" for="includeUppercase">Include Uppercase Characters</label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="includeNumbers" checked>
                <label class="form-check-label" for="includeNumbers">Include Numbers</label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="includeSymbols">
                <label class="form-check-label" for="includeSymbols">Include Symbols</label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="excludeSimilar">
                <label class="form-check-label" for="excludeSimilar">Exclude Similar Characters</label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="excludeAmbiguous">
                <label class="form-check-label" for="excludeAmbiguous">Exclude Ambiguous Characters</label>
            </div>
            <button id="generatePasswordBtn" class="btn btn-success mt-3">Generate Password</button>
            <div id="passwordCard" style="display:none;">
                <p class="p-2 center-text text-light bg-success border border-success" id="passwordResult"></p>
                <button id="copyPasswordBtn" class="btn btn-secondary copy-btn" onclick="copyToClipboard('passwordResult')">Copy</button>
            </div>
        </div>
    </div>
    
  
    <div class="card">
        <div class="card-body center-text">
            <h5 class="card-title">Generate QR Code</h5>
            <input type="text" id="qrText" class="form-control mb-3" placeholder="Enter text">
            <button id="generateQRCodeBtn" class="btn btn-primary">Generate QR Code</button>
            <div class="mt-3 text-center qr-code" id="qrCodeResult"></div>
        </div>
    </div>
  </div>
  
  <script>
    function copyToClipboard(elementId) {
        const text = document.getElementById(elementId).textContent;
        navigator.clipboard.writeText(text).then(() => {
          showAlert("Copied to clipboard!");
        });
      }
      
      function showAlert(message) {
        const alertBox = document.createElement("div");
        alertBox.classList.add("alert-box");
        alertBox.textContent = message;
        
        document.body.appendChild(alertBox);
        setTimeout(() => {
          alertBox.classList.add("fade-out");
        }, 2000);
        setTimeout(() => {
          alertBox.remove();
        }, 3000);
      }
  
  document.getElementById("generateUUIDBtn").addEventListener("click", async () => {
    const response = await fetch("/generate-uuid");
    const data = await response.json();
    document.getElementById("uuidResult").textContent = data.uuid;
    document.getElementById("uuidCard").style.display = "block";
  });
  
  document.getElementById("generatePasswordBtn").addEventListener("click", async () => {
    const length = document.getElementById("passwordLength").value;
    const options = {
        lowercase: document.getElementById("includeLowercase").checked,
        uppercase: document.getElementById("includeUppercase").checked,
        numbers: document.getElementById("includeNumbers").checked,
        symbols: document.getElementById("includeSymbols").checked,
        excludeSimilar: document.getElementById("excludeSimilar").checked,
        excludeAmbiguous: document.getElementById("excludeAmbiguous").checked
    };
    const params = new URLSearchParams({ length, ...options });
    const response = await fetch("/generate-password?" + params);
    const data = await response.json();
    document.getElementById("passwordResult").textContent = data.password;
    document.getElementById("passwordCard").style.display = "block";
  });
  
  document.getElementById("generateQRCodeBtn").addEventListener("click", async () => {
    const text = document.getElementById("qrText").value;
    const response = await fetch("/generate-qrcode?text=" + encodeURIComponent(text));
    const data = await response.json();
    const img = document.createElement("img");
    img.src = data.qrCodeURL;
    document.getElementById("qrCodeResult").innerHTML = "";
    document.getElementById("qrCodeResult").appendChild(img);
  });

// Check localStorage on page load to maintain dark mode state
if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
    document.getElementById("darkModeToggle").checked = true;
} else {
    document.body.classList.remove("dark-mode");
    document.getElementById("darkModeToggle").checked = false;
}

// Event listener for checkbox toggle
document.getElementById("darkModeToggle").addEventListener("change", (event) => {
    if (event.target.checked) {
        document.body.classList.add("dark-mode");
        localStorage.setItem("darkMode", "enabled");
    } else {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("darkMode", "disabled");
    }
});


  </script>
  </body>
  </html>`;
  }
  
  addEventListener("fetch", event => {
    event.respondWith(handleRequest(event.request));
  });
  
