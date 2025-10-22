class FinanceManager {
    constructor() {
        this.transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        this.budget = JSON.parse(localStorage.getItem('budget')) || null;
        this.currency = 'Rp';
        this.lastResetDate = localStorage.getItem('lastResetDate') || new Date().toDateString();
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
        
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => console.log('SW registered'))
                .catch(error => console.log('SW failed:', error));
        }
    }

    checkAutoReset() {
        const today = new Date().toDateString();
        if (today !== this.lastResetDate && this.budget) {
            const lastReset = new Date(this.lastResetDate);
            const currentDate = new Date();
            let shouldReset = false;

            if (this.budget.period === 'daily') {
                shouldReset = true;
            } else if (this.budget.period === 'weekly' && currentDate.getDay() < lastReset.getDay()) {
                shouldReset = true;
            } else if (this.budget.period === 'monthly' && currentDate.getMonth() !== lastReset.getMonth()) {
                shouldReset = true;
            } else if (this.budget.period === 'yearly' && currentDate.getFullYear() !== lastReset.getFullYear()) {
                shouldReset = true;
            }

            if (shouldReset) {
                this.resetBudget();
            }
            
            this.lastResetDate = today;
            localStorage.setItem('lastResetDate', today);
        }
    }

    resetBudget() {
        Object.keys(this.budget.categories).forEach(category => {
            this.budget.categories[category].spent = 0;
        });
        this.saveBudgetToLocalStorage();
        this.updateBudgetDisplay();
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
                <input type="number" class="category-amount" placeholder="Jumlah" value="0">
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
            alert('Total anggaran kategori melebihi total anggaran keseluruhan!');
            return;
        }

        this.budget = {
            period: period,
            totalBudget: totalBudget,
            categories: categories,
            totalAllocated: totalAllocated,
            createdAt: new Date().toISOString()
        };

        this.saveBudgetToLocalStorage();
        this.saveFormState();
        this.updateBudgetDisplay();
        this.updateCategoryDropdown();
        document.getElementById('budgetDisplay').style.display = 'block';
        this.updateResetTimer();
        
        alert('Rencana anggaran berhasil diset!');
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
        
        setInterval(() => {
            const now = new Date();
            document.getElementById('resetTimer').textContent = now.toLocaleTimeString('id-ID');
        }, 1000);
    }

    updateBudgetDisplay() {
        if (!this.budget) return;

        const totalUsed = Object.values(this.budget.categories).reduce((sum, cat) => sum + cat.spent, 0);
        const remaining = this.budget.totalBudget - totalUsed;

        document.getElementById('displayTotalBudget').textContent = this.formatCurrency(this.budget.totalBudget);
        document.getElementById('displayTotalUsed').textContent = this.formatCurrency(totalUsed);
        document.getElementById('displayRemaining').textContent = this.formatCurrency(remaining);

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
        const category = document.getElementById('categorySelect').value;

        if (!description || isNaN(amount) || !category) {
            alert('Harap isi semua field dengan benar!');
            return;
        }

        const transaction = {
            id: Date.now(),
            description,
            amount,
            type,
            category,
            date: new Date().toLocaleDateString('id-ID')
        };

        this.transactions.push(transaction);
        this.saveToLocalStorage();
        this.renderTransactions();
        this.updateBalance();
        
        if (type === 'expense') {
            this.updateBudgetWithTransaction(transaction);
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
            container.innerHTML = '<p>Belum ada transaksi. Tambahkan transaksi pertama!</p>';
            return;
        }

        this.transactions.reverse().forEach(transaction => {
            const transactionElement = document.createElement('div');
            transactionElement.className = 'transaction-item';
            transactionElement.innerHTML = `
                <div>
                    <strong>${transaction.description}</strong>
                    <br>
                    <small>${transaction.date} • ${transaction.category}</small>
                </div>
                <div>
                    <span class="${transaction.type}">${transaction.type === 'income' ? '+' : '-'}${this.formatCurrency(Math.abs(transaction.amount))}</span>
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

        document.getElementById('balance').textContent = this.formatCurrency(balance);
        document.getElementById('totalIncome').textContent = this.formatCurrency(totalIncome);
        document.getElementById('totalExpenses').textContent = this.formatCurrency(totalExpenses);

        const balanceElement = document.getElementById('balance');
        balanceElement.style.color = balance >= 0 ? '#27ae60' : '#e74c3c';
    }

    formatCurrency(amount) {
        return `${this.currency} ${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    }

    clearForm() {
        document.getElementById('transactionForm').reset();
    }

    saveToLocalStorage() {
        localStorage.setItem('transactions', JSON.stringify(this.transactions));
    }

    saveBudgetToLocalStorage() {
        localStorage.setItem('budget', JSON.stringify(this.budget));
    }
}

const financeManager = new FinanceManager();