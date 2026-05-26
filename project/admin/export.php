<?php
require_once 'auth.php';
require_once '../includes/db.php';

$table = $_GET['table'] ?? '';

if ($table === 'calculations') {
    $stmt = $pdo->query("
        SELECT c.id, u.username, pt.name as task, c.input_data, c.result_data, c.created_at 
        FROM calculations c 
        JOIN users u ON c.user_id = u.id 
        JOIN problem_types pt ON c.problem_type_id = pt.id 
        ORDER BY c.created_at DESC
    ");
    
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename=calculations.csv');
    
    $output = fopen('php://output', 'w');
    fputcsv($output, ['ID', 'Пользователь', 'Задача', 'Входные данные', 'Результат', 'Дата']);
    
    while ($row = $stmt->fetch()) {
        fputcsv($output, [
            $row['id'],
            $row['username'],
            $row['task'],
            $row['input_data'],
            $row['result_data'],
            $row['created_at']
        ]);
    }
    
    fclose($output);
    exit;
}
?>