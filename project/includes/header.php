<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PhysCalc</title>
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
    <header>
        <div class="header-container">
            <h1>PhysCalc</h1>
            <nav>
                <a href="/">Главная</a>
                <a href="/types.php">Типы задач</a>
                <a href="/calculator.php">Калькулятор</a>
                <?php if (isset($_SESSION['user_id'])): ?>
                    <a href="/history.php">История</a>
                    <a href="/favorites.php">Избранное</a>
                    <?php if ($_SESSION['role'] === 'admin'): ?>
                        <a href="/admin/">Админ-панель</a>
                    <?php endif; ?>
                    <a href="/logout.php">Выход</a>
                <?php else: ?>
                    <a href="/register.php">Регистрация</a>
                    <a href="/login.php">Вход</a>
                <?php endif; ?>
            </nav>
        </div>
    </header>
    <main>