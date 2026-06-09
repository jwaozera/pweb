// Estado da aplicação (Lista de Transações)
let transactions = [];

// Seletores do DOM
const form = document.getElementById('transaction-form');
const descInput = document.getElementById('desc');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const transactionList = document.getElementById('transaction-list');

// Seletores do Dashboard
const incomeDisplay = document.getElementById('total-income');
const expenseDisplay = document.getElementById('total-expense');
const balanceDisplay = document.getElementById('total-balance');

// Inicialização
function init() {
    // Carregar do localStorage se houver (Bônus legal para persistência na UI)
    const stored = localStorage.getItem('transactions');
    if (stored) {
        transactions = JSON.parse(stored);
    }
    
    updateUI();
}

// Atualiza a interface (Tabela e Dashboard)
function updateUI() {
    renderList();
    updateDashboard();
    saveToLocalStorage();
}

// Renderiza a lista de transações
function renderList() {
    transactionList.innerHTML = '';

    if (transactions.length === 0) {
        transactionList.innerHTML = `
            <tr>
                <td colspan="4">
                    <div class="empty-state">
                        <i class="bi bi-inbox"></i>
                        <p>Nenhuma transação registrada ainda.</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    transactions.forEach(transaction => {
        const tr = document.createElement('tr');
        
        // Formatar valor
        const formattedAmount = formatCurrency(transaction.amount);
        
        // Definir classes com base no tipo
        const isIncome = transaction.type === 'income';
        const typeBadge = isIncome ? 
            `<span class="badge-income">Receita</span>` : 
            `<span class="badge-expense">Despesa</span>`;
            
        const amountClass = isIncome ? 'text-success fw-bold' : 'text-danger fw-bold';
        const amountPrefix = isIncome ? '+' : '-';

        tr.innerHTML = `
            <td>${transaction.desc}</td>
            <td class="${amountClass}">${amountPrefix} ${formattedAmount}</td>
            <td>${typeBadge}</td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-danger" onclick="removeTransaction(${transaction.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        
        transactionList.appendChild(tr);
    });
}

// Atualiza os valores do Dashboard
function updateDashboard() {
    const incomes = transactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + t.amount, 0);
        
    const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + t.amount, 0);
        
    const balance = incomes - expenses;

    incomeDisplay.innerText = formatCurrency(incomes);
    expenseDisplay.innerText = formatCurrency(expenses);
    balanceDisplay.innerText = formatCurrency(balance);
}

// Adicionar transação
form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Validação
    const desc = descInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const type = typeInput.value;

    if (desc === '' || isNaN(amount) || amount <= 0 || type === '') {
        alert('Por favor, preencha todos os campos com valores válidos.');
        return;
    }

    const transaction = {
        id: generateID(),
        desc,
        amount,
        type
    };

    transactions.push(transaction);

    // Resetar formulário
    descInput.value = '';
    amountInput.value = '';
    typeInput.value = '';
    
    // Focar no input de descrição para facilitar múltiplas adições
    descInput.focus();

    updateUI();
});

// Remover transação (global para poder ser chamada inline no HTML)
window.removeTransaction = function(id) {
    transactions = transactions.filter(t => t.id !== id);
    updateUI();
};

// Utilitários
function generateID() {
    return Math.floor(Math.random() * 100000000);
}

function formatCurrency(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function saveToLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Iniciar a aplicação
init();
