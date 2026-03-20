class Card {
    constructor(name, description) {
        this.name = name;
        this.description = description;
        this.id = Date.now() + Math.random();
    }
    
    getHTML(extraContent = '') {
        return `
            <div class="card" data-card-id="${this.id}">
                ${extraContent}
                <h3>${this.name}</h3>
                <p class="card-description">${this.description}</p>
                <div class="card-actions" style="display: none;">
                    <button class="edit-btn">✎ Изменить</button>
                    <button class="delete-btn">✖ Удалить</button>
                </div>
            </div>
        `;
    }
}

class CreatureCard extends Card {
    constructor(name, description, attack, health) {
        super(name, description);
        this.attack = attack;
        this.health = health;
        this.type = 'Существо';
    }

    getHTML() {
        const extraContent = `
            <span class="card-type">${this.type}</span>
            <p class="card-stats">⚔️ Атака: ${this.attack} ♥️ Здоровье ${this.health}</p>
        `;
        return super.getHTML(extraContent);
    }
}

class SpellCard extends Card {
    constructor(name, description, manaCost) {
        super(name, description);
        this.manaCost = manaCost;
        this.type = 'Заклинание';
    }

    getHTML() {
        const extraContent = `
            <span class="card-type">${this.type}</span>
            <p class="card-stats">💰 Цена: ${this.manaCost} маны</p>
        `;
        return super.getHTML(extraContent);
    }
}

class ArtifactCard extends Card {
    constructor(name, description, durability) {
        super(name, description);
        this.durability = durability;
        this.type = 'Артефакт';
    }

    getHTML() {
        const extraContent = `
            <span class="card-type">${this.type}</span>
            <p class="card-stats">🛡️ Прочность: ${this.durability}</p>
        `;
        return super.getHTML(extraContent);
    }
}

let currentMode = 'view';
let cards = [];

function buildSite() {
    const body = document.body;
    body.innerHTML = '';
    
    const header = document.createElement('header');
    const h1 = document.createElement('h1');
    h1.textContent = 'Мои карты';
    
    const nav = document.createElement('nav');
    
    const viewBtn = document.createElement('button');
    viewBtn.id = 'btnView';
    viewBtn.textContent = 'Режим просмотра';
    
    const editBtn = document.createElement('button');
    editBtn.id = 'btnEdit';
    editBtn.textContent = 'Режим редактирования';
    
    nav.appendChild(viewBtn);
    nav.appendChild(editBtn);
    header.appendChild(h1);
    header.appendChild(nav);
    body.appendChild(header);
    
    const main = document.createElement('main');
    main.id = 'main-content';
    body.appendChild(main);
    
    const gridContainer = document.createElement('div');
    gridContainer.className = 'card-grid';
    main.appendChild(gridContainer);
    
    cards.forEach(card => {
        gridContainer.insertAdjacentHTML('beforeend', card.getHTML());
    });
    
    if (currentMode === 'edit') {
        document.querySelectorAll('.card-actions').forEach(el => el.style.display = 'flex');
        
        const formContainer = document.createElement('div');
        formContainer.className = 'add-form';
        formContainer.innerHTML = 
            `<h2>➕ Добавить новую карту</h2>
            <input type="text" id="new-name" placeholder="Название" required>
            <textarea id="new-desc" placeholder="Описание"></textarea>
            <select id="new-type">
                <option value="creature">Существо</option>
                <option value="spell">Заклинание</option>
                <option value="artifact">Артефакт</option>
            </select>
            <input type="number" id="new-attr1" placeholder="Атака (для существа)" value="0">
            <input type="number" id="new-attr2" placeholder="Здоровье/Цена/Прочность" value="1">
            <button id="add-card-btn">Добавить карту</button>`;
        main.appendChild(formContainer);
        
        document.getElementById('add-card-btn').addEventListener('click', addNewCard);
    }
    
    bindAct();

    document.getElementById('btnView').addEventListener('click', () => switchMode('view'));
    document.getElementById('btnEdit').addEventListener('click', () => switchMode('edit'));
}

function addNewCard() {
    const name = document.getElementById('new-name').value;
    const desc = document.getElementById('new-desc').value;
    const type = document.getElementById('new-type').value;
    const attr1 = document.getElementById('new-attr1').value;
    const attr2 = document.getElementById('new-attr2').value;
    
    if (!name || !desc) {
        alert('Пожалуйста, заполните название и описание');
        return;
    }
    
    let newCard;
    if (type === 'creature') {
        newCard = new CreatureCard(name, desc, Number(attr1) || 0, Number(attr2) || 1);
    } else if (type === 'spell') {
        newCard = new SpellCard(name, desc, Number(attr2) || 1);
    } else {
        newCard = new ArtifactCard(name, desc, Number(attr2) || 1);
    }
    
    cards.push(newCard);
    saveToLocStor();
    buildSite();
}

function bindAct() {
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const cardDiv = btn.closest('.card');
            const cardId = cardDiv.dataset.cardId;
            const cardName = cardDiv.querySelector('h3').textContent;
            
            if (confirm(`Точно хотите удалить карту "${cardName}"?`)) {
                cards = cards.filter(c => String(c.id) !== cardId);
                saveToLocStor();
                buildSite();
                alert(`Карта "${cardName}" удалена`);
            }
            saveToLocStor();
            buildSite();
        });
    });
    
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const cardDiv = btn.closest('.card');
            const cardId = cardDiv.dataset.cardId;
            const card = cards.find(c => String(c.id) === cardId);
            
            if (card) {
                const actions = cardDiv.querySelector('.card-actions');
                actions.style.display = 'none';
                
                const formDiv = document.createElement('div');
                formDiv.className = 'edit-form';
                formDiv.innerHTML = `
                    <input type="text" id="edit-name-${card.id}" value="${card.name}">
                    <textarea id="edit-desc-${card.id}" rows="2">${card.description}</textarea>
                    <button class="save-edit">Сохранить</button>
                    <button class="cancel-edit">Отмена</button>
                `;
                
                const desc = cardDiv.querySelector('.card-description');
                desc.insertAdjacentElement('afterend', formDiv);
                
                formDiv.querySelector('.save-edit').addEventListener('click', () => {
                    const newName = document.getElementById(`edit-name-${card.id}`).value;
                    const newDesc = document.getElementById(`edit-desc-${card.id}`).value;
                    
                    if (newName && newDesc) {
                        card.name = newName;
                        card.description = newDesc;
                        saveToLocStor();
                        buildSite();
                    } else {
                        alert('Заполните название и описание');
                    }
                });
                
                formDiv.querySelector('.cancel-edit').addEventListener('click', () => {
                    buildSite();
                });
            }
        });
    });
}

function switchMode(mode) {
    currentMode = mode;
    buildSite();
}

function saveToLocStor() {
    localStorage.setItem('cardCol', JSON.stringify(cards));
}

function loadFromLocStor() {
    const saved = localStorage.getItem('cardCol');
    if (saved) {
        try {
            const plainObjects = JSON.parse(saved);
            cards = plainObjects.map(obj => {
                if (obj.type === 'Существо') {
                    return new CreatureCard(obj.name, obj.description, obj.attack, obj.health);
                } else if (obj.type === 'Заклинание') {
                    return new SpellCard(obj.name, obj.description, obj.manaCost);
                } else if (obj.type === 'Артефакт') {
                    return new ArtifactCard(obj.name, obj.description, obj.durability);
                }
                return null;
            }).filter(card => card !== null);
            
            cards.forEach((card, index) => {
                if (plainObjects[index]) {
                    card.id = plainObjects[index].id;
                }
            });
        } catch (e) {
            console.error("Ошибка загрузки", e);
            initDefCards();
        }
    } else {
        initDefCards();
    }
}

function initDefCards() {
    cards = [
        new CreatureCard('Гоблин-копейщик', 'Маленький, но противный гоблин с острым копьем.', 2, 1),
        new SpellCard('Огненный шар', 'Мощное заклинание, наносящее урон всем врагам.', 5),
        new ArtifactCard('Кольцо скорости', 'Позволяет атаковать первым.', 3)
    ];
}

document.addEventListener('DOMContentLoaded', () => {
    loadFromLocStor();
    buildSite();
});