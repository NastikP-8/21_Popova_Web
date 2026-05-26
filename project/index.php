<?php
session_start();
require_once 'includes/db.php';
require_once 'includes/header.php';
?>

<h1>Добро пожаловать в Физический калькулятор!</h1>

<?php if (isset($_SESSION['user_id'])): ?>
    <!-- КОНТЕНТ ДЛЯ АВТОРИЗОВАННОГО ПОЛЬЗОВАТЕЛЯ -->
    <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <p style="color: green; font-size: 18px;">
            Вы вошли как: <strong><?php echo htmlspecialchars($_SESSION['username']); ?></strong>
            <?php if ($_SESSION['role'] === 'admin'): ?>
                <span>(Администратор)</span>
            <?php endif; ?>
        </p>
        <p><a href="/logout.php">Выйти из системы</a></p>
    </div>

    <h2>Доступные разделы:</h2>
    <ul>
        <?php if ($_SESSION['role'] === 'admin'): ?>
            <li><a href="/admin/">Админ-панель (управление пользователями)</a></li>
        <?php endif; ?>
        <li><a href="#">Мои расчёты</a></li>
        <li><a href="#">Настройки профиля</a></li>
    </ul>

<?php else: ?>
    <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <p>Вы не авторизованы. Для доступа к расчётам необходимо войти в систему.</p>
        <p>
            <a href="/login.php" style="margin-right: 15px;">Войти</a>
            <a href="/register.php">Зарегистрироваться</a>
        </p>
    </div>

    <!-- <h2>Общедоступные разделы:</h2>
    <ul>
        <li><a href="/login.php">Вход в систему</a></li>
        <li><a href="/register.php">Регистрация</a></li>
    </ul> -->
<?php endif; ?>

<?php require_once 'includes/footer.php'; ?>