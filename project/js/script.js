/**
 * Физический калькулятор - клиентский JavaScript
 */

(function() {
    'use strict';
    
    // При загрузке страницы
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🔬 Физический калькулятор загружен и готов к работе!');
        
        // Добавляем интерактивность
        initNavigation();
        initTables();
    });
    
    // Подсветка активной страницы в навигации
    function initNavigation() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('nav a');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath || 
                (currentPath.includes('/admin') && href === '/admin/') ||
                (currentPath === '/' && href === '/')) {
                link.style.background = 'rgba(255,255,255,0.3)';
            }
        });
    }
    
    // Добавляем сортировку таблиц
    function initTables() {
        const tables = document.querySelectorAll('table');
        
        tables.forEach((table, tableIndex) => {
            const headers = table.querySelectorAll('th');
            
            headers.forEach((header, index) => {
                header.style.cursor = 'pointer';
                header.title = 'Нажмите для сортировки';
                
                header.addEventListener('click', function() {
                    sortTable(table, index);
                });
            });
        });
    }
    
    // Функция сортировки таблицы
    function sortTable(table, columnIndex) {
        const tbody = table.querySelector('tbody') || table;
        const rows = Array.from(tbody.querySelectorAll('tr')).filter(row => 
            row.parentNode === tbody
        );
        
        const isAscending = table.dataset.sortColumn == columnIndex && 
                           table.dataset.sortOrder === 'asc';
        
        rows.sort((a, b) => {
            const aValue = a.children[columnIndex]?.textContent.trim() || '';
            const bValue = b.children[columnIndex]?.textContent.trim() || '';
            
            // Проверяем, является ли значение числом
            const aNum = parseFloat(aValue);
            const bNum = parseFloat(bValue);
            
            if (!isNaN(aNum) && !isNaN(bNum)) {
                return isAscending ? aNum - bNum : bNum - aNum;
            }
            
            // Текстовая сортировка
            return isAscending 
                ? aValue.localeCompare(bValue) 
                : bValue.localeCompare(aValue);
        });
        
        // Обновляем порядок строк
        rows.forEach(row => tbody.appendChild(row));
        
        // Сохраняем состояние сортировки
        table.dataset.sortColumn = columnIndex;
        table.dataset.sortOrder = isAscending ? 'desc' : 'asc';
    }
    
    // Экспорт для возможного использования в консоли
    window.PhysCalc = {
        version: '1.0',
        ready: true
    };
    
})();