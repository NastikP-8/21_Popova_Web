function playGame() {
    alert('Это игра "Камень, ножницы, бумага"!\nПобедитель определится по 3 раундам.');
    
    let playerScore = 0;
    let computerScore = 0;
    let rounds = 0;
    
    const choices1 = ['камень', 'ножницы', 'бумага', 'к', 'н', 'б'];
    
    while (rounds < 3 && playerScore < 3 && computerScore < 3) {
        let playerChoice;
        while (true) {
            playerChoice = prompt(`Раунд ${rounds + 1}\nВаш счет: ${playerScore} | Счет компьютера: ${computerScore}\n\nВыберите: камень(к), ножницы(н) или бумага(б):`);
            
            if (playerChoice === null) {
                if (confirm('Точно хотите выйти из игры?')) {
                    alert('Приходите еще!');
                    return;
                }
                continue;
            }
            
            playerChoice = playerChoice.trim().toLowerCase();
            
            if (!playerChoice) {
                alert('Ошибка: Вы ничего не ввели');
            } else if (!choices1.includes(playerChoice)) {
                alert('Ошибка: Можно ввести только: камень(к), ножницы(н) или бумага(б)');
            } else {
                break;
            }
        }
        
        const choices2 = ['камень', 'ножницы', 'бумага'];
        const computerChoice = choices2[Math.floor(Math.random() * 3)];
        alert(`Компьютер выбрал: ${computerChoice}`);
        
        if (playerChoice === computerChoice || (playerChoice === 'к' && computerChoice === 'камень') || (playerChoice === 'н' && computerChoice === 'ножницы') || (playerChoice === 'б' && computerChoice === 'бумага')) {
            alert('Ничья!');
        } else if (
            ((playerChoice === 'камень' || playerChoice === 'к') && computerChoice === 'ножницы') ||
            ((playerChoice === 'ножницы' || playerChoice === 'н') && computerChoice === 'бумага') ||
            ((playerChoice === 'бумага' || playerChoice === 'б') && computerChoice === 'камень')
        ) {
            alert('Вы выиграли раунд!');
            playerScore++;
        } else {
            alert('Компьютер выиграл раунд!');
            computerScore++;
        }
        
        rounds++;
    }
    
    let resultMessage;
    if (playerScore > computerScore) {
        resultMessage = 'Победа за естественным интеллектом🏆!';
    } else if (computerScore > playerScore) {
        resultMessage = 'Победа пока за ИИ.. Зато вы отвлекли его от планирования восстания!';
    } else {
        resultMessage = 'Ничья!🤝';
    }
    
    alert(`Игра окончена!\n\nСчет: ${playerScore} : ${computerScore}\n${resultMessage}`);
    
    if (confirm('Хотите сыграть еще раз?')) {
        playGame();
    }
}