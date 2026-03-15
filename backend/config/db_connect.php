<?php
/**
 * Database configuration and connection for AutoVerse Music (PostgreSQL).
 * Edit the values below or set DB_HOST, DB_NAME, DB_USER, DB_PASS in your environment.
 */

$db_host = getenv('DB_HOST') ?: 'localhost';
$db_name = getenv('DB_NAME') ?: 'autoverse_music';
$db_user = getenv('DB_USER') ?: 'postgres';
$db_pass = getenv('DB_PASS') ?: '';

$dsn = "pgsql:host=$db_host;dbname=$db_name";

try {
    $pdo = new PDO($dsn, $db_user, $db_pass, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);
} catch (PDOException $e) {
    if (php_sapi_name() === 'cli') {
        throw $e;
    }
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed.',
        'error'   => $e->getMessage(),
    ]);
    exit;
}
