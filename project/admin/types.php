<?php
require_once 'auth.php';
require_once '../includes/db.php';
require_once '../includes/header.php';

$types = $pdo->query("
    SELECT pt.*, pc.name as category_name 
    FROM problem_types pt 
    JOIN problem_categories pc ON pt.category_id = pc.id 
    ORDER BY pc.sort_order, pt.sort_order
")->fetchAll();
?>

<h1>Управление типами задач</h1>

<p><a href="type_edit.php">Добавить новую запись</a></p>

<table>
    <tr>
        <th>ID</th>
        <th>Название</th>
        <th>Категория</th>
        <th>Порядок</th>
        <th>Действия</th>
    </tr>
    <?php foreach ($types as $t): ?>
    <tr>
        <td><?php echo $t['id']; ?></td>
        <td><?php echo htmlspecialchars($t['name']); ?></td>
        <td><?php echo htmlspecialchars($t['category_name']); ?></td>
        <td><?php echo $t['sort_order']; ?></td>
        <td>
            <a href="type_edit.php?id=<?php echo $t['id']; ?>">Редактировать</a>
            <a href="type_delete.php?id=<?php echo $t['id']; ?>" onclick="return confirm('Удалить запись?')">Удалить</a>
        </td>
    </tr>
    <?php endforeach; ?>
</table>

<p><a href="/admin/">В админ-панель</a></p>

<?php require_once '../includes/footer.php'; ?>