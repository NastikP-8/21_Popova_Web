<?php
require_once 'includes/db.php';
require_once 'includes/header.php';

$errors = [];
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if (empty($username) || empty($email) || empty($password)) {
        $errors[] = 'Все поля обязательны для заполнения.';
    } elseif (strlen($password) < 6) {
        $errors[] = 'Пароль должен содержать минимум 6 символов.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Некорректный формат email.';
    } else {
        $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
        $stmt->execute([$username, $email]);
        if ($stmt->fetch()) {
            $errors[] = 'Пользователь с таким именем или email уже существует.';
        } else {
            $hashed = password_hash($password, PASSWORD_DEFAULT);
            $stmt = $pdo->prepare("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)");
            $stmt->execute([$username, $email, $hashed]);
            $success = 'Регистрация прошла успешно! Теперь вы можете <a href="/login.php">войти</a>.';
        }
    }
}
?>

<h1>Регистрация</h1>

<?php if (!empty($errors)): ?>
    <div style="color: red; border: 1px solid red; padding: 10px; margin-bottom: 15px;">
        <?php foreach ($errors as $error): ?>
            <p><?php echo htmlspecialchars($error); ?></p>
        <?php endforeach; ?>
    </div>
<?php endif; ?>

<?php if ($success): ?>
    <div style="color: green; border: 1px solid green; padding: 10px; margin-bottom: 15px;">
        <?php echo $success; ?>
    </div>
<?php else: ?>
    <form method="POST" action="/register.php">
        <p>
            <label>Имя пользователя:</label><br>
            <input type="text" name="username" required>
        </p>
        <p>
            <label>Email:</label><br>
            <input type="email" name="email" required>
        </p>
        <p>
            <label>Пароль (минимум 6 символов):</label><br>
            <input type="password" name="password" required>
        </p>
        <p>
            <button type="submit">Зарегистрироваться</button>
        </p>
    </form>
<?php endif; ?>

<p>Уже есть аккаунт? <a href="/login.php">Войти</a></p>

<?php require_once 'includes/footer.php'; ?>