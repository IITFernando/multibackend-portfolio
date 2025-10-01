<?php
// =============================
// CORS
// =============================
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Manejo del preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// =============================
// Conexión a la BD
// =============================
$servidor = "localhost";
$dbuser   = "root";
$dbpass   = "";
$dbname   = "bdbackfront";

$cnx = new mysqli($servidor, $dbuser, $dbpass, $dbname);
if ($cnx->connect_error) {
    die(json_encode(["error" => "Conexión no establecida: " . $cnx->connect_error]));
}
$cnx->set_charset("utf8");

// =============================
// Obtener método y parámetros
// =============================
$metodo = $_SERVER["REQUEST_METHOD"];
$id     = isset($_GET["id"]) ? intval($_GET["id"]) : null;

// =============================
// Ruteo por método
// =============================
switch ($metodo) {
    case "GET":
        getProductos($cnx);
        break;

    case "PUT":
        actualizarProductos($cnx, $id);
        break;

    default:
        http_response_code(405); // Method Not Allowed
        echo json_encode(["error" => "Método no permitido"]);
}

// =============================
// Funciones
// =============================
function getProductos($cnx)
{
    $consulta  = "SELECT * FROM productos WHERE Cantidad > 0";
    $registros = $cnx->query($consulta);

    if (!$registros || $registros->num_rows === 0) {
        echo json_encode(["error" => "No hay productos registrados"]);
        return;
    }

    $productos = [];
    while ($producto = $registros->fetch_assoc()) {
        $productos[] = $producto;
    }

    echo json_encode($productos);
}

function actualizarProductos($cnx, $id)
{
    $datosRecibidos = json_decode(file_get_contents('php://input'), true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(["error" => "JSON inválido"]);
        return;
    }

    if (!isset($datosRecibidos["productosVendidos"]) || !is_array($datosRecibidos["productosVendidos"])) {
        http_response_code(400);
        echo json_encode(["error" => "No se recibió un arreglo 'productosVendidos' válido"]);
        return;
    }

    $productosVendidos = $datosRecibidos["productosVendidos"];
    if (count($productosVendidos) === 0) {
        http_response_code(400);
        echo json_encode(["error" => "El arreglo 'productosVendidos' está vacío"]);
        return;
    }

    $stmt = $cnx->prepare("UPDATE productos SET Cantidad = Cantidad-? WHERE Codigo = ?");
    if (!$stmt) {
        http_response_code(500);
        echo json_encode(["error" => "Error en la preparación de la consulta"]);
        return;
    }

    foreach ($productosVendidos as $producto) {
        if (!isset($producto["Codigo"]) || !isset($producto["Cantidad"])) {
            continue;
        }

        $codigo   = $producto["Codigo"];
        $cantidad = intval($producto["Cantidad"]);

        $stmt->bind_param("is", $cantidad, $codigo);
        $stmt->execute();
    }

    echo json_encode(["success" => true, "message" => "Productos actualizados correctamente"]);
}

