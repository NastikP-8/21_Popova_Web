<?php
session_start();
require_once 'includes/db.php';
require_once 'includes/header.php';

$id = (int)($_GET['id'] ?? 0);
$stmt = $pdo->prepare("
    SELECT pt.*, pc.name as category_name 
    FROM problem_types pt 
    JOIN problem_categories pc ON pt.category_id = pc.id 
    WHERE pt.id = ?
");
$stmt->execute([$id]);
$type = $stmt->fetch();

if (!$type) {
    echo "<p>Запись не найдена.</p>";
    require_once 'includes/footer.php';
    exit;
}
?>

<h1><?php echo htmlspecialchars($type['name']); ?></h1>

<table>
    <tr><th>ID</th><td><?php echo $type['id']; ?></td></tr>
    <tr><th>Категория</th><td><?php echo htmlspecialchars($type['category_name']); ?></td></tr>
    <tr><th>Описание</th><td><?php echo nl2br(htmlspecialchars($type['description'])); ?></td></tr>
    <tr><th>Формула</th><td><?php echo htmlspecialchars($type['formula_text']); ?></td></tr>
    <tr><th>Выражение</th><td><?php echo htmlspecialchars($type['formula_expression']); ?></td></tr>
    <tr><th>Поля ввода</th><td><?php echo htmlspecialchars($type['input_fields']); ?></td></tr>
    <tr><th>Поля вывода</th><td><?php echo htmlspecialchars($type['output_fields']); ?></td></tr>
    <tr><th>Порядок</th><td><?php echo $type['sort_order']; ?></td></tr>
</table>

<p><a href="/types.php">Вернуться к списку</a></p>

<?php require_once 'includes/footer.php'; ?>