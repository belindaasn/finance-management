class FinanceManager {
    constructor() {
        this.transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        this.budget = JSON.parse(localStorage.getItem('budget')) || null;
        this.currency = 'Rp';
        this.init();
    }

    init() {
        this.checkAutoReset();
        this.renderTransactions();
        this.updateBalance();
        this.setupEventListeners();
        this.setupBudget();
        this.loadFormState();
        if (this.budget) {
            document.getElementById('budgetDisplay').style.display = 'block';
            this.updateBudgetDisplay();
            this.updateResetTimer();
            this.updateCategoryDropdown();
        }
        
        this.registerServiceWorker();
        this.addManualResetButton();
    }

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./sw.js')
                .then(registration => {
                    console.log('SW registered');
                })
                .catch(error => {
                    console.log('SW registration failed: ', error);
                });
        }
    }

    addManualResetButton() {
        const existingBtn = document.getElementById('manualResetBtn');
        if (existingBtn) existingBtn.remove();

        const manualResetBtn = document.createElement('button');
        manualResetBtn.id = 'manualResetBtn';
        manualResetBtn.textContent = '🔄 Reset Manual';
        manualResetBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: var(--warning);
            color: white;
            border: none;
            padding: 12px 16px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            z-index: 1000;
            box-shadow: var(--shadow-lg);
        `;
        manualResetBtn.onclick = () => this.manualReset();
        document.body.appendChild(manualResetBtn);
    }

    checkAutoReset() {
        if (!this.budget) return;

        const now = new Date();
        const lastReset = new Date(this.budget.lastReset || this.budget.createdAt);
        const period = this.budget.period;
        
        console.log('=== AUTO-RESET CHECK ===');
        console.log('Period:', period);
        console.log('Last reset:', lastReset.toLocaleDateString('id-ID'));
        console.log('Now:', now.toLocaleDateString('id-ID'));

        let shouldReset = false;

        switch (period) {
            case 'daily':
                shouldReset = now.toDateString() !== lastReset.toDateString();
                console.log('Daily check - different day?', shouldReset);
                break;
                
            case 'weekly':
                const lastResetWeek = this.getWeekNumber(lastReset);
                const currentWeek = this.getWeekNumber(now);
                shouldReset = currentWeek !== lastResetWeek || now.getFullYear() !== lastReset.getFullYear();
                console.log('Weekly check - different week?', shouldReset);
                break;
                
            case 'monthly':
                shouldReset = now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear();
                console.log('Monthly check - different month?', shouldReset);
                break;
                
            case 'yearly':
                shouldReset = now.getFullYear() !== lastReset.getFullYear();
                console.log('Yearly check - different year?', shouldReset);
                break;
        }

        if (shouldReset) {
            console.log('🔄 AUTO-RESET TRIGGERED!');
            this.resetBudget();
            this.budget.lastReset = now.toISOString();
            this.saveBudgetToLocalStorage();
        } else {
            console.log('✅ No reset needed');
        }
        console.log('=======================');
    }

    getWeekNumber(date) {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    }

    resetBudget() {
        if (!this.budget) return;

        console.log('Resetting all categories to 0...');
        
        Object.keys(this.budget.categories).forEach(category => {
            this.budget.categories[category].spent = 0;
        });
        
        this.saveBudgetToLocalStorage();
        this.updateBudgetDisplay();
        this.showResetNotification();
        
        console.log('✅ Budget reset completed');
    }

    showResetNotification() {
        const periodLabels = {
            'daily': 'hari',
            'weekly': 'minggu', 
            'monthly': 'bulan',
            'yearly': 'tahun'
        };
        
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--success);
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            font-weight: 600;
            animation: slideDown 0.5s ease-out;
        `;
        
        notification.textContent = `🔄 Limit ${periodLabels[this.budget.period]}an telah direset!`;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    setupEventListeners() {
        document.getElementById('transactionForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTransaction();
        });

        document.getElementById('addCategory').addEventListener('click', () => {
            this.addCategoryField();
        });

        document.getElementById('removeCategory').addEventListener('click', () => {
            this.removeCategoryField();
        });

        document.getElementById('budgetPeriod').addEventListener('change', () => {
            this.saveFormState();
        });
        
        document.getElementById('totalBudget').addEventListener('input', () => {
            this.saveFormState();
        });

        document.getElementById('customCategories').addEventListener('input', (e) => {
            if (e.target.classList.contains('category-name') || e.target.classList.contains('category-amount')) {
                this.saveFormState();
            }
        });

        document.getElementById('type').addEventListener('change', (e) => {
            this.toggleCategoryField(e.target.value);
        });
    }

    toggleCategoryField(transactionType) {
        const categoryGroup = document.getElementById('categoryGroup');
        const categorySelect = document.getElementById('categorySelect');
        
        if (transactionType === 'expense') {
            categoryGroup.style.display = 'block';
            categorySelect.required = true;
        } else {
            categoryGroup.style.display = 'none';
            categorySelect.required = false;
            categorySelect.value = '';
        }
    }

    setupBudget() {
        document.getElementById('budgetForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.setBudgetPlan();
        });
    }

    addCategoryField() {
        const container = document.getElementById('customCategories');
        const categoryCount = container.children.length + 1;
        
        const categoryGroup = document.createElement('div');
        categoryGroup.className = 'category-group';
        categoryGroup.innerHTML = `
            <div class="form-group">
                <label>Kategori ${categoryCount}:</label>
                <input type="text" class="category-name" placeholder="Nama kategori" value="Kategori ${categoryCount}">
                <input type="number" class="category-amount" placeholder="Limit" value="0">
            </div>
        `;
        
        container.appendChild(categoryGroup);
        this.saveFormState();
    }

    removeCategoryField() {
        const container = document.getElementById('customCategories');
        if (container.children.length > 1) {
            container.removeChild(container.lastChild);
            this.saveFormState();
        }
    }

    saveFormState() {
        const formState = {
            period: document.getElementById('budgetPeriod').value,
            totalBudget: document.getElementById('totalBudget').value,
            categories: []
        };

        document.querySelectorAll('.category-group').forEach(element => {
            const name = element.querySelector('.category-name').value;
            const amount = element.querySelector('.category-amount').value;
            formState.categories.push({ name, amount });
        });

        localStorage.setItem('budgetFormState', JSON.stringify(formState));
    }

    loadFormState() {
        const savedState = localStorage.getItem('budgetFormState');
        if (savedState) {
            const formState = JSON.parse(savedState);
            
            document.getElementById('budgetPeriod').value = formState.period;
            document.getElementById('totalBudget').value = formState.totalBudget;
            
            const container = document.getElementById('customCategories');
            while (container.children.length > 1) {
                container.removeChild(container.lastChild);
            }
            
            if (formState.categories.length > 0) {
                const firstInput = container.querySelector('.category-name');
                const firstAmount = container.querySelector('.category-amount');
                firstInput.value = formState.categories[0].name;
                firstAmount.value = formState.categories[0].amount;
            }
            
            for (let i = 1; i < formState.categories.length; i++) {
                this.addCategoryField();
                const categoryGroup = container.children[i];
                const category = formState.categories[i];
                categoryGroup.querySelector('.category-name').value = category.name;
                categoryGroup.querySelector('.category-amount').value = category.amount;
            }
        }
    }

    setBudgetPlan() {
        const period = document.getElementById('budgetPeriod').value;
        const totalBudget = parseFloat(document.getElementById('totalBudget').value);
        
        const categories = {};
        let totalAllocated = 0;
        
        document.querySelectorAll('.category-group').forEach((element, index) => {
            const name = element.querySelector('.category-name').value || `Kategori ${index + 1}`;
            const amount = parseFloat(element.querySelector('.category-amount').value) || 0;
            
            categories[name] = { budget: amount, spent: 0 };
            totalAllocated += amount;
        });

        if (totalAllocated > totalBudget) {
            alert('Total limit kategori melebihi total limit keseluruhan! Sesuaikan lagi limit kamu.');
            return;
        }

        this.budget = {
            period: period,
            totalBudget: totalBudget,
            categories: categories,
            totalAllocated: totalAllocated,
            createdAt: new Date().toISOString(),
            lastReset: new Date().toISOString()
        };

        this.saveBudgetToLocalStorage();
        this.saveFormState();
        this.updateBudgetDisplay();
        this.updateCategoryDropdown();
        document.getElementById('budgetDisplay').style.display = 'block';
        this.updateResetTimer();
        this.addManualResetButton();
        
        alert('Limit pengeluaran berhasil diset! 🎯');
    }

    updateResetTimer() {
        if (!this.budget) return;

        const periodLabels = {
            'daily': 'Harian',
            'weekly': 'Mingguan', 
            'monthly': 'Bulanan',
            'yearly': 'Tahunan'
        };

        document.getElementById('periodLabel').textContent = periodLabels[this.budget.period];
        
        this.updateResetCountdown();
        setInterval(() => {
            this.updateResetCountdown();
        }, 60000);
    }

    getNextResetDate() {
        if (!this.budget) return new Date();
        
        const now = new Date();
        const period = this.budget.period;
        
        switch (period) {
            case 'daily':
                const tomorrow = new Date(now);
                tomorrow.setDate(tomorrow.getDate() + 1);
                tomorrow.setHours(0, 0, 0, 0);
                return tomorrow;
                
            case 'weekly':
                const nextMonday = new Date(now);
                const daysUntilMonday = (1 + 7 - now.getDay()) % 7 || 7;
                nextMonday.setDate(now.getDate() + daysUntilMonday);
                nextMonday.setHours(0, 0, 0, 0);
                return nextMonday;
                
            case 'monthly':
                const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
                nextMonth.setHours(0, 0, 0, 0);
                return nextMonth;
                
            case 'yearly':
                const nextYear = new Date(now.getFullYear() + 1, 0, 1);
                nextYear.setHours(0, 0, 0, 0);
                return nextYear;
                
            default:
                return new Date();
        }
    }

    updateResetCountdown() {
        if (!this.budget) return;

        const nextReset = this.getNextResetDate();
        const now = new Date();
        const timeUntilReset = nextReset - now;
        
        console.log('🕐 Reset countdown:', {
            nextReset: nextReset.toLocaleString('id-ID'),
            now: now.toLocaleString('id-ID'),
            timeUntilReset: Math.floor(timeUntilReset / (1000 * 60 * 60)) + ' hours'
        });

        if (timeUntilReset > 0) {
            const days = Math.floor(timeUntilReset / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeUntilReset % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeUntilReset % (1000 * 60 * 60)) / (1000 * 60));
            
            let displayText = '';
            if (days > 0) {
                displayText = `${days}h ${hours}j ${minutes}m`;
            } else if (hours > 0) {
                displayText = `${hours}j ${minutes}m`;
            } else {
                displayText = `${minutes}m`;
            }
            
            document.getElementById('resetTimer').textContent = displayText;
        } else {
            document.getElementById('resetTimer').textContent = 'Segera reset!';
        }
    }

    updateBudgetDisplay() {
        if (!this.budget) return;

        const totalUsed = Object.values(this.budget.categories).reduce((sum, cat) => sum + cat.spent, 0);
        const remaining = this.budget.totalBudget - totalUsed;

        document.getElementById('displayTotalBudget').textContent = this.formatCurrency(this.budget.totalBudget);
        document.getElementById('displayTotalUsed').textContent = this.formatCurrency(totalUsed);
        document.getElementById('displayRemaining').textContent = this.formatCurrency(remaining);

        const warningMessage = document.getElementById('warningMessage');
        if (remaining < 0) {
            warningMessage.style.display = 'flex';
        } else {
            warningMessage.style.display = 'none';
        }

        this.updateCategoriesDisplay();
    }

    updateCategoriesDisplay() {
        const container = document.getElementById('categoriesDisplay');
        container.innerHTML = '';

        Object.entries(this.budget.categories).forEach(([name, data]) => {
            const percentage = data.budget > 0 ? Math.min((data.spent / data.budget) * 100, 100) : 0;
            
            const categoryElement = document.createElement('div');
            categoryElement.className = 'budget-category';
            categoryElement.innerHTML = `
                <div class="category-header">
                    <span>${name}</span>
                    <span>${this.formatCurrency(data.spent)} / ${this.formatCurrency(data.budget)}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percentage}%"></div>
                </div>
            `;
            
            const progressBar = categoryElement.querySelector('.progress-fill');
            if (percentage > 100) {
                progressBar.classList.add('over-budget');
            } else if (percentage > 80) {
                progressBar.classList.add('near-limit');
            } else {
                progressBar.classList.add('on-track');
            }
            
            container.appendChild(categoryElement);
        });
    }

    updateCategoryDropdown() {
        if (!this.budget) return;

        const dropdown = document.getElementById('categorySelect');
        dropdown.innerHTML = '<option value="">Pilih Kategori</option>';
        
        Object.keys(this.budget.categories).forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            dropdown.appendChild(option);
        });
    }

    addTransaction() {
        const description = document.getElementById('description').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const type = document.getElementById('type').value;
        
        let category = '';
        if (type === 'expense') {
            category = document.getElementById('categorySelect').value;
            if (!category) {
                alert('Harap pilih kategori untuk pengeluaran!');
                return;
            }
        }

        if (!description || isNaN(amount)) {
            alert('Harap isi semua field dengan benar!');
            return;
        }

        const transaction = {
            id: Date.now(),
            description,
            amount,
            type,
            category: type === 'income' ? 'Pemasukan' : category,
            date: new Date().toLocaleDateString('id-ID')
        };

        this.transactions.push(transaction);
        this.saveToLocalStorage();
        this.renderTransactions();
        this.updateBalance();
        
        if (type === 'expense') {
            this.updateBudgetWithTransaction(transaction);
            
            const totalUsed = Object.values(this.budget.categories).reduce((sum, cat) => sum + cat.spent, 0);
            const remaining = this.budget.totalBudget - totalUsed;
            
            if (remaining < 0) {
                alert(`⚠️ PERINGATAN: Pengeluaran melebihi limit! Sisa: ${this.formatCurrency(remaining)}`);
            } else if (remaining < (this.budget.totalBudget * 0.2)) {
                alert(`💡 Hati-hati: Limit hampir habis! Sisa: ${this.formatCurrency(remaining)}`);
            }
        }
        
        this.clearForm();
    }

    updateBudgetWithTransaction(transaction) {
        if (!this.budget || transaction.type === 'income') return;

        if (this.budget.categories[transaction.category]) {
            this.budget.categories[transaction.category].spent += transaction.amount;
            this.saveBudgetToLocalStorage();
            this.updateBudgetDisplay();
        }
    }

    deleteTransaction(id) {
        const transaction = this.transactions.find(t => t.id === id);
        this.transactions = this.transactions.filter(t => t.id !== id);
        this.saveToLocalStorage();
        this.renderTransactions();
        this.updateBalance();
        
        if (transaction && transaction.type === 'expense') {
            this.updateBudgetAfterDelete(transaction);
        }
    }

    updateBudgetAfterDelete(transaction) {
        if (!this.budget || transaction.type === 'income') return;

        if (this.budget.categories[transaction.category]) {
            this.budget.categories[transaction.category].spent -= transaction.amount;
            this.saveBudgetToLocalStorage();
            this.updateBudgetDisplay();
        }
    }

    renderTransactions() {
        const container = document.getElementById('transactionContainer');
        container.innerHTML = '';

        if (this.transactions.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-tertiary); padding: 40px 0;">Belum ada transaksi</p>';
            return;
        }

        this.transactions.reverse().forEach(transaction => {
            const transactionElement = document.createElement('div');
            transactionElement.className = 'transaction-item';
            
            const categoryDisplay = transaction.type === 'income' ? 'Pemasukan' : transaction.category;
            
            transactionElement.innerHTML = `
                <div class="transaction-info">
                    <div class="transaction-description">${transaction.description}</div>
                    <div class="transaction-meta">${transaction.date} • ${categoryDisplay}</div>
                </div>
                <div>
                    <span class="${transaction.type} transaction-amount">${transaction.type === 'income' ? '+' : '-'}${this.formatCurrency(Math.abs(transaction.amount))}</span>
                    <button class="delete-btn" onclick="financeManager.deleteTransaction(${transaction.id})">Hapus</button>
                </div>
            `;
            container.appendChild(transactionElement);
        });
    }

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

        // Color coding for balance - VERSI TERBARU
        const balanceElement = document.getElementById('balance');
        const remainingBalanceElement = document.getElementById('remainingBalance');
        const remainingBalanceSection = document.querySelector('.remaining-balance-section');

        if (balance >= 0) {
            balanceElement.style.color = 'var(--text-primary)'; // Hitam untuk saldo positif
            remainingBalanceElement.style.color = '#FFD700'; // Tetap gold untuk sisa saldo detail
            remainingBalanceSection.classList.remove('balance-negative');
        } else {
            balanceElement.style.color = '#FF6B6B'; // Merah untuk saldo negatif
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

    formatCurrency(amount) {
        return `${this.currency} ${amount.toLocaleString('id-ID')}`;
    }

    clearForm() {
        document.getElementById('transactionForm').reset();
        document.getElementById('categoryGroup').style.display = 'none';
        document.getElementById('categorySelect').required = false;
    }

    saveToLocalStorage() {
        localStorage.setItem('transactions', JSON.stringify(this.transactions));
    }

    saveBudgetToLocalStorage() {
        localStorage.setItem('budget', JSON.stringify(this.budget));
    }

    manualReset() {
        if (!this.budget) {
            alert('Tidak ada budget plan yang aktif!');
            return;
        }
        
        if (confirm('Yakin ingin reset budget sekarang? Semua pengeluaran akan dikembalikan ke 0.')) {
            this.resetBudget();
            this.budget.lastReset = new Date().toISOString();
            this.saveBudgetToLocalStorage();
            alert('Budget berhasil direset manual! 🎯');
        }
    }
}

const financeManager = new FinanceManager();
