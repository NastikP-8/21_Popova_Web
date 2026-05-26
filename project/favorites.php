<?php
session_start();
require_once 'includes/db.php';

if (!isset($_SESSION['user_id'])) {
    header('Location: /login.php');
    exit;
}

$action = $_GET['action'] ?? '';
$type_id = (int)($_GET['type_id'] ?? 0);

if ($action === 'add' && $type_id > 0) {
    $stmt = $pdo->prepare("INSERT IGNORE INTO favorites (user_id, problem_type_id) VALUES (?, ?)");
    $stmt->execute([$_SESSION['user_id'], $type_id]);
    header('Location: /favorites.php');
    exit;
}

if ($action === 'remove' && $type_id > 0) {
    $stmt = $pdo->prepare("DELETE FROM favorites WHERE user_id = ? AND problem_type_id = ?");
    $stmt->execute([$_SESSION['user_id'], $type_id]);
    header('Location: /favorites.php');
    exit;
}

$stmt = $pdo->prepare("
    SELECT f.*, pt.name as type_name, pt.formula_text 
    FROM favorites f 
    JOIN problem_types pt ON f.problem_type_id = pt.id 
    WHERE f.user_id = ? 
    ORDER BY f.created_at DESC
");
$stmt->execute([$_SESSION['user_id']]);
$favorites = $stmt->fetchAll();

require_once 'includes/header.php';
?>

<h1>Избранные задачи</h1>

<?php if (empty($favorites)): ?>
    <p>У вас пока нет избранных задач.</p>
    <p><a href="/calculator.php">Перейти к калькулятору</a></p>
<?php else: ?>
    <table>
        <tr>
            <th>Задача</th>
            <th>Формула</th>
            <th>Действия</th>
        </tr>
        <?php foreach ($favorites as $fav): ?>
            <tr>
                <td><?php echo htmlspecialchars($fav['type_name']); ?></td>
                <td><?php echo htmlspecialchars($fav['formula_text']); ?></td>
                <td>
                    <a href="/solve.php?id=<?php echo $fav['problem_type_id']; ?>">Решать</a>
                    <a href="/favorites.php?action=remove&type_id=<?php echo $fav['problem_type_id']; ?>" onclick="return confirm('Удалить из избранного?')">Удалить</a>
                </td>
            </tr>
        <?php endforeach; ?>
    </table>
<?php endif; ?>

<?php require_once 'includes/footer.php'; ?>