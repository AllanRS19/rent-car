<?php 

    if ($_SERVER['REQUEST_METHOD'] == "POST") {

        include "./db_connection.php";

        if (isset($_POST['signup_name']) && isset($_POST['signup_email']) && isset($_POST['signup_password'])) {
            
            $nombre_completo = mysqli_real_escape_string($connection, $_POST['signup_name']);
            $email = mysqli_real_escape_string($connection, $_POST['signup_email']);
            $pswd = mysqli_real_escape_string($connection, $_POST['signup_password']);

            $random_avatar_url = "https://api.dicebear.com/7.x/avataaars/svg?accessoriesProbability=0&clothing=blazerAndShirt&eyes=default&eyebrows=default&mouth=default";

            if ($nombre_completo != "" && $email != "" & $pswd != "") {

                if (strlen($pswd) > 4) {

                    $check_for_existing_email = mysqli_query($connection, "SELECT user_email FROM usuarios WHERE user_email = '$email'");

                    if (mysqli_num_rows($check_for_existing_email) > 0) {

                        echo "Este correo está asociado a una cuenta existente";
                        return;

                    }

                    $enc_pswd = password_hash($pswd, PASSWORD_BCRYPT);

                    $random_chars = "ABCDEFFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz";

                    $user_unique_id = substr(str_shuffle($random_chars), 0, 40);

                    $create_account = mysqli_query($connection, "INSERT INTO usuarios (user_unique_id, user_name, user_email, user_pswd, user_image) VALUES ('$user_unique_id', '$nombre_completo', '$email', '$enc_pswd', '$random_avatar_url')");

                    if ($create_account) {

                        session_start();

                        $_SESSION['user_ident'] = $user_unique_id;

                        echo "signup_success";

                    } else {

                        echo "Ocurrió un error al crear la cuenta";

                    }

                } else {
                    echo "La contraseña es muy corta";
                }

            } else {
                echo "Existen campos en blanco";
            }

        }

        if (isset($_POST['login_email']) && isset($_POST['login_password'])) {
            
            $email = mysqli_real_escape_string($connection, $_POST['login_email']);
            $pswd = mysqli_real_escape_string($connection, $_POST['login_password']);

            if ($email != "" & $pswd != "") {

                $retrieve_user_info = mysqli_query($connection, "SELECT * FROM usuarios WHERE user_email = '$email'");

                if (mysqli_num_rows($retrieve_user_info) > 0) {

                    $get_user_info = mysqli_fetch_array($retrieve_user_info);

                    $user_password = $get_user_info['user_pswd'];

                    if (password_verify($pswd, $user_password)) {

                        $user_info_array = array(
                            'status' => 'login_success',
                            'nombre' => $get_user_info['user_name']
                        );

                        $user_info_data = json_encode($user_info_array);

                        echo $user_info_data;

                        session_start();

                        $_SESSION['user_ident'] = $get_user_info['user_unique_id'];

                    } else {
                        echo "Las credenciales son incorrectas";
                    }

                } else {

                    echo "El correo y/o contraseña son incorrectos";

                }

            } else {

                echo "No pueden haber campos en blanco";

            }

        }

        if (isset($_POST['fuel_action'])) {

            if ($_POST['fuel_action'] == "create") {

                if (isset($_POST['fuel_name']) && isset($_POST['fuel_desc']) && isset($_POST['fuel_state'])) {
                    
                    $fuel_name = mysqli_real_escape_string($connection, $_POST['fuel_name']);
                    $fuel_description = mysqli_real_escape_string($connection, $_POST['fuel_desc']);
                    $fuel_state = mysqli_real_escape_string($connection, $_POST['fuel_state']);

                    $check_existing_fuel = mysqli_query($connection, "SELECT * FROM tipos_combustible WHERE fuel_name = '$fuel_name'");

                    if (mysqli_num_rows($check_existing_fuel) > 0) {

                        echo "Este tipo de combustible ya está registrado";
                        return;

                    }

                    $random_chars = "ABCDEFFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz";

                    $fuel_unique_id = substr(str_shuffle($random_chars), 0, 30);

                    $insert_fuel = mysqli_query($connection, "INSERT INTO tipos_combustible (fuel_unique_id, fuel_name, fuel_description, fuel_state) VALUES ('$fuel_unique_id', '$fuel_name', '$fuel_description', '$fuel_state')");

                    if ($insert_fuel) {

                        $fuel_array = array(
                            "fuel_unique_id" => $fuel_unique_id,
                            "fuel_add_status" => 'success'
                        );

                        $fuel_array_res = json_encode($fuel_array);

                        echo $fuel_array_res;

                    } else {
                        echo "Hubo un error al añadir el combustible";
                    }

                }

            }

            if ($_POST['fuel_action'] == "edit") {
                
                if (isset($_POST['fuel_name']) && isset($_POST['fuel_desc']) && isset($_POST['fuel_state']) && isset($_POST['fuel_card_id'])) {

                    $fuel_name = mysqli_real_escape_string($connection, $_POST['fuel_name']);
                    $fuel_description = mysqli_real_escape_string($connection, $_POST['fuel_desc']);
                    $fuel_state = mysqli_real_escape_string($connection, $_POST['fuel_state']);
                    $fuel_unique_id = mysqli_real_escape_string($connection, $_POST['fuel_card_id']);

                    $update_fuel_info = mysqli_query($connection, "UPDATE tipos_combustible SET fuel_name = '$fuel_name', fuel_description = '$fuel_description', fuel_state = '$fuel_state' WHERE fuel_unique_id = '$fuel_unique_id'");

                    if ($update_fuel_info) {

                        $updateResponse = array(
                            "fuel_edit_status" => 'success'
                        );

                        $updateResponseSend = json_encode($updateResponse);

                        echo $updateResponseSend;

                    } else {
                        echo "Hubo un error al actualizar los datos";
                    }

                } else {
                    echo "Hacen falta datos";
                }

            }

            if ($_POST['fuel_action'] == "delete") {
                
                if (isset($_POST['fuel_id_to_delete'])) {

                    $fuel_id = mysqli_real_escape_string($connection, $_POST['fuel_id_to_delete']);

                    $find_fuel_id = mysqli_query($connection, "SELECT * FROM tipos_combustible WHERE fuel_unique_id = '$fuel_id'");

                    if (mysqli_num_rows($find_fuel_id) > 0) {

                        $delete_fuel = mysqli_query($connection, "DELETE FROM tipos_combustible WHERE fuel_unique_id = '$fuel_id'");

                        if ($delete_fuel) {
                            echo "fuel_deleted";
                        } else {
                            echo "Hubo un error eliminando el registro";
                        }

                    } else {
                        echo "No se pudo encontrar el registro a eliminar";
                    }

                }

            }

        }

        if (isset($_POST['vehicle_type_action'])) {

            if ($_POST['vehicle_type_action'] == "create") {

                if (isset($_POST['vehicle_type_name']) && isset($_POST['vehicle_type_desc']) && isset($_POST['vehicle_type_state'])) {
                    
                    $vehicle_type_name = mysqli_real_escape_string($connection, $_POST['vehicle_type_name']);
                    $vehicle_type_description = mysqli_real_escape_string($connection, $_POST['vehicle_type_desc']);
                    $vehicle_type_state = mysqli_real_escape_string($connection, $_POST['vehicle_type_state']);

                    $check_existing_vehicle_type = mysqli_query($connection, "SELECT * FROM tipos_vehiculos WHERE vehicle_type_name = '$vehicle_type_name'");

                    if (mysqli_num_rows($check_existing_vehicle_type) > 0) {

                        echo "Este tipo de vehículo ya está registrado";
                        return;

                    }

                    $random_chars = "ABCDEFFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz";

                    $vehicle_type_unique_id = substr(str_shuffle($random_chars), 0, 30);

                    $insert_vehicle_type = mysqli_query($connection, "INSERT INTO tipos_vehiculos (vehicle_type_unique_id, vehicle_type_name, vehicle_type_description, vehicle_type_state) VALUES ('$vehicle_type_unique_id', '$vehicle_type_name', '$vehicle_type_description', '$vehicle_type_state')");

                    if ($insert_vehicle_type) {

                        $vehicle_type_array = array(
                            "vehicle_type_unique_id" => $vehicle_type_unique_id,
                            "vehicle_type_add_status" => 'success'
                        );

                        $vechile_type_array_res = json_encode($vehicle_type_array);

                        echo $vechile_type_array_res;

                    } else {
                        echo "Hubo un error al añadir el tipo de vehículo";
                    }

                }

            }

            if ($_POST['vehicle_type_action'] == "edit") {
                
                if (isset($_POST['vehicle_type_name']) && isset($_POST['vehicle_type_desc']) && isset($_POST['vehicle_type_state']) && isset($_POST['vehicle_type_card_id'])) {

                    $vehicle_type_name = mysqli_real_escape_string($connection, $_POST['vehicle_type_name']);
                    $vehicle_type_description = mysqli_real_escape_string($connection, $_POST['vehicle_type_desc']);
                    $vehicle_type_state = mysqli_real_escape_string($connection, $_POST['vehicle_type_state']);
                    $vehicle_type_unique_id = mysqli_real_escape_string($connection, $_POST['vehicle_type_card_id']);

                    $update_vehicle_type_info = mysqli_query($connection, "UPDATE tipos_vehiculos SET vehicle_type_name = '$vehicle_type_name', vehicle_type_description = '$vehicle_type_description', vehicle_type_state = '$vehicle_type_state' WHERE vehicle_type_unique_id = '$vehicle_type_unique_id'");

                    if ($update_vehicle_type_info) {

                        $updateResponse = array(
                            "vehicle_type_edit_status" => 'success'
                        );

                        $updateResponseSend = json_encode($updateResponse);

                        echo $updateResponseSend;

                    } else {
                        echo "Hubo un error al actualizar los datos";
                    }

                } else {
                    echo "Hacen falta datos";
                }

            }

            if ($_POST['vehicle_type_action'] == "delete") {
                
                if (isset($_POST['vehicle_type_id_to_delete'])) {

                    $vehicle_type_id = mysqli_real_escape_string($connection, $_POST['vehicle_type_id_to_delete']);

                    $find_vehicle_type_id = mysqli_query($connection, "SELECT * FROM tipos_vehiculos WHERE vehicle_type_unique_id = '$vehicle_type_id'");

                    if (mysqli_num_rows($find_vehicle_type_id) > 0) {

                        $delete_vehicle_type = mysqli_query($connection, "DELETE FROM tipos_vehiculos WHERE vehicle_type_unique_id = '$vehicle_type_id'");

                        if ($delete_vehicle_type) {
                            echo "vehicle_type_deleted";
                        } else {
                            echo "Hubo un error eliminando el registro";
                        }

                    } else {
                        echo "No se pudo encontrar el registro a eliminar";
                    }

                }

            }

        }

    }