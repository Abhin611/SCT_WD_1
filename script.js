// Highlight the current page link in the navigation
const navLinks = document.querySelectorAll('.navigation a');

navLinks.forEach(link => {
    if (link.href === window.location.href) {
        link.style.fontWeight = 'bold';
        link.style.textDecoration = 'underline';
        link.style.color = '#ffc107'; 
    }
});

// Stopwatch Functionality
let startTime, updatedTime, difference, tInterval;
let running = false;
let lapCounter = 1;

const display = document.getElementById('display');
const lapsContainer = document.getElementById('laps');

if (display) {
    document.getElementById('startBtn').onclick = start;
    document.getElementById('pauseBtn').onclick = pause;
    document.getElementById('resetBtn').onclick = reset;
    document.getElementById('lapBtn').onclick = recordLap;

    function start() {
        if (!running) {
            startTime = new Date().getTime() - (difference || 0);
            tInterval = setInterval(updateTime, 100);
            running = true;
        }
    }

    function updateTime() {
        updatedTime = new Date().getTime();
        difference = updatedTime - startTime;

        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        display.innerHTML = (hours < 10 ? "0" : "") + hours + ":" +
                            (minutes < 10 ? "0" : "") + minutes + ":" +
                            (seconds < 10 ? "0" : "") + seconds;
    }

    function pause() {
        clearInterval(tInterval);
        running = false;
    }

    function reset() {
        clearInterval(tInterval);
        running = false;
        difference = 0;
        display.innerHTML = "00:00:00";
        lapsContainer.innerHTML = '';
        lapCounter = 1;
    }

    function recordLap() {
        if (running) {
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);
            
            const lapTime = (hours < 10 ? "0" : "") + hours + ":" +
                            (minutes < 10 ? "0" : "") + minutes + ":" +
                            (seconds < 10 ? "0" : "") + seconds;

                            lapsContainer.innerHTML += `<div>Lap ${lapCounter}: ${lapTime}</div>`;
            lapCounter++;
        }
    }
}

// Tic-Tac-Toe Functionality
const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
const resetTicTacToeButton = document.getElementById('resetButtontictactoe');
const vsComputerCheckbox = document.getElementById('vsComputer');

if (boardElement) {
    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let isGameActive = true;

    resetTicTacToeButton.addEventListener('click', resetButtontictactoe);
    createTicTacToeBoard();

    function createTicTacToeBoard() {
        boardElement.innerHTML = '';
        board.forEach((cell, index) => {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            cellElement.setAttribute('data-index', index);
            cellElement.innerText = cell;

            cellElement.addEventListener('click', () => handleTicTacToeCellClick(index));
            boardElement.appendChild(cellElement);
        });
    }

    function handleTicTacToeCellClick(index) {
        if (board[index] === '' && isGameActive) {
            board[index] = currentPlayer;
            checkTicTacToeWin();
            if (isGameActive) {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                if (vsComputerCheckbox.checked && currentPlayer === 'O') {
                    computerTicTacToeMove();
                }
            }
            createTicTacToeBoard();
        }
    }

    function checkTicTacToeWin() {
        const winningConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6],
        ];

        for (const condition of winningConditions) {
            const [a, b, c] = condition;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                statusElement.innerText = `${board[a]} wins!`;
                isGameActive = false;
                return;
            }
        }

        if (!board.includes('')) {
            statusElement.innerText = "It's a draw!";
            isGameActive = false;
        }
    }

    function computerTicTacToeMove() {
        const availableCells = board.map((cell, index) => cell === '' ? index : null).filter(cell => cell !== null);
        const randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
        if (randomIndex !== undefined) {
            board[randomIndex] = currentPlayer;
            checkTicTacToeWin();
            if (isGameActive) {
                currentPlayer = 'X'; // Switch back to player
            }
            createTicTacToeBoard();
        }
    }

    function resetButtontictactoe() {
        board = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        isGameActive = true;
        statusElement.innerText = '';
        createTicTacToeBoard();
    }
}

// To-Do List Functionality
const taskInput = document.getElementById('taskInput');
const taskDate = document.getElementById('taskDate');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

addTaskBtn.addEventListener('click', addTask);

function addTask() {
    const taskValue = taskInput.value.trim();
    const dateValue = taskDate.value;

    if (taskValue) {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="task-text">${taskValue} ${dateValue ? ` (Due: ${new Date(dateValue).toLocaleString()})` : ''}</span>
            <div class="task-controls">
                <button onclick="markCompleted(this)">Complete</button>
                <button onclick="editTask(this)">Edit</button>
                <button onclick="removeTask(this)">Remove</button>
            </div>
        `;
        taskList.appendChild(li);
        taskInput.value = '';
        taskDate.value = '';
    } else {
        alert('Please enter a task!');
    }
}

function markCompleted(button) {
    const taskItem = button.parentElement.parentElement;
    const taskText = taskItem.querySelector('.task-text');
    taskText.classList.toggle('completed');
    button.innerText = taskText.classList.contains('completed') ? 'Undo' : 'Complete';
}

function editTask(button) {
    const taskItem = button.parentElement.parentElement;
    const taskText = taskItem.querySelector('.task-text');
    
    const newTaskValue = prompt('Edit your task:', taskText.innerText.split(' (Due:')[0]);
    if (newTaskValue !== null && newTaskValue.trim() !== '') {
        taskText.innerText = newTaskValue + (taskText.innerText.includes('(Due:') ? taskText.innerText.slice(taskText.innerText.indexOf('(Due:')) : '');
    }
}

function removeTask(button) {
    const taskItem = button.parentElement.parentElement;
    taskList.removeChild(taskItem);
}
