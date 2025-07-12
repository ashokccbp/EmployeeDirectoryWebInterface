// Employee Directory Application - Vanilla JavaScript Implementation
class EmployeeDirectory {
    constructor() {
        // Initialize data
        this.employees = [...mockEmployees];
        this.filteredEmployees = [...this.employees];
        this.currentPage = 1;
        this.itemsPerPage = 9;
        this.currentSort = { field: 'firstName', direction: 'asc' };
        this.currentFilters = { search: '', department: '', role: '' };
        this.editingEmployee = null;

        // Initialize the application
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateDisplay();
        this.updateStatistics();
    }

    bindEvents() {
        // Add Employee button
        document.getElementById('add-employee-btn').addEventListener('click', () => {
            this.showEmployeeForm();
        });

        // Search input
        document.getElementById('search-input').addEventListener('input', (e) => {
            this.currentFilters.search = e.target.value;
            this.applyFiltersAndSort();
        });

        // Filter toggle
        document.getElementById('filter-toggle').addEventListener('click', () => {
            this.toggleFilterPanel();
        });

        // Clear filters
        document.getElementById('clear-filters').addEventListener('click', () => {
            this.clearFilters();
        });

        // Filter selects
        document.getElementById('department-filter').addEventListener('change', (e) => {
            this.currentFilters.department = e.target.value;
            this.applyFiltersAndSort();
        });

        document.getElementById('role-filter').addEventListener('change', (e) => {
            this.currentFilters.role = e.target.value;
            this.applyFiltersAndSort();
        });

        // Sort buttons
        document.querySelectorAll('.sort-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const field = e.currentTarget.dataset.field;
                this.updateSort(field);
            });
        });

        // Pagination
        document.getElementById('items-per-page').addEventListener('change', (e) => {
            this.itemsPerPage = parseInt(e.target.value);
            this.currentPage = 1;
            this.updateDisplay();
        });

        document.getElementById('prev-page').addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.updateDisplay();
            }
        });

        document.getElementById('next-page').addEventListener('click', () => {
            const totalPages = Math.ceil(this.filteredEmployees.length / this.itemsPerPage);
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.updateDisplay();
            }
        });

        // Modal events
        document.getElementById('close-modal').addEventListener('click', () => {
            this.hideEmployeeForm();
        });

        document.getElementById('cancel-form').addEventListener('click', () => {
            this.hideEmployeeForm();
        });

        document.querySelector('.modal__backdrop').addEventListener('click', () => {
            this.hideEmployeeForm();
        });

        // Form submission
        document.getElementById('employee-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // Employee card actions (using event delegation)
        document.getElementById('employee-grid').addEventListener('click', (e) => {
            const action = e.target.closest('[data-action]');
            if (action) {
                const employeeId = parseInt(action.dataset.id);
                const actionType = action.dataset.action;

                if (actionType === 'edit') {
                    this.editEmployee(employeeId);
                } else if (actionType === 'delete') {
                    this.deleteEmployee(employeeId);
                }
            }
        });

        // Form validation on input
        const formInputs = document.querySelectorAll('#employee-form input, #employee-form select');
        formInputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    this.validateField(input);
                }
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideEmployeeForm();
            }
        });
    }

    applyFiltersAndSort() {
        // Apply filters
        this.filteredEmployees = DataUtils.filterBy(this.employees, this.currentFilters);

        // Apply sorting
        this.filteredEmployees = DataUtils.sortBy(
            this.filteredEmployees, 
            this.currentSort.field, 
            this.currentSort.direction
        );

        // Reset to first page
        this.currentPage = 1;

        // Update display
        this.updateDisplay();
        this.updateFilterUI();
    }

    updateSort(field) {
        if (this.currentSort.field === field) {
            this.currentSort.direction = this.currentSort.direction === 'asc' ? 'desc' : 'asc';
        } else {
            this.currentSort.field = field;
            this.currentSort.direction = 'asc';
        }

        this.applyFiltersAndSort();
        this.updateSortUI();
    }

    updateSortUI() {
        document.querySelectorAll('.sort-btn').forEach(btn => {
            const field = btn.dataset.field;
            btn.classList.toggle('active', field === this.currentSort.field);
            btn.classList.toggle('desc', field === this.currentSort.field && this.currentSort.direction === 'desc');
        });
    }

    updateFilterUI() {
        const hasActiveFilters = this.currentFilters.department || this.currentFilters.role;
        const filterCount = (this.currentFilters.department ? 1 : 0) + (this.currentFilters.role ? 1 : 0);
        
        const filterToggle = document.getElementById('filter-toggle');
        const filterCountEl = document.getElementById('filter-count');
        const clearFiltersBtn = document.getElementById('clear-filters');

        if (hasActiveFilters) {
            filterToggle.classList.add('active');
            filterCountEl.textContent = filterCount;
            filterCountEl.classList.remove('hidden');
            clearFiltersBtn.classList.remove('hidden');
        } else {
            filterToggle.classList.remove('active');
            filterCountEl.classList.add('hidden');
            clearFiltersBtn.classList.add('hidden');
        }
    }

    toggleFilterPanel() {
        const panel = document.getElementById('filter-panel');
        const toggle = document.getElementById('filter-toggle');
        
        panel.classList.toggle('hidden');
        toggle.classList.toggle('active');
    }

    clearFilters() {
        this.currentFilters = { search: '', department: '', role: '' };
        
        document.getElementById('search-input').value = '';
        document.getElementById('department-filter').value = '';
        document.getElementById('role-filter').value = '';
        
        this.applyFiltersAndSort();
        
        // Hide filter panel
        document.getElementById('filter-panel').classList.add('hidden');
    }

    updateDisplay() {
        this.renderEmployeeGrid();
        this.updatePagination();
        this.updateStatistics();
    }

    renderEmployeeGrid() {
        const grid = document.getElementById('employee-grid');
        const emptyState = document.getElementById('empty-state');
        
        // Get paginated employees
        const paginatedEmployees = DataUtils.paginate(
            this.filteredEmployees, 
            this.currentPage, 
            this.itemsPerPage
        );

        if (paginatedEmployees.length === 0) {
            grid.classList.add('hidden');
            emptyState.classList.remove('hidden');
            return;
        }

        grid.classList.remove('hidden');
        emptyState.classList.add('hidden');

        // Render employee cards
        grid.innerHTML = paginatedEmployees.map(employee => this.renderEmployeeCard(employee)).join('');
    }

    renderEmployeeCard(employee) {
        const departmentClass = employee.department.toLowerCase().replace(/\s+/g, '-');
        const avatarUrl = employee.avatar || DataUtils.generateAvatarUrl(employee.firstName, employee.lastName);
        const formattedDate = DataUtils.formatDate(employee.joinDate);

        return `
            <div class="employee-card" data-employee-id="${employee.id}">
                <div class="employee-card__content">
                    <div class="employee-card__header">
                        <div class="employee-card__info">
                            <img src="${avatarUrl}" alt="${employee.firstName} ${employee.lastName}" class="employee-card__avatar" onerror="this.src='${DataUtils.generateAvatarUrl(employee.firstName, employee.lastName)}'">
                            <div class="employee-card__details">
                                <h3 class="employee-card__name">${employee.firstName} ${employee.lastName}</h3>
                                <p class="employee-card__role">${employee.role}</p>
                                <span class="employee-card__department department-badge department-badge--${departmentClass}">${employee.department}</span>
                            </div>
                        </div>
                        <div class="employee-card__actions">
                            <button class="action-btn action-btn--edit" data-action="edit" data-id="${employee.id}" title="Edit Employee">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                </svg>
                            </button>
                            <button class="action-btn action-btn--delete" data-action="delete" data-id="${employee.id}" title="Delete Employee">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="3,6 5,6 21,6"/>
                                    <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
                                    <line x1="10" y1="11" x2="10" y2="17"/>
                                    <line x1="14" y1="11" x2="14" y2="17"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div class="employee-card__contact">
                        <div class="contact-item">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                <polyline points="22,6 12,13 2,6"/>
                            </svg>
                            <a href="mailto:${employee.email}" class="contact-link">${employee.email}</a>
                        </div>
                        
                        ${employee.phone ? `
                            <div class="contact-item">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                                </svg>
                                <a href="tel:${employee.phone}" class="contact-link">${employee.phone}</a>
                            </div>
                        ` : ''}
                        
                        <div class="contact-item">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                <line x1="16" y1="2" x2="16" y2="6"/>
                                <line x1="8" y1="2" x2="8" y2="6"/>
                                <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                            <span>Joined ${formattedDate}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    updatePagination() {
        const totalItems = this.filteredEmployees.length;
        const totalPages = Math.ceil(totalItems / this.itemsPerPage);
        const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
        const endItem = Math.min(this.currentPage * this.itemsPerPage, totalItems);

        // Update pagination info
        document.getElementById('pagination-info').textContent = 
            `Showing ${startItem}-${endItem} of ${totalItems} employees`;

        // Update pagination controls
        document.getElementById('prev-page').disabled = this.currentPage === 1;
        document.getElementById('next-page').disabled = this.currentPage === totalPages || totalPages === 0;

        // Update page numbers
        this.renderPageNumbers(totalPages);

        // Show/hide pagination
        const pagination = document.getElementById('pagination');
        pagination.style.display = totalItems > 0 ? 'block' : 'none';
    }

    renderPageNumbers(totalPages) {
        const pageNumbers = document.getElementById('page-numbers');
        const maxVisiblePages = 5;
        
        let pages = [];
        
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            const startPage = Math.max(1, this.currentPage - 2);
            const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
            
            if (startPage > 1) {
                pages.push(1);
                if (startPage > 2) pages.push('...');
            }
            
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }
            
            if (endPage < totalPages) {
                if (endPage < totalPages - 1) pages.push('...');
                pages.push(totalPages);
            }
        }

        pageNumbers.innerHTML = pages.map(page => {
            if (page === '...') {
                return '<span class="pagination__ellipsis">...</span>';
            }
            
            const isActive = page === this.currentPage;
            return `
                <button class="pagination__page ${isActive ? 'active' : ''}" 
                        onclick="employeeDirectory.goToPage(${page})">
                    ${page}
                </button>
            `;
        }).join('');
    }

    goToPage(page) {
        this.currentPage = page;
        this.updateDisplay();
    }

    updateStatistics() {
        document.getElementById('total-employees').textContent = this.employees.length;
        document.getElementById('total-departments').textContent = 
            DataUtils.getUniqueValues(this.employees, 'department').length;
        document.getElementById('showing-count').textContent = this.filteredEmployees.length;
    }

    showEmployeeForm(employee = null) {
        this.editingEmployee = employee;
        const modal = document.getElementById('employee-modal');
        const form = document.getElementById('employee-form');
        const title = document.getElementById('modal-title');
        const submitText = document.getElementById('submit-text');

        // Reset form
        form.reset();
        this.clearFormErrors();

        if (employee) {
            title.textContent = 'Edit Employee';
            submitText.textContent = 'Update Employee';
            this.populateForm(employee);
        } else {
            title.textContent = 'Add New Employee';
            submitText.textContent = 'Add Employee';
        }

        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Focus first input
        setTimeout(() => {
            document.getElementById('firstName').focus();
        }, 100);
    }

    hideEmployeeForm() {
        const modal = document.getElementById('employee-modal');
        modal.classList.add('hidden');
        document.body.style.overflow = '';
        this.editingEmployee = null;
        this.clearFormErrors();
    }

    populateForm(employee) {
        document.getElementById('firstName').value = employee.firstName;
        document.getElementById('lastName').value = employee.lastName;
        document.getElementById('email').value = employee.email;
        document.getElementById('phone').value = employee.phone || '';
        document.getElementById('department').value = employee.department;
        document.getElementById('role').value = employee.role;
    }

    handleFormSubmit() {
        const formData = this.getFormData();
        
        if (!this.validateForm(formData)) {
            return;
        }

        if (this.editingEmployee) {
            this.updateEmployee(this.editingEmployee.id, formData);
            this.showNotification('Employee updated successfully!', 'success');
        } else {
            this.addEmployee(formData);
            this.showNotification('Employee added successfully!', 'success');
        }

        this.hideEmployeeForm();
        this.applyFiltersAndSort();
    }

    getFormData() {
        return {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            department: document.getElementById('department').value,
            role: document.getElementById('role').value
        };
    }

    validateForm(formData) {
        let isValid = true;
        
        // Validate required fields
        const requiredFields = ['firstName', 'lastName', 'email', 'department', 'role'];
        requiredFields.forEach(field => {
            if (!formData[field]) {
                this.showFieldError(field, 'This field is required');
                isValid = false;
            } else {
                this.clearFieldError(field);
            }
        });

        // Validate name lengths
        if (formData.firstName && formData.firstName.length < 2) {
            this.showFieldError('firstName', 'Must be at least 2 characters');
            isValid = false;
        }

        if (formData.lastName && formData.lastName.length < 2) {
            this.showFieldError('lastName', 'Must be at least 2 characters');
            isValid = false;
        }

        // Validate email format
        if (formData.email && !DataUtils.isValidEmail(formData.email)) {
            this.showFieldError('email', 'Please enter a valid email address');
            isValid = false;
        }

        // Check for duplicate email (excluding current employee if editing)
        if (formData.email) {
            const existingEmployee = this.employees.find(emp => 
                emp.email === formData.email && 
                (!this.editingEmployee || emp.id !== this.editingEmployee.id)
            );
            if (existingEmployee) {
                this.showFieldError('email', 'This email address is already in use');
                isValid = false;
            }
        }

        // Validate phone format
        if (formData.phone && !DataUtils.isValidPhone(formData.phone)) {
            this.showFieldError('phone', 'Please enter a valid phone number');
            isValid = false;
        }

        return isValid;
    }

    validateField(input) {
        const value = input.value.trim();
        const name = input.name;
        
        this.clearFieldError(name);
        
        switch (name) {
            case 'firstName':
            case 'lastName':
                if (!value) {
                    this.showFieldError(name, 'This field is required');
                } else if (value.length < 2) {
                    this.showFieldError(name, 'Must be at least 2 characters');
                }
                break;
                
            case 'email':
                if (!value) {
                    this.showFieldError(name, 'This field is required');
                } else if (!DataUtils.isValidEmail(value)) {
                    this.showFieldError(name, 'Please enter a valid email address');
                } else {
                    // Check for duplicate email
                    const existingEmployee = this.employees.find(emp => 
                        emp.email === value && 
                        (!this.editingEmployee || emp.id !== this.editingEmployee.id)
                    );
                    if (existingEmployee) {
                        this.showFieldError(name, 'This email address is already in use');
                    }
                }
                break;
                
            case 'phone':
                if (value && !DataUtils.isValidPhone(value)) {
                    this.showFieldError(name, 'Please enter a valid phone number');
                }
                break;
                
            case 'department':
            case 'role':
                if (!value) {
                    this.showFieldError(name, 'Please select an option');
                }
                break;
        }
    }

    showFieldError(fieldName, message) {
        const input = document.getElementById(fieldName);
        const errorEl = document.getElementById(`${fieldName}-error`);
        
        input.classList.add('error');
        input.classList.remove('success');
        if (errorEl) {
            errorEl.textContent = message;
        }
    }

    clearFieldError(fieldName) {
        const input = document.getElementById(fieldName);
        const errorEl = document.getElementById(`${fieldName}-error`);
        
        input.classList.remove('error');
        if (input.value.trim()) {
            input.classList.add('success');
        } else {
            input.classList.remove('success');
        }
        
        if (errorEl) {
            errorEl.textContent = '';
        }
    }

    clearFormErrors() {
        const inputs = document.querySelectorAll('#employee-form input, #employee-form select');
        inputs.forEach(input => {
            input.classList.remove('error', 'success');
        });
        
        const errors = document.querySelectorAll('.form-error');
        errors.forEach(error => {
            error.textContent = '';
        });
    }

    addEmployee(employeeData) {
        const newEmployee = {
            ...employeeData,
            id: DataUtils.generateId(),
            joinDate: new Date().toISOString().split('T')[0],
            avatar: DataUtils.generateAvatarUrl(employeeData.firstName, employeeData.lastName)
        };
        
        this.employees.push(newEmployee);
    }

    updateEmployee(id, employeeData) {
        const index = this.employees.findIndex(emp => emp.id === id);
        if (index !== -1) {
            this.employees[index] = { ...this.employees[index], ...employeeData };
        }
    }

    editEmployee(id) {
        const employee = this.employees.find(emp => emp.id === id);
        if (employee) {
            this.showEmployeeForm(employee);
        }
    }

    deleteEmployee(id) {
        const employee = this.employees.find(emp => emp.id === id);
        if (employee && confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`)) {
            this.employees = this.employees.filter(emp => emp.id !== id);
            this.applyFiltersAndSort();
            this.showNotification('Employee deleted successfully!', 'success');
        }
    }

    showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification__content">
                <div class="notification__icon notification__icon--${type}">
                    ${type === 'success' ? 
                        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20,6 9,17 4,12"/></svg>' :
                        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
                    }
                </div>
                <div class="notification__text">
                    <div class="notification__message">${message}</div>
                </div>
                <button class="notification__close">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Add close functionality
        notification.querySelector('.notification__close').addEventListener('click', () => {
            notification.remove();
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.employeeDirectory = new EmployeeDirectory();
});