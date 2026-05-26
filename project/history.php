<?php
session_start();
require_once 'includes/db.php';
require_once 'includes/header.php';

if (!isset($_SESSION['user_id'])) {
    echo "<p>Для просмотра истории необходимо <a href='/login.php'>войти</a>.</p>";
    require_once 'includes/footer.php';
    exit;
}

$stmt = $pdo->prepare("SELECT c.*, pt.name as type_name FROM calculations c JOIN problem_types pt ON c.problem_type_id = pt.id WHERE c.user_id = ? ORDER BY c.created_at DESC LIMIT 50");
$stmt->execute([$_SESSION['user_id']]);
$history = $stmt->fetchAll();
?>

<h1>История расчётов</h1>

<?php if (empty($history)): ?>
    <p>Вы ещё не выполняли расчёты.</p>
<?php else: ?>
    <table>
        <tr>
            <th>Дата</th>
            <th>Задача</th>
            <th>Входные данные</th>
            <th>Результат</th>
            <th>Действия</th>
        </tr>
        <?php foreach ($history as $h): 
            $input = json_decode($h['input_data'], true);
            $res = json_decode($h['result_data'], true);
        ?>
            <tr>
                <td><?php echo $h['created_at']; ?></td>
                <td><?php echo htmlspecialchars($h['type_name']); ?></td>
                <td>
                    <?php foreach ($input as $k => $v): ?>
                        <?php echo htmlspecialchars($k); ?> = <?php echo $v; ?><br>
                    <?php endforeach; ?>
                </td>
                <td>
                    <?php foreach ($res as $k => $v): ?>
                        <?php echo htmlspecialchars($k); ?> = <?php echo round($v, 4); ?><br>
                    <?php endforeach; ?>
                </td>
                <td>
                    <a href="/solve.php?id=<?php echo $h['problem_type_id']; ?>">Повторить</a>
                </td>
            </tr>
        <?php endforeach; ?>
    </table>
<?php endif; ?>

<p><a href="/calculator.php">К калькулятору</a></p>

<?php require_once 'includes/footer.php'; ?>