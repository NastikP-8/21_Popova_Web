USE physics_calc;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS user_problems;
DROP TABLE IF EXISTS calculations;
DROP TABLE IF EXISTS problem_types;
DROP TABLE IF EXISTS problem_categories;
DROP TABLE IF EXISTS constants;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;


-- Таблица пользователей
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    is_blocked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица физических констант
CREATE TABLE constants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    symbol VARCHAR(20) NOT NULL,
    value DECIMAL(20,10) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    description TEXT
);

-- Таблица категорий задач
CREATE TABLE problem_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    sort_order INT DEFAULT 0
);

-- Таблица типов задач
CREATE TABLE problem_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    formula_text TEXT,  
    formula_expression TEXT,
    input_fields JSON, 
    output_fields JSON,
    sort_order INT DEFAULT 0,
    FOREIGN KEY (category_id) REFERENCES problem_categories(id) ON DELETE CASCADE
);

-- Таблица истории расчётов
CREATE TABLE calculations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    problem_type_id INT NOT NULL,
    input_data JSON NOT NULL,
    result_data JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (problem_type_id) REFERENCES problem_types(id) ON DELETE CASCADE
);

-- Таблица пользовательских задач
CREATE TABLE user_problems (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    problem_type_id INT NOT NULL,
    input_data JSON NOT NULL,
    result_data JSON NOT NULL,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (problem_type_id) REFERENCES problem_types(id) ON DELETE CASCADE
);

-- Индексы для быстрого поиска
CREATE INDEX idx_calculations_user ON calculations(user_id);
CREATE INDEX idx_calculations_date ON calculations(created_at);
CREATE INDEX idx_user_problems_user ON user_problems(user_id);


INSERT INTO users (username, email, password_hash, role, is_blocked) VALUES
('admin', 'admin@yandex.ru', '$2y$10$rrx07./kgFu.6mQTjsYhDuyL2Lo7IVFEHn1aWvfZJNLe8gyj6qyDW', 'admin', 0),
('ivanov', 'ivanov@mail.ru', '$2y$10$rrx07./kgFu.6mQTjsYhDuyL2Lo7IVFEHn1aWvfZJNLe8gyj6qyDW', 'user', 0),
('petrov', 'petrov@mail.ru', '$2y$10$rrx07./kgFu.6mQTjsYhDuyL2Lo7IVFEHn1aWvfZJNLe8gyj6qyDW', 'user', 0),
('sokolova', 'sokolova@gmail.com', '$2y$10$rrx07./kgFu.6mQTjsYhDuyL2Lo7IVFEHn1aWvfZJNLe8gyj6qyDW', 'user', 0),
('orlova', 'orlova@yandex.ru', '$2y$10$rrx07./kgFu.6mQTjsYhDuyL2Lo7IVFEHn1aWvfZJNLe8gyj6qyDW', 'user', 0);

-- Константы
INSERT INTO constants (name, symbol, value, unit, description) VALUES
('Ускорение свободного падения', 'g', 9.8, 'м/с²', 'Стандартное ускорение свободного падения на Земле'),
('Гравитационная постоянная', 'G', 0.000000000066743, 'Н·м²/кг²', 'Фундаментальная физическая константа'),
('Плотность воды', 'ρ_вода', 1000, 'кг/м³', 'Плотность воды при 4°C'),
('Стандартное атмосферное давление', 'P_атм', 101325, 'Па', 'Давление на уровне моря');

-- Категории задач
INSERT INTO problem_categories (name, description, sort_order) VALUES
('Кинематика', 'Движение тел, скорость, ускорение, время, расстояние', 1),
('Динамика', 'Силы, масса, ускорение, законы Ньютона', 2),
('Работа и энергия', 'Механическая работа, кинетическая и потенциальная энергия, мощность', 3),
('Импульс и столкновения', 'Импульс тела, законы сохранения, удары', 4),
('Гидростатика', 'Давление, сила Архимеда, гидростатическое давление', 5);

-- Типы задач
INSERT INTO problem_types (category_id, name, description, formula_text, formula_expression, input_fields, output_fields, sort_order) VALUES
(1, 'Равномерное движение', 'Расчёт расстояния при равномерном движении', 's = v · t', '{"s":"v*t","v":"s/t","t":"s/v"}', '{"fields":[{"name":"v","label":"Скорость","unit":"м/с"},{"name":"t","label":"Время","unit":"с"}]}', '{"fields":[{"name":"s","label":"Расстояние","unit":"м"}]}', 1),
(1, 'Равноускоренное движение', 'Путь и скорость при равноускоренном движении', 's = a·t²/2, v = a·t', '{"s":"0.5*a*t*t","v":"a*t"}', '{"fields":[{"name":"a","label":"Ускорение","unit":"м/с²"},{"name":"t","label":"Время","unit":"с"}]}', '{"fields":[{"name":"s","label":"Расстояние","unit":"м"},{"name":"v","label":"Скорость","unit":"м/с"}]}', 2),
(2, 'Второй закон Ньютона', 'Расчёт силы по массе и ускорению', 'F = m · a', '{"F":"m*a","m":"F/a","a":"F/m"}', '{"fields":[{"name":"m","label":"Масса","unit":"кг"},{"name":"a","label":"Ускорение","unit":"м/с²"}]}', '{"fields":[{"name":"F","label":"Сила","unit":"Н"}]}', 1),
(2, 'Сила тяжести', 'Расчёт силы тяжести тела', 'F = m · g', '{"F":"m*9.8","m":"F/9.8"}', '{"fields":[{"name":"m","label":"Масса","unit":"кг"}]}', '{"fields":[{"name":"F","label":"Сила тяжести","unit":"Н"}]}', 2),
(3, 'Механическая работа', 'Работа постоянной силы', 'A = F · s · cos(α)', '{"A":"F*s*cos(alpha*3.14159/180)"}', '{"fields":[{"name":"F","label":"Сила","unit":"Н"},{"name":"s","label":"Перемещение","unit":"м"},{"name":"alpha","label":"Угол","unit":"°"}]}', '{"fields":[{"name":"A","label":"Работа","unit":"Дж"}]}', 1),
(3, 'Кинетическая энергия', 'Энергия движущегося тела', 'E = m·v² / 2', '{"E":"0.5*m*v*v"}', '{"fields":[{"name":"m","label":"Масса","unit":"кг"},{"name":"v","label":"Скорость","unit":"м/с"}]}', '{"fields":[{"name":"E","label":"Кинетическая энергия","unit":"Дж"}]}', 2),
(3, 'Потенциальная энергия', 'Энергия тела в поле тяжести', 'E = m · g · h', '{"E":"m*9.8*h"}', '{"fields":[{"name":"m","label":"Масса","unit":"кг"},{"name":"h","label":"Высота","unit":"м"}]}', '{"fields":[{"name":"E","label":"Потенциальная энергия","unit":"Дж"}]}', 3),
(3, 'Мощность', 'Мощность при совершении работы', 'P = A / t', '{"P":"A/t","A":"P*t","t":"A/P"}', '{"fields":[{"name":"A","label":"Работа","unit":"Дж"},{"name":"t","label":"Время","unit":"с"}]}', '{"fields":[{"name":"P","label":"Мощность","unit":"Вт"}]}', 4),
(4, 'Давление твёрдого тела', 'Давление на поверхность', 'p = F / S', '{"p":"F/S","F":"p*S","S":"F/p"}', '{"fields":[{"name":"F","label":"Сила","unit":"Н"},{"name":"S","label":"Площадь","unit":"м²"}]}', '{"fields":[{"name":"p","label":"Давление","unit":"Па"}]}', 1),
(4, 'Гидростатическое давление', 'Давление столба жидкости', 'p = ρ · g · h', '{"p":"ρ*9.8*h"}', '{"fields":[{"name":"ρ","label":"Плотность","unit":"кг/м³"},{"name":"h","label":"Глубина","unit":"м"}]}', '{"fields":[{"name":"p","label":"Давление","unit":"Па"}]}', 2),
(4, 'Сила Архимеда', 'Выталкивающая сила', 'F = ρ · g · V', '{"F":"ρ*9.8*V"}', '{"fields":[{"name":"ρ","label":"Плотность жидкости","unit":"кг/м³"},{"name":"V","label":"Объём тела","unit":"м³"}]}', '{"fields":[{"name":"F","label":"Сила Архимеда","unit":"Н"}]}', 3),
(5, 'Закон Ома', 'Сила тока в цепи', 'I = U / R', '{"I":"U/R","U":"I*R","R":"U/I"}', '{"fields":[{"name":"U","label":"Напряжение","unit":"В"},{"name":"R","label":"Сопротивление","unit":"Ом"}]}', '{"fields":[{"name":"I","label":"Сила тока","unit":"А"}]}', 1),
(5, 'Мощность тока', 'Электрическая мощность', 'P = U · I', '{"P":"U*I","U":"P/I","I":"P/U"}', '{"fields":[{"name":"U","label":"Напряжение","unit":"В"},{"name":"I","label":"Сила тока","unit":"А"}]}', '{"fields":[{"name":"P","label":"Мощность","unit":"Вт"}]}', 2);

-- История расчётов
INSERT INTO calculations (user_id, problem_type_id, input_data, result_data) VALUES
(1, 1, '{"v":10,"t":5}', '{"s":50}'),
(1, 3, '{"m":5,"a":2}', '{"F":10}'),
(4, 2, '{"a":2,"t":3}', '{"s":9,"v":6}'),
(5, 7, '{"m":10,"h":5}', '{"E":490}'),
(1, 11, '{"ρ":1000,"V":0.01}', '{"F":98}'),
(3, 3, '{"m":10,"a":9.8}', '{"F":98}'),
(2, 12, '{"U":220,"R":44}', '{"I":5}');

-- Пользовательские задачи
INSERT INTO user_problems (user_id, name, description, problem_type_id, input_data, result_data, is_public) VALUES
(1, 'Вес', 'Вес 75-килограммового человека на Земле', 4, '{"m":75}', '{"F":735}', 0),
(2, 'Падение яблока', 'Скорость падения яблока с дерева за 1.5 сек', 2, '{"t":1.5}', '{"v":14.7}', 0),
(4, 'Зарядка телефона', 'Мощность адаптера', 8, '{"A":18000,"t":3600}', '{"P":5}', 1),
(5, 'Давление воды в озере', 'Давление воды на глубине 5 м', 10, '{"ρ":1000,"h":5}', '{"p":49000}', 1),
(3, 'Мощность лампочки', '', 13, '{"U":220,"I":0.27}', '{"P":59.4}', 1);