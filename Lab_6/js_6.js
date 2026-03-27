let currentPage = 'posts';

document.querySelectorAll('.menu-btn').forEach(btn => {
    btn.onclick = function() {
        currentPage = this.getAttribute('data-page');
        if (currentPage === 'posts') showPosts();
        if (currentPage === 'facts') showFacts();
        if (currentPage === 'users') showUsers();
    };
});

function showPosts() {
    document.getElementById('content').innerHTML = `
        <h2>Управление записями</h2>
        <button onclick="getPosts()">Загрузить записи</button>
        <section id="postsList"></section>
        
        <h3>Добавить</h3>
        <input id="newTitle" placeholder="Заголовок">
        <textarea id="newBody" placeholder="Текст"></textarea>
        <button onclick="createPost()">Создать</button>
        <section id="createResult"></section>
        
        <h3>Изменить</h3>
        <input id="updateId" placeholder="Номер">
        <input id="updateTitle" placeholder="Новый заголовок">
        <textarea id="updateBody" placeholder="Новый текст"></textarea>
        <button onclick="updatePost()">Изменить</button>
        <section id="updateResult"></section>
        
        <h3>Удалить</h3>
        <input id="deleteId" placeholder="Номер">
        <button onclick="deletePost()">Удалить</button>
        <section id="deleteResult"></section>
    `;
}

async function getPosts() {
    let section = document.getElementById('postsList');
    section.innerHTML = 'Загрузка...';
    let res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
    let posts = await res.json();
    let html = '';
    for (let i = 0; i < posts.length; i++) {
        html += `<section class="card"><b>№${posts[i].id}</b><br>${posts[i].title}<br>${posts[i].body}</section>`;
    }
    section.innerHTML = html;
}

async function createPost() {
    let title = document.getElementById('newTitle').value;
    let body = document.getElementById('newBody').value;
    let section = document.getElementById('createResult');
    
    if (!title || !body) {
        section.innerHTML = 'Заполните поля';
        return;
    }
    
    section.innerHTML = 'Отправка...';
    let res = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({title: title, body: body, userId: 1})
    });
    let data = await res.json();
    section.innerHTML = `Создано! Номер: ${data.id}`;
    document.getElementById('newTitle').value = '';
    document.getElementById('newBody').value = '';
}

async function updatePost() {
    let id = document.getElementById('updateId').value;
    let title = document.getElementById('updateTitle').value;
    let body = document.getElementById('updateBody').value;
    let section = document.getElementById('updateResult');
    
    if (!id) {
        section.innerHTML = 'Введите номер';
        return;
    }
    
    section.innerHTML = 'Изменение...';
    await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({title: title, body: body})
    });
    section.innerHTML = `Запись ${id} изменена`;
    document.getElementById('updateId').value = '';
    document.getElementById('updateTitle').value = '';
    document.getElementById('updateBody').value = '';
}

async function deletePost() {
    let id = document.getElementById('deleteId').value;
    let section = document.getElementById('deleteResult');
    
    if (!id) {
        section.innerHTML = 'Введите номер';
        return;
    }
    
    section.innerHTML = 'Удаление...';
    await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {method: 'DELETE'});
    section.innerHTML = `Запись ${id} удалена`;
    document.getElementById('deleteId').value = '';
}

function showFacts() {
    document.getElementById('content').innerHTML = `
        <h2>Факты о котах</h2>
        <button onclick="getOneFact()">Один факт</button>
        <section id="oneFact"></section>
        <button onclick="getThreeFacts()">Три факта</button>
        <section id="threeFacts"></section>
    `;
}

async function getOneFact() {
    let section = document.getElementById('oneFact');
    section.innerHTML = 'Загрузка...';
    let res = await fetch('https://catfact.ninja/fact');
    let data = await res.json();
    section.innerHTML = `<section class="card">🐱 ${data.fact}</section>`;
}

async function getThreeFacts() {
    let section = document.getElementById('threeFacts');
    section.innerHTML = 'Загрузка...';
    let html = '';
    for (let i = 0; i < 3; i++) {
        let res = await fetch('https://catfact.ninja/fact');
        let data = await res.json();
        html += `<section class="card">${i+1}. 🐱 ${data.fact}</section>`;
    }
    section.innerHTML = html;
}

function showUsers() {
    document.getElementById('content').innerHTML = `
        <h2>Пользователи</h2>
        <h3>Случайные пользователи</h3>
        <button onclick="getOneUser()">Один пользователь</button>
        <section id="oneUser"></section>
        <button onclick="getFiveUsers()">Пять пользователей</button>
        <section id="fiveUsers"></section>
        
        <h3>Обновить должность</h3>
        <input id="jobInput" placeholder="Должность">
        <button onclick="updateJob()">Обновить</button>
        <section id="jobResult"></section>
        
        <h3>Удалить пользователя</h3>
        <input id="deleteName" placeholder="Имя">
        <button onclick="deleteUser()">Удалить</button>
        <section id="deleteResult2"></section>
    `;
}

async function getOneUser() {
    let section = document.getElementById('oneUser');
    section.innerHTML = 'Загрузка...';
    let res = await fetch('https://randomuser.me/api/');
    let data = await res.json();
    let u = data.results[0];
    section.innerHTML = `<section class="card"><b>${u.name.first} ${u.name.last}</b><br>${u.email}<br>${u.location.city}</section>`;
}

async function getFiveUsers() {
    let section = document.getElementById('fiveUsers');
    section.innerHTML = 'Загрузка...';
    let res = await fetch('https://randomuser.me/api/?results=5');
    let data = await res.json();
    let html = '';
    for (let i = 0; i < data.results.length; i++) {
        let u = data.results[i];
        html += `<section class="card"><b>${u.name.first} ${u.name.last}</b><br>${u.email}</section>`;
    }
    section.innerHTML = html;
}

async function updateJob() {
    let job = document.getElementById('jobInput').value;
    let section = document.getElementById('jobResult');
    
    if (!job) {
        section.innerHTML = 'Введите должность';
        return;
    }
    
    section.innerHTML = 'Обновление...';
    await new Promise(resolve => setTimeout(resolve, 500));
    section.innerHTML = `✅ Должность "${job}" обновлена`;
    document.getElementById('jobInput').value = '';
}

async function deleteUser() {
    let name = document.getElementById('deleteName').value;
    let section = document.getElementById('deleteResult2');
    
    if (!name) {
        section.innerHTML = 'Введите имя';
        return;
    }
    
    section.innerHTML = 'Удаление...';
    await new Promise(resolve => setTimeout(resolve, 500));
    section.innerHTML = `✅ Пользователь "${name}" удалён`;
    document.getElementById('deleteName').value = '';
}

showPosts();