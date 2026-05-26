<?php
require_once 'auth.php';
require_once '../includes/db.php';
require_once '../includes/header.php';

$total_users = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
$total_calcs = $pdo->query("SELECT COUNT(*) FROM calculations")->fetchColumn();
$total_types = $pdo->query("SELECT COUNT(*) FROM problem_types")->fetchColumn();
$total_favs = $pdo->query("SELECT COUNT(*) FROM favorites")->fetchColumn();

$top_tasks = $pdo->query("
    SELECT pt.name, COUNT(c.id) as cnt 
    FROM calculations c 
    JOIN problem_types pt ON c.problem_type_id = pt.id 
    GROUP BY pt.name 
    ORDER BY cnt DESC 
    LIMIT 5
")->fetchAll();

$top_users = $pdo->query("
    SELECT u.username, COUNT(c.id) as cnt 
    FROM calculations c 
    JOIN users u ON c.user_id = u.id 
    GROUP BY u.username 
    ORDER BY cnt DESC 
    LIMIT 5
")->fetchAll();

$recent = $pdo->query("
    SELECT c.*, u.username, pt.name as type_name 
    FROM calculations c 
    JOIN users u ON c.user_id = u.id 
    JOIN problem_types pt ON c.problem_type_id = pt.id 
    ORDER BY c.created_at DESC 
    LIMIT 10
")->fetchAll();
?>

<h1>Отчёты и статистика</h1>

<h2>Общая статистика</h2>
<table>
    <tr><th>Показатель</th><th>Значение</th></tr>
    <tr><td>Всего пользователей</td><td><?php echo $total_users; ?></td></tr>
    <tr><td>Всего расчётов</td><td><?php echo $total_calcs; ?></td></tr>
    <tr><td>Типов задач</td><td><?php echo $total_types; ?></td></tr>
    <tr><td>В избранном</td><td><?php echo $total_favs; ?></td></tr>
</table>

<h2>Топ-5 задач</h2>
<table>
    <tr><th>Задача</th><th>Расчётов</th></tr>
    <?php foreach ($top_tasks as $t): ?>
        <tr><td><?php echo htmlspecialchars($t['name']); ?></td><td><?php echo $t['cnt']; ?></td></tr>
    <?php endforeach; ?>
</table>

<h2>Топ-5 пользователей</h2>
<table>
    <tr><th>Пользователь</th><th>Расчётов</th></tr>
    <?php foreach ($top_users as $u): ?>
        <tr><td><?php echo htmlspecialchars($u['username']); ?></td><td><?php echo $u['cnt']; ?></td></tr>
    <?php endforeach; ?>
</table>

<h2>Последние расчёты</h2>
<table>
    <tr><th>Дата</th><th>Пользователь</th><th>Задача</th></tr>
    <?php foreach ($recent as $r): ?>
        <tr>
            <td><?php echo $r['created_at']; ?></td>
            <td><?php echo htmlspecialchars($r['username']); ?></td>
            <td><?php echo htmlspecialchars($r['type_name']); ?></td>
        </tr>
    <?php endforeach; ?>
</table>

<p><a href="export.php?table=calculations">Экспорт расчётов в CSV</a></p>
<p><a href="/admin/">В админ-панель</a></p>

<?php require_once '../includes/footer.php'; ?>