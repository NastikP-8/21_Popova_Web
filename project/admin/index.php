<?php
require_once 'auth.php';
require_once '../includes/db.php';
require_once '../includes/header.php';
?>

<h1>Админ-панель</h1>
<p>Добро пожаловать, <?php echo htmlspecialchars($_SESSION['username']); ?>.</p>

<ul>
    <li><a href="types.php">Управление типами задач</a></li>
    <li><a href="reports.php">Отчёты и статистика</a></li>
</ul>

<h2>Пользователи</h2>

<table>
    <tr>
        <th>ID</th>
        <th>Логин</th>
        <th>Email</th>
        <th>Роль</th>
        <th>Статус</th>
        <th>Создан</th>
    </tr>
    <?php foreach ($pdo->query("SELECT id, username, email, role, is_blocked, created_at FROM users ORDER BY id") as $u): ?>
    <tr>
        <td><?php echo $u['id']; ?></td>
        <td><?php echo htmlspecialchars($u['username']); ?></td>
        <td><?php echo htmlspecialchars($u['email']); ?></td>
        <td><?php echo $u['role']; ?></td>
        <td><?php echo $u['is_blocked'] ? 'Заблокирован' : 'Активен'; ?></td>
        <td><?php echo $u['created_at']; ?></td>
    </tr>
    <?php endforeach; ?>
</table>

<?php require_once '../includes/footer.php'; ?>