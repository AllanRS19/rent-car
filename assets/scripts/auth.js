(function () {

    'use strict';

    const elToggle = document.querySelector('.js-password-show-toggle'),
        passwordInput = document.getElementById('password');

    elToggle.addEventListener('click', (e) => {
        e.preventDefault();

        if (elToggle.classList.contains('active')) {
            passwordInput.setAttribute('type', 'password');
            elToggle.classList.remove('active');
        } else {
            passwordInput.setAttribute('type', 'text');
            elToggle.classList.add('active');
        }
    })

})();

const formInner = document.querySelector('.form-inner'),
    messageBanner = document.querySelector('.message-banner'),
    messageBannerIcon = document.querySelector('.message-banner .icon'),
    messageText = document.querySelector('.message-banner .message-text'),
    failedIcon = `<ion-icon name="close-outline"></ion-icon>`,
    successIcon = `<ion-icon name="checkmark-outline"></ion-icon>`;

let formSwitchBtn = document.querySelector('.switch-form-btn'),
    authForm = document.querySelector('.form-inner form');

let formTemplateInitial = `
    <form action="#" class="pt-3 auth-form signup-form" id="signup-form" method="post">

        <h1 class="title">Crear cuenta</h1>
        <p class="caption mb-4">Cree una cuenta para poder administrar su sistema de rentas</p>

        <div class="form-floating">
            <input type="text" class="form-control" name="signup_name" id="name-signup" placeholder="John Doe">
            <label for="name-signup">Nombre Completo</label>
        </div>

        <div class="form-floating">
            <input type="email" class="form-control" name="signup_email" id="email-signup" placeholder="info@example.com">
            <label for="email">Correo Eletrónico</label>
        </div>

        <div class="form-floating">
            <span class="password-show-toggle js-password-show-toggle"><span class="uil"></span></span>
            <input type="password" class="form-control" name="signup_password" id="password-signup" placeholder="Password">
            <label for="password">Contraseña</label>
        </div>

        <div class="d-grid mb-4">
            <button type="submit" class="btn btn-primary">Registrarse</button>
        </div>

        <div class="mb-2">¿Ya tiene una cuenta? <a href="#" class="switch-form-btn">Entrar a su cuenta</a></div>

    </form>
`;

function switchForms() {

    formInner.classList.add('disappear');

    setTimeout(() => {

        if (formSwitchBtn.textContent == "Registrarse")
            formInner.innerHTML = formTemplateInitial;
        else if (formSwitchBtn.textContent == "Entrar a su cuenta")
            formInner.innerHTML =
                `
                <form action="#" class="pt-3 auth-form login-form" id="login-form" method="post">

                    <h1 class="title">Iniciar Sesión</h1>
                    <p class="caption mb-4">Ingrese sus datos para acceder a su cuenta</p>

                    <div class="form-floating">
                        <input type="email" class="form-control" name="login_email" id="email" placeholder="info@example.com">
                        <label for="email">Correo Eletrónico</label>
                    </div>

                    <div class="form-floating">
                        <span class="password-show-toggle js-password-show-toggle"><span class="uil"></span></span>
                        <input type="password" class="form-control" name="login_password" id="password" placeholder="Password">
                        <label for="password">Contraseña</label>
                    </div>

                    <div class="d-flex justify-content-between">
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" id="remember">
                            <label for="remember" class="form-check-label">Recordarme</label>
                        </div>
                        <div><a href="#">¿Olvidó su contraseña?</a></div>
                    </div>

                    <div class="d-grid mb-4">
                        <button type="submit" class="btn btn-primary">Iniciar Sesión</button>
                    </div>

                    <div class="mb-2">¿No tiene cuenta aún? <a href="#" class="switch-form-btn">Registrarse</a></div>

                </form>
            `;

        formInner.classList.remove('disappear');

        formSwitchBtn = document.querySelector('.switch-form-btn');

        authForm = formSwitchBtn.parentElement.parentElement;

        console.log(authForm);

        authForm.onsubmit = function (e) {
            e.preventDefault();
            submitAuthForm(this);
        }

        formSwitchBtn.onclick = () => {
            switchForms();
        }

    }, 400)
}

function submitAuthForm(dataForm) {

    let xhr = new XMLHttpRequest();

    xhr.open("POST", "./server/procedures.php", true);

    xhr.onload = () => {

        if (xhr.readyState === XMLHttpRequest.DONE) {

            if (xhr.status === 200) {

                const data = xhr.response;

                try {

                    const jsonResponse = JSON.parse(data);

                    if (jsonResponse.status == "login_success") {
                        
                        messageText.textContent = `¡Bienvenido de vuelta, ${jsonResponse.nombre}!`;

                        messageBannerIcon.innerHTML = successIcon;

                        setTimeout(() => {
                            messageBanner.classList.add('active');
                            messageBanner.classList.add('success');
                            setTimeout(() => {
                                location.href = "./rental/index.html";
                            }, 1500);
                        }, 1000);

                    }

                } catch (e) {

                    if (data == "signup_success") {

                        messageText.textContent = "Usuario creado exitosamente. Iniciando app...";

                        messageBannerIcon.innerHTML = successIcon;

                        setTimeout(() => {
                            messageBanner.classList.add('active');
                            messageBanner.classList.add('success');
                            setTimeout(() => {
                                location.href = "./rental/index.html";
                            }, 1500);
                        }, 1000);

                    } else {

                            messageText.textContent = data;

                            messageBannerIcon.innerHTML = failedIcon;

                            setTimeout(() => {
                                messageBanner.classList.add('active');
                                messageBanner.classList.add('error');

                                setTimeout(() => {
                                    messageBanner.classList.remove('active');
                                    setTimeout(() => {
                                        messageBanner.classList.remove('error');
                                    }, 500);
                                }, 2000);

                            }, 300);

                        }

                    }

                }

            }

        }

        let formData = new FormData(dataForm);

        xhr.send(formData);

    }

    formSwitchBtn.onclick = () => {
        switchForms();
    };

    authForm.onsubmit = function (e) {
        e.preventDefault();
        submitAuthForm(this);
    }