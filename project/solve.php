<?php
session_start();
require_once 'includes/db.php';
require_once 'includes/header.php';

function math_calc($expression) {
    $expression = str_replace(' ', '', $expression);
    
    if (preg_match('/^[\d\+\-\*\/\.\(\)]+$/', $expression)) {
        return eval("return $expression;");
    }
    
    return null;
}

$id = (int)($_GET['id'] ?? 0);
$stmt = $pdo->prepare("SELECT pt.*, pc.name as category_name FROM problem_types pt JOIN problem_categories pc ON pt.category_id = pc.id WHERE pt.id = ?");
$stmt->execute([$id]);
$type = $stmt->fetch();

if (!$type) {
    echo "<p>Тип задачи не найден.</p>";
    require_once 'includes/footer.php';
    exit;
}

$is_fav = false;
if (isset($_SESSION['user_id'])) {
    $fav_action = $_GET['fav'] ?? '';
    if ($fav_action === 'add') {
        $stmt = $pdo->prepare("INSERT IGNORE INTO favorites (user_id, problem_type_id) VALUES (?, ?)");
        $stmt->execute([$_SESSION['user_id'], $id]);
    }
    $stmt = $pdo->prepare("SELECT id FROM favorites WHERE user_id = ? AND problem_type_id = ?");
    $stmt->execute([$_SESSION['user_id'], $id]);
    $is_fav = $stmt->fetch() ? true : false;
}

$input_fields = json_decode($type['input_fields'], true)['fields'] ?? [];
$output_fields = json_decode($type['output_fields'], true)['fields'] ?? [];
$formulas = json_decode($type['formula_expression'], true);
$result_val = null;
$steps = [];
$errors = [];
$found_var = '';

$all_fields = [];
foreach ($input_fields as $f) $all_fields[] = ['name' => $f['name'], 'label' => $f['label'], 'unit' => $f['unit']];
foreach ($output_fields as $f) $all_fields[] = ['name' => $f['name'], 'label' => $f['label'], 'unit' => $f['unit']];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $vars = [];
    $empty_count = 0;
    $empty_name = '';
    
    foreach ($all_fields as $f) {
        $val = trim($_POST[$f['name']] ?? '');
        if ($val === '') {
            $empty_count++;
            $empty_name = $f['name'];
        } elseif (!is_numeric($val)) {
            $errors[$f['name']] = "Поле должно быть числом.";
        } else {
            $vars[$f['name']] = (float)$val;
        }
    }
    
    if ($empty_count == 0) {
        $errors['general'] = "Оставьте одно поле пустым.";
    } elseif ($empty_count > 1) {
        $errors['general'] = "Оставьте пустым только одно поле.";
    } elseif (empty($errors)) {
        $c_stmt = $pdo->query("SELECT symbol, value FROM constants");
        while ($c = $c_stmt->fetch()) {
            $vars[$c['symbol']] = (float)$c['value'];
        }
        
        $found = false;
        foreach ($formulas as $out_name => $expression) {
            $expr_vars = [];
            preg_match_all('/[a-zA-Z_]+/', $expression, $matches);
            foreach ($matches[0] as $m) {
                if ($m !== $out_name) $expr_vars[] = $m;
            }
            
            if ($empty_name === $out_name && count(array_diff($expr_vars, array_keys($vars))) === 0) {
                $substituted = $expression;
                foreach ($vars as $var => $val) {
                    $substituted = str_replace($var, $val, $substituted);
                }
                
                $calculated = math_calc($substituted);
                if ($calculated === null) {
                    $errors['calc'] = "Ошибка: деление на ноль.";
                } else {
                    $result_val = $calculated;
                    $found_var = $empty_name;
                    $steps[] = "Исходная формула: $out_name = $expression";
                    $steps[] = "Подстановка известных значений: $out_name = $substituted";
                    $steps[] = "$out_name = " . round($calculated, 4);
                    
                    if (isset($_SESSION['user_id'])) {
                        $save_input = $vars;
                        $save_input[$empty_name] = '?';
                        $stmt = $pdo->prepare("INSERT INTO calculations (user_id, problem_type_id, input_data, result_data) VALUES (?, ?, ?, ?)");
                        $stmt->execute([$_SESSION['user_id'], $id, json_encode($save_input, JSON_UNESCAPED_UNICODE), json_encode([$empty_name => $calculated], JSON_UNESCAPED_UNICODE)]);
                    }
                }
                $found = true;
                break;
            }
        }
        
        if (!$found) {
            $errors['general'] = "Не удалось найти формулу для вычисления.";
        }
    }
}
?>

<h1><?php echo htmlspecialchars($type['name']); ?></h1>

<p><strong>Категория:</strong> <?php echo htmlspecialchars($type['category_name']); ?></p>
<p><strong>Формула:</strong> <?php echo htmlspecialchars($type['formula_text']); ?></p>

<?php if (isset($errors['general'])): ?>
    <div class="error-block"><?php echo htmlspecialchars($errors['general']); ?></div>
<?php endif; ?>
<?php if (isset($errors['calc'])): ?>
    <div class="error-block"><?php echo htmlspecialchars($errors['calc']); ?></div>
<?php endif; ?>

<form method="POST">
    <p>Заполните все поля, кроме одного.</p>
    <?php foreach ($all_fields as $f): ?>
        <p>
            <label><?php echo htmlspecialchars($f['label']); ?> (<?php echo htmlspecialchars($f['unit']); ?>):</label><br>
            <input type="text" name="<?php echo htmlspecialchars($f['name']); ?>" value="<?php echo htmlspecialchars($_POST[$f['name']] ?? ''); ?>" size="10">
            <?php if (isset($errors[$f['name']])): ?>
                <br><span class="error-message"><?php echo htmlspecialchars($errors[$f['name']]); ?></span>
            <?php endif; ?>
        </p>
    <?php endforeach; ?>
    <p><button type="submit">Рассчитать</button></p>
</form>

<?php if ($result_val !== null && empty($errors)): ?>
    <h2>Результат</h2>
    <?php foreach ($all_fields as $f): ?>
        <?php if ($f['name'] === $found_var): ?>
            <p><strong><?php echo htmlspecialchars($f['label']); ?>:</strong> <?php echo round($result_val, 4); ?> <?php echo htmlspecialchars($f['unit']); ?></p>
        <?php endif; ?>
    <?php endforeach; ?>
    
    <h2>Пошаговое решение</h2>
    <ol>
        <?php foreach ($steps as $s): ?>
            <li><?php echo htmlspecialchars($s); ?></li>
        <?php endforeach; ?>
    </ol>
<?php endif; ?>

<p><a href="/calculator.php">Вернуться к выбору задачи</a></p>

<?php if (isset($_SESSION['user_id'])): ?>
    <?php if ($is_fav): ?>
        <p style="color: green;">❤️ В избранном</p>
    <?php else: ?>
        <form method="GET" action="/solve.php" style="display: inline;">
            <input type="hidden" name="id" value="<?php echo $id; ?>">
            <input type="hidden" name="fav" value="add">
            <button type="submit">В избранное</button>
        </form>
    <?php endif; ?>
<?php endif; ?>

<?php require_once 'includes/footer.php'; ?>