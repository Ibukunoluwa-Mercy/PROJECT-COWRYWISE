window.customAlert = function (message, redirectUrl) {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '9999';
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.3s ease';

    const alertBox = document.createElement('div');
    alertBox.style.backgroundColor = 'white';
    alertBox.style.padding = '30px 40px';
    alertBox.style.borderRadius = '12px';
    alertBox.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
    alertBox.style.textAlign = 'center';
    alertBox.style.minWidth = '320px';
    alertBox.style.fontFamily = '"Onest", sans-serif, Arial';
    alertBox.style.transform = 'translateY(-20px)';
    alertBox.style.transition = 'transform 0.3s ease';

    const icon = document.createElement('div');
    icon.innerHTML = '<i class="fa-solid fa-bell"></i>';
    icon.style.color = '#0066f5';
    icon.style.fontSize = '40px';
    icon.style.marginBottom = '15px';

    const msg = document.createElement('p');
    msg.textContent = message;
    msg.style.color = '#0a2e65';
    msg.style.fontSize = '18px';
    msg.style.fontWeight = '600';
    msg.style.marginBottom = '25px';

    const btn = document.createElement('button');
    btn.textContent = 'OK';
    btn.style.backgroundColor = '#0066f5';
    btn.style.color = 'white';
    btn.style.border = 'none';
    btn.style.padding = '12px 35px';
    btn.style.borderRadius = '8px';
    btn.style.cursor = 'pointer';
    btn.style.fontSize = '16px';
    btn.style.fontWeight = '600';
    btn.style.transition = 'background-color 0.2s ease';

    btn.onmouseover = () => btn.style.backgroundColor = '#0052c4';
    btn.onmouseout = () => btn.style.backgroundColor = '#0066f5';

    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            btn.click();
        }
    };
    setTimeout(() => {
        window.addEventListener('keydown', handleEnter);
    }, 0);

    btn.onclick = function () {
        window.removeEventListener('keydown', handleEnter);
        overlay.style.opacity = '0';
        alertBox.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            document.body.removeChild(overlay);
            if (redirectUrl) {
                window.location.href = redirectUrl;
            }
        }, 300);
    };

    alertBox.appendChild(icon);
    alertBox.appendChild(msg);
    alertBox.appendChild(btn);
    overlay.appendChild(alertBox);
    document.body.appendChild(overlay);
    setTimeout(() => {
        overlay.style.opacity = '1';
        alertBox.style.transform = 'translateY(0)';
        btn.focus();
    }, 10);
};

const submitForm = JSON.parse(localStorage.getItem('myUsers')) || []
const createForm = () => {
    const yourEmail = document.getElementById('inputEmail').value;
    const firstName = document.getElementById('legalName').value;
    const lastName = document.getElementById('legalLastName').value;
    const nickName = document.getElementById('userName').value;
    const telePhoneNumber = document.getElementById('phoneNumber').value;
    const firstPassword = document.getElementById('inputPassword').value;
    const secondPassword = document.getElementById('inputConfirmPassword').value;
    const errorMessage = document.getElementById('errorMessage');

    console.log(yourEmail);
    console.log(firstName, lastName);
    console.log(nickName);
    console.log(telePhoneNumber);
    console.log(firstPassword);
    console.log(secondPassword);

    if (firstName === "" || lastName === "" || nickName === "" || telePhoneNumber === "" || yourEmail === "" || firstPassword === "" || secondPassword === "") {
        errorMessage.innerHTML = "Please fill in all the fields";
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 1500);
        return;
    } else if (firstPassword != secondPassword) {
        customAlert('Passwords do not match. Please verify your details.');
        return;
    } else if (firstPassword == secondPassword) {
        btn.innerHTML = `<div class="spinner-border text-light" role="status">
    <span class="visually-hidden">Loading...</span>
</div>`;
        const newUser = {
            email: yourEmail,
            firstName: firstName,
            lastName: lastName,
            nickName: nickName,
            phone: telePhoneNumber,
            password: firstPassword
        };
        localStorage.setItem('userData', JSON.stringify(newUser));
        customAlert('Registration successful, proceed to create your PIN', "pin.html");
    }
}


const loginForm = () => {
    const inputEmail = document.getElementById('yourEmail').value;
    const inputPassword = document.getElementById('yourPassword').value;
    const btn = document.getElementById('btn');
    const errorMessage = document.getElementById('errorMessage');

    console.log(inputEmail);
    console.log(inputPassword);

    if (inputEmail === "" || inputPassword === "") {
        errorMessage.innerHTML = "Please fill in your details";
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 1500);
    } else {
        const userDataString = localStorage.getItem('userData');
        const userData = userDataString ? JSON.parse(userDataString) : {};
        const storedEmail = userData.email || "";
        const storedPassword = userData.password || "";
        if (inputEmail !== storedEmail || inputPassword !== storedPassword) {
            customAlert('input the correct information, kindly create an account', "createaccount.html");
        } else {
            btn.innerHTML = `<div class="spinner-border text-light" role="status">
    <span class="visually-hidden">Loading...</span>
</div>`;
            const loggedInUser = {
                email: inputEmail,
                password: inputPassword
            };
            localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

            showLoginSuccessSequence();
        }
    }
}

window.showLoginSuccessSequence = function () {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '9999';
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.3s ease';

    const alertBox = document.createElement('div');
    alertBox.style.backgroundColor = 'white';
    alertBox.style.padding = '30px 40px';
    alertBox.style.borderRadius = '12px';
    alertBox.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
    alertBox.style.textAlign = 'center';
    alertBox.style.minWidth = '320px';
    alertBox.style.fontFamily = '"Onest", sans-serif, Arial';
    alertBox.style.transform = 'translateY(-20px)';
    alertBox.style.transition = 'transform 0.3s ease';

    const icon = document.createElement('div');
    icon.innerHTML = '<i class="fa-solid fa-circle-check" style="color: #00d18b;"></i>';
    icon.style.fontSize = '40px';
    icon.style.marginBottom = '15px';

    const msg = document.createElement('p');
    msg.textContent = 'login successful';
    msg.style.color = '#0a2e65';
    msg.style.fontSize = '18px';
    msg.style.fontWeight = '600';
    msg.style.marginBottom = '10px';

    alertBox.appendChild(icon);
    alertBox.appendChild(msg);
    overlay.appendChild(alertBox);
    document.body.appendChild(overlay);

    setTimeout(() => {
        overlay.style.opacity = '1';
        alertBox.style.transform = 'translateY(0)';
    }, 10);

    let dismissed = false;
    const proceedToLoading = () => {
        if (dismissed) return;
        dismissed = true;
        overlay.style.opacity = '0';
        alertBox.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
            }
            showGifLoadingScreen();
        }, 300);
    };

    setTimeout(proceedToLoading, 3000);
};

function showGifLoadingScreen() {
    const loaderOverlay = document.createElement('div');
    loaderOverlay.style.position = 'fixed';
    loaderOverlay.style.top = '0';
    loaderOverlay.style.left = '0';
    loaderOverlay.style.width = '100%';
    loaderOverlay.style.height = '100%';
    loaderOverlay.style.backgroundColor = '#ffffff';
    loaderOverlay.style.display = 'flex';
    loaderOverlay.style.justifyContent = 'center';
    loaderOverlay.style.alignItems = 'center';
    loaderOverlay.style.zIndex = '10000';

    const gifImg = document.createElement('img');
    gifImg.src = 'IMAGES/gif-logo-loading.gif';
    gifImg.alt = 'Loading...';
    gifImg.style.width = '120px';
    gifImg.style.height = '120px';

    loaderOverlay.appendChild(gifImg);
    document.body.appendChild(loaderOverlay);

    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 3000);
}

document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        if (document.activeElement && document.activeElement.tagName === 'INPUT') {
            if (document.getElementById('inputEmail')) {
                event.preventDefault();
                createForm();
            } else if (document.getElementById('yourEmail')) {
                event.preventDefault();
                loginForm();
            }
        }
    }
});



