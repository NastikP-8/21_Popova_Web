<?php
require_once 'auth.php';
require_once '../includes/db.php';

$id = (int)($_GET['id'] ?? 0);
if ($id > 0) {
    $pdo->prepare("DELETE FROM problem_types WHERE id = ?")->execute([$id]);
}
header('Location: types.php');
exit;