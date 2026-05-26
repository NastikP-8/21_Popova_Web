<?php
require_once 'auth.php';
require_once '../includes/db.php';

$id = $_GET['id'] ?? null;
$is_edit = $id !== null;

$type = [
    'category_id' => 0,
    'name' => '',
    'description' => '',
    'formula_text' => '',
    'formula_expression' => '{"result":"a * b"}',
    'input_fields' => '{"fields":[{"name":"a","label":"","unit":""},{"name":"b","label":"","unit":""}]}',
    'output_fields' => '{"fields":[{"name":"result","label":"","unit":""}]}',
    'sort_order' => 0
];
$errors = [];

if ($is_edit) {
    $stmt = $pdo->prepare("SELECT * FROM problem_types WHERE id = ?");
    $stmt->execute([$id]);
    $fetched = $stmt->fetch();
    if ($fetched) {
        $type = $fetched;
    } else {
        die("Запись не найдена");
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $category_id = (int)($_POST['category_id'] ?? 0);
    $description = trim($_POST['description'] ?? '');
    $formula_text = trim($_POST['formula_text'] ?? '');
    $sort_order = (int)($_POST['sort_order'] ?? 0);
    
    $input_names = $_POST['input_name'] ?? [];
    $input_labels = $_POST['input_label'] ?? [];
    $input_units = $_POST['input_unit'] ?? [];
    
    $output_names = $_POST['output_name'] ?? [];
    $output_labels = $_POST['output_label'] ?? [];
    $output_units = $_POST['output_unit'] ?? [];
    
    $formula_keys = $_POST['formula_key'] ?? [];
    $formula_exprs = $_POST['formula_expr'] ?? [];
    
    $input_fields_list = [];
    for ($i = 0; $i < count($input_names); $i++) {
        if (!empty($input_names[$i])) {
            $input_fields_list[] = [
                'name' => trim($input_names[$i]),
                'label' => trim($input_labels[$i]),
                'unit' => trim($input_units[$i])
            ];
        }
    }
    
    $output_fields_list = [];
    for ($i = 0; $i < count($output_names); $i++) {
        if (!empty($output_names[$i])) {
            $output_fields_list[] = [
                'name' => trim($output_names[$i]),
                'label' => trim($output_labels[$i]),
                'unit' => trim($output_units[$i])
            ];
        }
    }
    
    $formula_expr_json = [];
    for ($i = 0; $i < count($formula_keys); $i++) {
        if (!empty($formula_keys[$i]) && !empty($formula_exprs[$i])) {
            $formula_expr_json[trim($formula_keys[$i])] = trim($formula_exprs[$i]);
        }
    }
    
    $input_json = json_encode(['fields' => $input_fields_list], JSON_UNESCAPED_UNICODE);
    $output_json = json_encode(['fields' => $output_fields_list], JSON_UNESCAPED_UNICODE);
    $formula_json = json_encode($formula_expr_json, JSON_UNESCAPED_UNICODE);
    
    if (empty($name)) $errors['name'] = 'Название обязательно';
    if ($category_id <= 0) $errors['category_id'] = 'Выберите категорию';
    if (empty($formula_text)) $errors['formula_text'] = 'Текст формулы обязателен';
    if (empty($formula_expr_json) || $formula_expr_json === '{}') $errors['formula_expr'] = 'Нужна хотя бы одна формула';

    if (empty($errors)) {
        if ($is_edit) {
            $stmt = $pdo->prepare("UPDATE problem_types SET category_id=?, name=?, description=?, formula_text=?, formula_expression=?, input_fields=?, output_fields=?, sort_order=? WHERE id=?");
            $stmt->execute([$category_id, $name, $description, $formula_text, $formula_json, $input_json, $output_json, $sort_order, $id]);
        } else {
            $stmt = $pdo->prepare("INSERT INTO problem_types (category_id, name, description, formula_text, formula_expression, input_fields, output_fields, sort_order) VALUES (?,?,?,?,?,?,?,?)");
            $stmt->execute([$category_id, $name, $description, $formula_text, $formula_json, $input_json, $output_json, $sort_order]);
        }
        header('Location: types.php');
        exit;
    }
}

require_once '../includes/header.php';
?>

<h1><?php echo $is_edit ? 'Редактирование' : 'Добавление'; ?> типа задачи</h1>

<form method="POST">
    <p>
        <label>Название:</label><br>
        <input type="text" name="name" value="<?php echo htmlspecialchars($type['name']); ?>" size="50" required>
        <?php if (isset($errors['name'])) echo "<br><span>" . $errors['name'] . "</span>"; ?>
    </p>
    
    <p>
        <label>Категория:</label><br>
        <select name="category_id" required>
            <option value="">-- Выберите --</option>
            <?php foreach ($pdo->query("SELECT id, name FROM problem_categories ORDER BY sort_order") as $cat): ?>
                <option value="<?php echo $cat['id']; ?>" <?php echo (isset($type['category_id']) && $type['category_id'] == $cat['id']) ? 'selected' : ''; ?>><?php echo htmlspecialchars($cat['name']); ?></option>
            <?php endforeach; ?>
        </select>
        <?php if (isset($errors['category_id'])) echo "<br><span>" . $errors['category_id'] . "</span>"; ?>
    </p>
    
    <p>
        <label>Описание:</label><br>
        <textarea name="description" rows="3" cols="50"><?php echo htmlspecialchars($type['description']); ?></textarea>
    </p>
    
    <p>
        <label>Формула (как показывать пользователю):</label><br>
        <input type="text" name="formula_text" value="<?php echo htmlspecialchars($type['formula_text']); ?>" size="50" required>
        <?php if (isset($errors['formula_text'])) echo "<br><span>" . $errors['formula_text'] . "</span>"; ?>
    </p>

    <h2>Формулы для расчёта</h2>
    <p>Укажите, что и как вычислять:</p>
    
    <?php 
    $formula_expr = json_decode($type['formula_expression'], true) ?? ['result' => ''];
    $i = 0;
    foreach ($formula_expr as $key => $expr): 
    ?>
        <p>
            Имя результата: <input type="text" name="formula_key[]" value="<?php echo htmlspecialchars($key); ?>" size="10">
            Выражение: <input type="text" name="formula_expr[]" value="<?php echo htmlspecialchars($expr); ?>" size="30">
        </p>
    <?php 
        $i++;
    endforeach; 
    if ($i == 0):
    ?>
        <p>
            Имя результата: <input type="text" name="formula_key[]" size="10">
            Выражение: <input type="text" name="formula_expr[]" size="30">
        </p>
    <?php endif; ?>
    
    <p><small>В выражении используйте имена переменных из полей ввода (например, m * a) и константы (g).</small></p>
    <?php if (isset($errors['formula_expr'])) echo "<p><span>" . $errors['formula_expr'] . "</span></p>"; ?>

    <h2>Поля ввода (что вводит пользователь)</h2>
    
    <?php 
    $inputs = json_decode($type['input_fields'], true)['fields'] ?? [['name' => '', 'label' => '', 'unit' => '']];
    foreach ($inputs as $inp): 
    ?>
        <p>
            Имя переменной: <input type="text" name="input_name[]" value="<?php echo htmlspecialchars($inp['name']); ?>" size="10">
            Подпись: <input type="text" name="input_label[]" value="<?php echo htmlspecialchars($inp['label']); ?>" size="20">
            Ед. изм.: <input type="text" name="input_unit[]" value="<?php echo htmlspecialchars($inp['unit']); ?>" size="10">
        </p>
    <?php endforeach; ?>
    
    <p><small>Имя переменной используется в формуле (например, m, a, t). Подпись видит пользователь.</small></p>

    <h2>Поля вывода (результат)</h2>
    
    <?php 
    $outputs = json_decode($type['output_fields'], true)['fields'] ?? [['name' => '', 'label' => '', 'unit' => '']];
    foreach ($outputs as $out): 
    ?>
        <p>
            Имя переменной: <input type="text" name="output_name[]" value="<?php echo htmlspecialchars($out['name']); ?>" size="10">
            Подпись: <input type="text" name="output_label[]" value="<?php echo htmlspecialchars($out['label']); ?>" size="20">
            Ед. изм.: <input type="text" name="output_unit[]" value="<?php echo htmlspecialchars($out['unit']); ?>" size="10">
        </p>
    <?php endforeach; ?>
    
    <p><small>Имя должно совпадать с ключом в формуле расчёта.</small></p>
    
    <p>
        <label>Порядок:</label><br>
        <input type="number" name="sort_order" value="<?php echo htmlspecialchars($type['sort_order'] ?? '0'); ?>">
    </p>
    
    <p><button type="submit"><?php echo $is_edit ? 'Сохранить' : 'Добавить'; ?></button></p>
</form>

<p><a href="types.php">Вернуться к списку</a></p>

<?php require_once '../includes/footer.php'; ?>