updateBalance() {
    const totalIncome = this.transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = this.transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    // Update main balance (existing)
    document.getElementById('balance').textContent = this.formatCurrency(balance);
    document.getElementById('totalIncome').textContent = this.formatCurrency(totalIncome);
    document.getElementById('totalExpenses').textContent = this.formatCurrency(totalExpenses);

    // NEW: Update detailed balance display
    document.getElementById('totalIncomeDisplay').textContent = this.formatCurrency(totalIncome);
    document.getElementById('totalExpensesDisplay').textContent = this.formatCurrency(totalExpenses);
    document.getElementById('remainingBalance').textContent = this.formatCurrency(balance);

    // Color coding for balance
    const balanceElement = document.getElementById('balance');
    const remainingBalanceElement = document.getElementById('remainingBalance');
    const remainingBalanceSection = document.querySelector('.remaining-balance-section');
    
    if (balance >= 0) {
        balanceElement.style.color = 'white';
        remainingBalanceElement.style.color = '#FFD700'; // Gold color
        remainingBalanceSection.classList.remove('balance-negative');
    } else {
        balanceElement.style.color = '#FF6B6B';
        remainingBalanceElement.style.color = '#FF6B6B';
        remainingBalanceSection.classList.add('balance-negative');
    }

    // Warning if balance is low (less than 20% of income)
    if (balance > 0 && balance < (totalIncome * 0.2)) {
        remainingBalanceElement.classList.add('balance-warning');
    } else {
        remainingBalanceElement.classList.remove('balance-warning');
    }
}
