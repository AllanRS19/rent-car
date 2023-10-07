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

    if (isset($_POST['brandFormAction'])) {

        if ($_POST['brandFormAction'] == "create") {

            if (isset($_POST['brand-name']) && isset($_POST['brand-description']) && isset($_POST['brand_state']) && isset($_FILES['brandImageFile'])) {

                $brand_name = mysqli_real_escape_string($connection, $_POST['brand-name']);
                $brand_description = mysqli_real_escape_string($connection, $_POST['brand-description']);
                $brand_state = mysqli_real_escape_string($connection, $_POST['brand_state']);
                $brand_image_file = $_FILES['brandImageFile'];

                $check_existing_brand = mysqli_query($connection, "SELECT * FROM marcas WHERE brand_name = '$brand_name'");

                if (mysqli_num_rows($check_existing_brand) > 0) {

                    echo "Esta marca de vehículo ya está registrada";
                    return;
                }

                $selectedFileName = $brand_image_file['name'];
                $selectedFileTmpName = $brand_image_file['tmp_name'];
                $selectedFileSize = $brand_image_file['size'];
                $selectedFileType = $brand_image_file['type'];
                $selectedFileError = $brand_image_file['error'];

                $selectedFileExt = explode('.', $selectedFileName);
                $selectedFileActualExt = strtolower(end($selectedFileExt));

                $allowedExtensions = array('jpg', 'png', 'jpeg');

                if (in_array($selectedFileActualExt, $allowedExtensions)) {

                    if ($selectedFileError === 0) {

                        if ($selectedFileSize < 2000000) {

                            $selectedFileNewName = uniqid('brand_', true) . "." . $selectedFileActualExt;

                            $fileDestination = '../assets/imgs/uploads/brands/' . $selectedFileNewName;

                            if (move_uploaded_file($selectedFileTmpName, $fileDestination)) {

                                $random_chars = "ABCDEFFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz";

                                $brand_unique_id = substr(str_shuffle($random_chars), 0, 30);

                                $insert_brand = mysqli_query($connection, "INSERT INTO marcas (brand_unique_id, brand_name, brand_description, brand_state, brand_image_path) VALUES ('$brand_unique_id', '$brand_name', '$brand_description', '$brand_state', '$selectedFileNewName')");

                                if ($insert_brand) {

                                    $brand_array = array(
                                        "brand_unique_id" => $brand_unique_id,
                                        "brand_image_path_name" => $selectedFileNewName,
                                        "brand_add_status" => 'success'
                                    );

                                    $brand_array_res = json_encode($brand_array);

                                    echo $brand_array_res;
                                } else {
                                    echo "Hubo un error al añadir la marca de vehículo";
                                }
                            } else {
                                echo "Hubo un error moviendo el archivo";
                            }
                        } else {

                            echo "El archivo no puede pesar más de 2MB";
                        }
                    } else {

                        echo "Hubo un error subiendo el archivo";
                    }
                } else {

                    echo "Este archivo no es aceptado. Archivos aceptados: jpeg, jpg, png";
                }
            }
        }

        if ($_POST['brandFormAction'] == "edit") {

            if (isset($_POST['brand-name']) && isset($_POST['brand-description']) && isset($_POST['brand_state']) && isset($_POST['brand_id'])) {

                $brand_name = mysqli_real_escape_string($connection, $_POST['brand-name']);
                $brand_description = mysqli_real_escape_string($connection, $_POST['brand-description']);
                $brand_state = mysqli_real_escape_string($connection, $_POST['brand_state']);
                $brand_id = mysqli_real_escape_string($connection, $_POST['brand_id']);

                $check_existing_brand = mysqli_query($connection, "SELECT * FROM marcas WHERE brand_unique_id = '$brand_id'");

                if (mysqli_num_rows($check_existing_brand) > 0) {

                    if (isset($_FILES['brandImageFile'])) {

                        $fetch_image_path = mysqli_fetch_array($check_existing_brand);

                        $rutaArchivo = "../assets/imgs/uploads/brands/" . $fetch_image_path['brand_image_path'];

                        if (file_exists($rutaArchivo)) {

                            if (unlink($rutaArchivo)) {

                                $get_new_brand_image = $_FILES['brandImageFile'];

                                $selectedFileName = $get_new_brand_image['name'];
                                $selectedFileTmpName = $get_new_brand_image['tmp_name'];
                                $selectedFileSize = $get_new_brand_image['size'];
                                $selectedFileType = $get_new_brand_image['type'];
                                $selectedFileError = $get_new_brand_image['error'];

                                $selectedFileExt = explode('.', $selectedFileName);
                                $selectedFileActualExt = strtolower(end($selectedFileExt));

                                $allowedExtensions = array('jpg', 'png', 'jpeg');

                                if (in_array($selectedFileActualExt, $allowedExtensions)) {

                                    if ($selectedFileError === 0) {

                                        if ($selectedFileSize < 2000000) {

                                            $selectedFileNewName = uniqid('brand_', true) . "." . $selectedFileActualExt;

                                            $fileDestination = '../assets/imgs/uploads/brands/' . $selectedFileNewName;

                                            if (move_uploaded_file($selectedFileTmpName, $fileDestination)) {

                                                $random_chars = "ABCDEFFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz";

                                                $brand_unique_id = substr(str_shuffle($random_chars), 0, 30);

                                                $update_brand_with_image = mysqli_query($connection, "UPDATE marcas SET brand_name = '$brand_name', brand_description = '$brand_description', brand_state = '$brand_state', brand_image_path = '$selectedFileNewName' WHERE brand_unique_id = '$brand_id'");

                                                if ($update_brand_with_image) {

                                                    $brand_array = array(
                                                        "brand_update_status" => "success",
                                                        "new_brand_image_path_name" => $selectedFileNewName,
                                                    );

                                                    $brand_array_res = json_encode($brand_array);

                                                    echo $brand_array_res;
                                                } else {
                                                    echo "Hubo un error al actualizar la marca de vehículo";
                                                }
                                            } else {
                                                echo "Hubo un error moviendo el nuevo archivo";
                                            }
                                        } else {

                                            echo "El archivo no puede pesar más de 2MB";
                                        }
                                    } else {

                                        echo "Hubo un error subiendo el archivo";
                                    }
                                } else {

                                    echo "Este archivo no es aceptado. Archivos aceptados: jpeg, jpg, png";
                                }
                            } else {
                                echo "No se pudo eliminar el archivo";
                            }
                        } else {
                            echo "No se pudo encontrar el archivo";
                        }
                    } else {

                        $update_brand = mysqli_query($connection, "UPDATE marcas SET brand_name = '$brand_name', brand_description = '$brand_description', brand_state = '$brand_state' WHERE brand_unique_id = '$brand_id'");

                        if ($update_brand) {

                            $brand_array = array(
                                "brand_update_status" => "success"
                            );
                        }
                        $brand_array_res = json_encode($brand_array);
                        echo $brand_array_res;
                    }
                } else {
                    echo "No se pudo encontrar la marca a editar";
                }
            } else {
                echo "Faltan datos por completar";
            }
        }

        if (isset($_POST['brandFormAction']) == "delete") {

            if (isset($_POST['brand_id_to_delete'])) {

                $brand_id_to_delete = mysqli_real_escape_string($connection, $_POST['brand_id_to_delete']);

                $find_brand_id = mysqli_query($connection, "SELECT * FROM marcas WHERE brand_unique_id = '$brand_id_to_delete'");

                if (mysqli_num_rows($find_brand_id) > 0) {

                    $fetch_image_path = mysqli_fetch_array($find_brand_id);

                    $rutaArchivo = "../assets/imgs/uploads/brands/" . $fetch_image_path['brand_image_path'];

                    if (file_exists($rutaArchivo)) {

                        if (unlink($rutaArchivo)) {

                            $delete_brand = mysqli_query($connection, "DELETE FROM marcas WHERE brand_unique_id = '$brand_id_to_delete'");

                            if ($delete_brand) {
                                echo "brand_deleted";
                            } else {
                                echo "Hubo un error eliminando el registro";
                            }
                        } else {
                            echo "Hubo un error al eliminar el archivo";
                        }
                    } else {
                        echo "El archivo no existe en la carpeta";
                    }
                } else {
                    echo "No se pudo encontrar el registro a eliminar";
                }
            }
        }
    }

    if (isset($_POST['vehModelFormAction'])) {

        if ($_POST['vehModelFormAction'] == "create") {

            if (isset($_POST['veh-model-name']) && isset($_POST['veh-model-description']) && isset($_POST['veh_model_state']) && isset($_POST['veh_model_brand']) && isset($_FILES['vehModelImageFile'])) {

                $veh_model_name = mysqli_real_escape_string($connection, $_POST['veh-model-name']);
                $veh_model_description = mysqli_real_escape_string($connection, $_POST['veh-model-description']);
                $veh_model_brand = mysqli_real_escape_string($connection, $_POST['veh_model_brand']);
                $veh_model_state = mysqli_real_escape_string($connection, $_POST['veh_model_state']);
                $veh_model_image_file = $_FILES['vehModelImageFile'];

                $check_existing_veh_model = mysqli_query($connection, "SELECT * FROM modelo_vehiculos WHERE veh_model_name = '$veh_model_name' AND veh_brand_identifier = '$veh_model_brand'");

                if (mysqli_num_rows($check_existing_veh_model) > 0) {

                    echo "Esta marca de vehículo ya está registrada";
                    return;
                }

                $selectedFileName = $veh_model_image_file['name'];
                $selectedFileTmpName = $veh_model_image_file['tmp_name'];
                $selectedFileSize = $veh_model_image_file['size'];
                $selectedFileType = $veh_model_image_file['type'];
                $selectedFileError = $veh_model_image_file['error'];

                $selectedFileExt = explode('.', $selectedFileName);
                $selectedFileActualExt = strtolower(end($selectedFileExt));

                $allowedExtensions = array('jpg', 'png', 'jpeg');

                if (in_array($selectedFileActualExt, $allowedExtensions)) {

                    if ($selectedFileError === 0) {

                        if ($selectedFileSize < 2000000) {

                            $selectedFileNewName = uniqid('vehicle_model_', true) . "." . $selectedFileActualExt;

                            $fileDestination = '../assets/imgs/uploads/vehicle-models/' . $selectedFileNewName;

                            if (move_uploaded_file($selectedFileTmpName, $fileDestination)) {

                                $random_chars = "ABCDEFFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz";

                                $veh_model_unique_id = substr(str_shuffle($random_chars), 0, 30);

                                $insert_veh_model = mysqli_query($connection, "INSERT INTO modelo_vehiculos (veh_model_unique_id, veh_brand_identifier, veh_model_name, veh_model_description, veh_model_state, veh_model_image_path) VALUES ('$veh_model_unique_id', '$veh_model_brand', '$veh_model_name', '$veh_model_description', '$veh_model_state', '$selectedFileNewName')");

                                if ($insert_veh_model) {

                                    $veh_model_array = array(
                                        "veh_model_unique_id" => $veh_model_unique_id,
                                        "veh_model_image_path" => $selectedFileNewName,
                                        "veh_model_add_status" => 'success'
                                    );

                                    $veh_model_array_res = json_encode($veh_model_array);

                                    echo $veh_model_array_res;

                                } else {
                                    echo "Hubo un error al añadir la marca de vehículo";
                                }
                            } else {
                                echo "Hubo un error moviendo el archivo";
                            }
                        } else {

                            echo "El archivo no puede pesar más de 2MB";
                        }
                    } else {

                        echo "Hubo un error subiendo el archivo";
                    }
                } else {

                    echo "Este archivo no es aceptado. Archivos aceptados: jpeg, jpg, png";
                }
            }

        }

        if ($_POST['vehModelFormAction'] == "edit") {

            if (isset($_POST['veh-model-name']) && isset($_POST['veh-model-description']) && isset($_POST['veh_model_state']) && isset($_POST['veh_model_id'])) {

                $veh_model_name = mysqli_real_escape_string($connection, $_POST['veh-model-name']);
                $veh_model_description = mysqli_real_escape_string($connection, $_POST['veh-model-description']);
                $veh_model_brand = mysqli_real_escape_string($connection, $_POST['veh_model_brand']);
                $veh_model_state = mysqli_real_escape_string($connection, $_POST['veh_model_state']);
                $veh_model_id = mysqli_real_escape_string($connection, $_POST['veh_model_id']);

                // echo "Se recibio editar con los siguientes datos: " . $veh_model_name . ", ",
                // $veh_model_description . ", " .
                // $veh_model_brand . ", " .
                // $veh_model_state . ", " .
                // $veh_model_id;

                $check_existing_veh_model = mysqli_query($connection, "SELECT * FROM modelo_vehiculos WHERE veh_model_unique_id = '$veh_model_id'");

                if (mysqli_num_rows($check_existing_veh_model) > 0) {

                    if (isset($_FILES['vehModelImageFile'])) {

                        $fetch_image_path = mysqli_fetch_array($check_existing_veh_model);

                        $rutaArchivo = "../assets/imgs/uploads/vehicle-models/" . $fetch_image_path['veh_model_image_path'];

                        if (file_exists($rutaArchivo)) {
                            
                            if (unlink($rutaArchivo)) {

                                $get_new_brand_image = $_FILES['vehModelImageFile'];

                                $selectedFileName = $get_new_brand_image['name'];
                                $selectedFileTmpName = $get_new_brand_image['tmp_name'];
                                $selectedFileSize = $get_new_brand_image['size'];
                                $selectedFileType = $get_new_brand_image['type'];
                                $selectedFileError = $get_new_brand_image['error'];

                                $selectedFileExt = explode('.', $selectedFileName);
                                $selectedFileActualExt = strtolower(end($selectedFileExt));

                                $allowedExtensions = array('jpg', 'png', 'jpeg');

                                if (in_array($selectedFileActualExt, $allowedExtensions)) {

                                    if ($selectedFileError === 0) {

                                        if ($selectedFileSize < 2000000) {

                                            $selectedFileNewName = uniqid('vehicle_model_', true) . "." . $selectedFileActualExt;

                                            $fileDestination = '../assets/imgs/uploads/vehicle-models/' . $selectedFileNewName;

                                            if (move_uploaded_file($selectedFileTmpName, $fileDestination)) {

                                                $random_chars = "ABCDEFFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz";

                                                $brand_unique_id = substr(str_shuffle($random_chars), 0, 30);

                                                $update_model_with_image = mysqli_query($connection, "UPDATE modelo_vehiculos SET veh)model_brand = '$veh_model_brand', veh_model_name = '$veh_model_name', veh_model_description = '$veh_model_description', veh_model_state = '$veh_model_state', veh_model_image_path = '$selectedFileNewName' WHERE veh_model_unique_id = '$veh_model_id'");

                                                if ($update_model_with_image) {

                                                    $veh_model_array = array(
                                                        "veh_model_update_status" => "success",
                                                        "new_veh_model_image_path_name" => $selectedFileNewName,
                                                    );

                                                    $veh_model_array_res = json_encode($veh_model_array);

                                                    echo $veh_model_array_res;

                                                } else {
                                                    echo "Hubo un error al actualizar el modelo del vehículo";
                                                }
                                            } else {
                                                echo "Hubo un error moviendo el nuevo archivo";
                                            }
                                        } else {

                                            echo "El archivo no puede pesar más de 2MB";
                                        }
                                    } else {

                                        echo "Hubo un error subiendo el archivo";
                                    }
                                } else {

                                    echo "Este archivo no es aceptado. Archivos aceptados: jpeg, jpg, png";
                                }
                            } else {
                                echo "No se pudo eliminar el archivo";
                            }

                        } else {
                            echo "No se pudo encontrar el archivo";
                        }

                    } else {

                        $update_veh_model = mysqli_query($connection, "UPDATE modelo_vehiculos SET veh_brand_identifier = '$veh_model_brand', veh_model_name = '$veh_model_name', veh_model_description = '$veh_model_description', veh_model_state = '$veh_model_state' WHERE veh_model_unique_id = '$veh_model_id'");

                        if ($update_veh_model) {

                            $veh_model_array = array(
                                "veh_model_update_status" => "success"
                            );
                        }
                        $veh_model_array = json_encode($brand_array);
                        echo $veh_model_array;
                    }
                } else {
                    echo "No se pudo encontrar el modelo a editar";
                }
            } else {
                echo "Faltan datos por completar";
            }
        }

        if ($_POST['vehModelFormAction'] == "delete") {

            if (isset($_POST['veh_model_id_to_delete'])) {

                $veh_model_id_to_delete = mysqli_real_escape_string($connection, $_POST['veh_model_id_to_delete']);

                $find_veh_model_id = mysqli_query($connection, "SELECT * FROM modelo_vehiculos WHERE veh_model_unique_id = '$veh_model_id_to_delete'");

                if (mysqli_num_rows($find_veh_model_id) > 0) {

                    $fetch_image_path = mysqli_fetch_array($find_veh_model_id);

                    $rutaArchivo = "../assets/imgs/uploads/vehicle-models/" . $fetch_image_path['veh_model_image_path'];

                    if (file_exists($rutaArchivo)) {

                        if (unlink($rutaArchivo)) {

                            $delete_veh_model = mysqli_query($connection, "DELETE FROM modelo_vehiculos WHERE veh_model_unique_id = '$veh_model_id_to_delete'");

                            if ($delete_veh_model) {
                                echo "veh_model_deleted";
                            } else {
                                echo "Hubo un error eliminando el registro";
                            }
                        } else {
                            echo "Hubo un error al eliminar el archivo";
                        }
                    } else {
                        echo "El archivo no existe en la carpeta";
                    }
                } else {
                    echo "No se pudo encontrar el registro a eliminar";
                }
            }
        }

    }
}
