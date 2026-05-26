<?php
session_start();
require_once 'includes/db.php';
require_once 'includes/header.php';

$categories = $pdo->query("SELECT pc.*, (SELECT COUNT(*) FROM problem_types WHERE category_id = pc.id) as task_count FROM problem_categories pc ORDER BY pc.sort_order")->fetchAll();

$favs = [];
if (isset($_SESSION['user_id'])) {
    $stmt = $pdo->prepare("SELECT problem_type_id FROM favorites WHERE user_id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    while ($row = $stmt->fetch()) {
        $favs[] = $row['problem_type_id'];
    }
}
?>

<h1>Физический калькулятор</h1>

<?php if (isset($_SESSION['user_id'])): ?>
    <p>Вы вошли как: <strong><?php echo htmlspecialchars($_SESSION['username']); ?></strong></p>
<?php endif; ?>

<?php foreach ($categories as $cat): ?>
    <?php if ($cat['task_count'] > 0): ?>
        <h2><?php echo htmlspecialchars($cat['name']); ?></h2>
        <ul>
            <?php 
            $types = $pdo->prepare("SELECT * FROM problem_types WHERE category_id = ? ORDER BY sort_order");
            $types->execute([$cat['id']]);
            while ($type = $types->fetch()):
            ?>
                <li>
                    <a href="/solve.php?id=<?php echo $type['id']; ?>"><?php echo htmlspecialchars($type['name']); ?></a>
                    <?php if (in_array($type['id'], $favs)): ?>
                        <span style="color: red;">&#9829;</span>
                    <?php endif; ?>
                </li>
            <?php endwhile; ?>
        </ul>
    <?php endif; ?>
<?php endforeach; ?>

<?php require_once 'includes/footer.php'; ?>