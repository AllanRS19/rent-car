<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rental Car - Autenticación</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <link rel="stylesheet" href="https://unicons.iconscout.com/release/v4.0.0/css/line.css">
    <link rel="stylesheet" href="./assets/styles/global.css">
    <link rel="stylesheet" href="./assets/styles/auth.css">
</head>

<body>

    <div class="site-wrap d-md-flex align-items-stretch">

        <div class="bg-img"></div>

        <div class="form-wrap">

            <div class="message-banner">
                <div class="icon"></div>
                <span class="message-text"></span>
            </div>

            <div class="form-inner">

                <form action="#" class="pt-3 auth-form" id="login-form" method="post">

                    <h1 class="title">Iniciar Sesión</h1>
                    <p class="caption mb-4">Ingrese sus datos para acceder a su cuenta</p>

                    <div class="form-floating">
                        <input type="email" class="form-control" id="email" name="login_email" placeholder="info@example.com">
                        <label for="email">Correo Eletrónico</label>
                    </div>

                    <div class="form-floating">
                        <span class="password-show-toggle js-password-show-toggle"><span class="uil"></span></span>
                        <input type="password" class="form-control" id="password" name="login_password" placeholder="Password">
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

            </div>

        </div>

    </div>

    <!-- Option 1: Bootstrap Bundle with Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js"></script>

    <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
    <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>

    <script src="./assets/scripts/auth.js"></script>

</body>

</html>