<?php

    session_start();

    unset($_SESSION['user_ident']);

    session_unset();

    session_destroy();

    header("location: ../auth.php");