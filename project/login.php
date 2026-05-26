<?php
require_once 'includes/db.php';
session_start();

$error = '';

// Если пользователь уже авторизован, сразу на главную
if (isset($_SESSION['user_id'])) {
    header('Location: /');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';

    if (empty($username) || empty($password)) {
        $error = 'Введите имя пользователя и пароль.';
    } else {
        $stmt = $pdo->prepare("SELECT id, username, password_hash, role, is_blocked FROM users WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch();

        if ($user) {
            if ($user['is_blocked']) {
                $error = 'Ваш аккаунт заблокирован.';
            } elseif (password_verify($password, $user['password_hash'])) {
                // Успешный вход
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['username'] = $user['username'];
                $_SESSION['role'] = $user['role'];
                header('Location: /');
                exit;
            } else {
                $error = 'Неверный пароль.';
            }
        } else {
            $error = 'Пользователь с таким именем не найден.';
        }
    }
}

require_once 'includes/header.php';
?>

<h1>Вход в систему</h1>

<?php if ($error): ?>
    <div style="color: red; border: 1px solid red; padding: 10px; margin-bottom: 15px;">
        <?php echo htmlspecialchars($error); ?>
    </div>
<?php endif; ?>

<form method="POST" action="/login.php">
    <p>
        <label>Имя пользователя:</label><br>
        <input type="text" name="username" required>
    </p>
    <p>
        <label>Пароль:</label><br>
        <input type="password" name="password" required>
    </p>
    <p>
        <button type="submit">Войти</button>
    </p>
</form>

<p>Нет аккаунта? <a href="/register.php">Зарегистрироваться</a></p>

<?php require_once 'includes/footer.php'; ?>