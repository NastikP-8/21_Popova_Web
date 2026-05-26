<?php
session_start();
require_once 'includes/db.php';
require_once 'includes/header.php';

$per_page = 10;
$page = max(1, (int)($_GET['page'] ?? 1));
$offset = ($page - 1) * $per_page;
$search = trim($_GET['search'] ?? '');
$category_filter = (int)($_GET['category'] ?? 0);

$where = [];
$params = [];
if ($search) {
    $where[] = "pt.name LIKE ?";
    $params[] = "%$search%";
}
if ($category_filter > 0) {
    $where[] = "pt.category_id = ?";
    $params[] = $category_filter;
}
$where_sql = $where ? "WHERE " . implode(" AND ", $where) : "";

$total = $pdo->prepare("SELECT COUNT(*) FROM problem_types pt $where_sql");
$total->execute($params);
$total_pages = ceil($total->fetchColumn() / $per_page);

$stmt = $pdo->prepare("
    SELECT pt.*, pc.name as category_name 
    FROM problem_types pt 
    JOIN problem_categories pc ON pt.category_id = pc.id 
    $where_sql 
    ORDER BY pc.sort_order, pt.sort_order 
    LIMIT $per_page OFFSET $offset
");
$stmt->execute($params);
$types = $stmt->fetchAll();
?>

<h1>Типы задач</h1>

<form method="GET">
    <p>
        <input type="text" name="search" placeholder="Поиск по названию" value="<?php echo htmlspecialchars($search); ?>">
        <select name="category">
            <option value="0">Все категории</option>
            <?php foreach ($pdo->query("SELECT id, name FROM problem_categories ORDER BY sort_order") as $cat): ?>
                <option value="<?php echo $cat['id']; ?>" <?php echo $category_filter == $cat['id'] ? 'selected' : ''; ?>><?php echo htmlspecialchars($cat['name']); ?></option>
            <?php endforeach; ?>
        </select>
        <button type="submit">Найти</button>
    </p>
</form>

<table>
    <tr>
        <th>ID</th>
        <th>Название</th>
        <th>Категория</th>
        <th>Формула</th>
        <th>Действия</th>
    </tr>
    <?php foreach ($types as $t): ?>
    <tr>
        <td><?php echo $t['id']; ?></td>
        <td><a href="/type.php?id=<?php echo $t['id']; ?>"><?php echo htmlspecialchars($t['name']); ?></a></td>
        <td><?php echo htmlspecialchars($t['category_name']); ?></td>
        <td><?php echo htmlspecialchars($t['formula_text']); ?></td>
        <td><a href="/type.php?id=<?php echo $t['id']; ?>">Просмотр</a></td>
    </tr>
    <?php endforeach; ?>
</table>

<p>
    <?php if ($page > 1): ?>
        <a href="?page=<?php echo $page-1; ?>&search=<?php echo urlencode($search); ?>&category=<?php echo $category_filter; ?>">Предыдущая</a>
    <?php endif; ?>

    Страница <?php echo $page; ?> из <?php echo $total_pages; ?>

    <?php if ($page < $total_pages): ?>
        <a href="?page=<?php echo $page+1; ?>&search=<?php echo urlencode($search); ?>&category=<?php echo $category_filter; ?>">Следующая</a>
    <?php endif; ?>
</p>

<?php require_once 'includes/footer.php'; ?>