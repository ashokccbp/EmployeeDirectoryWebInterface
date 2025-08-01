<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Employee Directory - Professional Management System</title>
    <link rel="stylesheet" href="/static/css/style.css">
    <link rel="stylesheet" href="/static/css/components.css">
    <link rel="stylesheet" href="/static/css/responsive.css">
</head>
<body>
    <div id="app">
        <!-- Header -->
        <header class="header">
            <div class="container">
                <div class="header__content">
                    <div class="header__brand">
                        <div class="header__icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M3 21h18"/>
                                <path d="M5 21V7l8-4v18"/>
                                <path d="M19 21V11l-6-4"/>
                            </svg>
                        </div>
                        <div class="header__text">
                            <h1 class="header__title">Employee Directory</h1>
                            <p class="header__subtitle">Manage your team members</p>
                        </div>
                    </div>
                    <button id="add-employee-btn" class="btn btn--primary">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                            <circle cx="9" cy="7" r="4"/>
                            <line x1="19" y1="8" x2="19" y2="14"/>
                            <line x1="22" y1="11" x2="16" y2="11"/>
                        </svg>
                        Add Employee
                    </button>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="main">
            <div class="container">
                <!-- Statistics -->
                <div class="stats">
                    <div class="stats__card">
                        <div class="stats__icon stats__icon--blue">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                <circle cx="9" cy="7" r="4"/>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                            </svg>
                        </div>
                        <div class="stats__content">
                            <p class="stats__label">Total Employees</p>
                            <p class="stats__value" id="total-employees">${employees?size}</p>
                        </div>
                    </div>
                    
                    <div class="stats__card">
                        <div class="stats__icon stats__icon--green">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M3 21h18"/>
                                <path d="M5 21V7l8-4v18"/>
                                <path d="M19 21V11l-6-4"/>
                            </svg>
                        </div>
                        <div class="stats__content">
                            <p class="stats__label">Departments</p>
                            <p class="stats__value" id="total-departments">
                                <#assign departments = []>
                                <#list employees as employee>
                                    <#if !departments?seq_contains(employee.department)>
                                        <#assign departments = departments + [employee.department]>
                                    </#if>
                                </#list>
                                ${departments?size}
                            </p>
                        </div>
                    </div>
                    
                    <div class="stats__card">
                        <div class="stats__icon stats__icon--purple">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                                <circle cx="9" cy="7" r="4"/>
                                <line x1="19" y1="8" x2="19" y2="14"/>
                                <line x1="22" y1="11" x2="16" y2="11"/>
                            </svg>
                        </div>
                        <div class="stats__content">
                            <p class="stats__label">Showing</p>
                            <p class="stats__value" id="showing-count">${employees?size}</p>
                        </div>
                    </div>
                </div>

                <!-- Search and Filters -->
                <div class="search-filters">
                    <div class="search-filters__content">
                        <div class="search-bar">
                            <svg class="search-bar__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="11" cy="11" r="8"/>
                                <path d="M21 21l-4.35-4.35"/>
                            </svg>
                            <input type="text" id="search-input" class="search-bar__input" placeholder="Search employees...">
                        </div>
                        
                        <div class="filter-controls">
                            <button id="filter-toggle" class="btn btn--secondary">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/>
                                </svg>
                                Filters
                                <span id="filter-count" class="filter-count hidden">0</span>
                                <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="6,9 12,15 18,9"/>
                                </svg>
                            </button>
                            
                            <button id="clear-filters" class="btn btn--danger hidden">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="18" y1="6" x2="6" y2="18"/>
                                    <line x1="6" y1="6" x2="18" y2="18"/>
                                </svg>
                                Clear
                            </button>
                        </div>
                    </div>
                    
                    <div id="filter-panel" class="filter-panel hidden">
                        <div class="filter-panel__content">
                            <div class="filter-group">
                                <label for="department-filter" class="filter-label">Department</label>
                                <select id="department-filter" class="filter-select">
                                    <option value="">All Departments</option>
                                    <#assign uniqueDepartments = []>
                                    <#list employees as employee>
                                        <#if !uniqueDepartments?seq_contains(employee.department)>
                                            <#assign uniqueDepartments = uniqueDepartments + [employee.department]>
                                            <option value="${employee.department}">${employee.department}</option>
                                        </#if>
                                    </#list>
                                </select>
                            </div>
                            
                            <div class="filter-group">
                                <label for="role-filter" class="filter-label">Role</label>
                                <select id="role-filter" class="filter-select">
                                    <option value="">All Roles</option>
                                    <#assign uniqueRoles = []>
                                    <#list employees as employee>
                                        <#if !uniqueRoles?seq_contains(employee.role)>
                                            <#assign uniqueRoles = uniqueRoles + [employee.role]>
                                            <option value="${employee.role}">${employee.role}</option>
                                        </#if>
                                    </#list>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sort Controls -->
                <div class="sort-controls">
                    <div class="sort-controls__content">
                        <span class="sort-controls__label">Sort by:</span>
                        <button class="sort-btn active" data-field="firstName">
                            Name
                            <svg class="sort-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M8 9l4-4 4 4"/>
                                <path d="M16 15l-4 4-4-4"/>
                            </svg>
                        </button>
                        <button class="sort-btn" data-field="department">
                            Department
                            <svg class="sort-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M8 9l4-4 4 4"/>
                                <path d="M16 15l-4 4-4-4"/>
                            </svg>
                        </button>
                        <button class="sort-btn" data-field="role">
                            Role
                            <svg class="sort-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M8 9l4-4 4 4"/>
                                <path d="M16 15l-4 4-4-4"/>
                            </svg>
                        </button>
                        <button class="sort-btn" data-field="joinDate">
                            Join Date
                            <svg class="sort-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M8 9l4-4 4 4"/>
                                <path d="M16 15l-4 4-4-4"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Employee Grid -->
                <div id="employee-grid" class="employee-grid">
                    <#list employees as employee>
                        <div class="employee-card" data-employee-id="${employee.id}">
                            <div class="employee-card__content">
                                <div class="employee-card__header">
                                    <div class="employee-card__info">
                                        <img src="${employee.avatar!''}" alt="${employee.firstName} ${employee.lastName}" class="employee-card__avatar" onerror="this.src='https://ui-avatars.com/api/?name=${employee.firstName}+${employee.lastName}&background=3B82F6&color=fff&size=64'">
                                        <div class="employee-card__details">
                                            <h3 class="employee-card__name">${employee.firstName} ${employee.lastName}</h3>
                                            <p class="employee-card__role">${employee.role}</p>
                                            <span class="employee-card__department department-badge department-badge--${employee.department?lower_case?replace(' ', '-')}">${employee.department}</span>
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
                                    
                                    <#if employee.phone??>
                                        <div class="contact-item">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                                            </svg>
                                            <a href="tel:${employee.phone}" class="contact-link">${employee.phone}</a>
                                        </div>
                                    </#if>
                                    
                                    <div class="contact-item">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                            <line x1="16" y1="2" x2="16" y2="6"/>
                                            <line x1="8" y1="2" x2="8" y2="6"/>
                                            <line x1="3" y1="10" x2="21" y2="10"/>
                                        </svg>
                                        <span>Joined ${employee.joinDate}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </#list>
                </div>

                <!-- Empty State -->
                <div id="empty-state" class="empty-state hidden">
                    <div class="empty-state__icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8"/>
                            <path d="M21 21l-4.35-4.35"/>
                        </svg>
                    </div>
                    <h3 class="empty-state__title">No employees found</h3>
                    <p class="empty-state__message">Try adjusting your search or filter criteria to find what you're looking for.</p>
                </div>

                <!-- Pagination -->
                <div id="pagination" class="pagination">
                    <div class="pagination__info">
                        <span id="pagination-info">Showing 1-9 of ${employees?size} employees</span>
                        <div class="pagination__per-page">
                            <label for="items-per-page">Show:</label>
                            <select id="items-per-page">
                                <option value="6">6</option>
                                <option value="9" selected>9</option>
                                <option value="12">12</option>
                                <option value="24">24</option>
                                <option value="50">50</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="pagination__controls">
                        <button id="prev-page" class="pagination__btn" disabled>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="15,18 9,12 15,6"/>
                            </svg>
                        </button>
                        
                        <div id="page-numbers" class="pagination__pages">
                            <button class="pagination__page active">1</button>
                        </div>
                        
                        <button id="next-page" class="pagination__btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="9,18 15,12 9,6"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </main>

        <!-- Employee Form Modal -->
        <div id="employee-modal" class="modal hidden">
            <div class="modal__backdrop"></div>
            <div class="modal__content">
                <div class="modal__header">
                    <div class="modal__title-group">
                        <div class="modal__icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                <circle cx="12" cy="7" r="4"/>
                            </svg>
                        </div>
                        <h2 id="modal-title">Add New Employee</h2>
                    </div>
                    <button id="close-modal" class="modal__close">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
                
                <form id="employee-form" class="employee-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="firstName" class="form-label">First Name <span class="required">*</span></label>
                            <input type="text" id="firstName" name="firstName" class="form-input" placeholder="Enter first name" required>
                            <div class="form-error" id="firstName-error"></div>
                        </div>
                        
                        <div class="form-group">
                            <label for="lastName" class="form-label">Last Name <span class="required">*</span></label>
                            <input type="text" id="lastName" name="lastName" class="form-input" placeholder="Enter last name" required>
                            <div class="form-error" id="lastName-error"></div>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="email" class="form-label">Email Address <span class="required">*</span></label>
                        <input type="email" id="email" name="email" class="form-input" placeholder="Enter email address" required>
                        <div class="form-error" id="email-error"></div>
                    </div>
                    
                    <div class="form-group">
                        <label for="phone" class="form-label">Phone Number</label>
                        <input type="tel" id="phone" name="phone" class="form-input" placeholder="Enter phone number">
                        <div class="form-error" id="phone-error"></div>
                    </div>
                    
                    <div class="form-group">
                        <label for="department" class="form-label">Department <span class="required">*</span></label>
                        <select id="department" name="department" class="form-select" required>
                            <option value="">Select a department</option>
                            <option value="Engineering">Engineering</option>
                            <option value="Design">Design</option>
                            <option value="Marketing">Marketing</option>
                            <option value="HR">HR</option>
                            <option value="Sales">Sales</option>
                            <option value="Finance">Finance</option>
                        </select>
                        <div class="form-error" id="department-error"></div>
                    </div>
                    
                    <div class="form-group">
                        <label for="role" class="form-label">Role <span class="required">*</span></label>
                        <select id="role" name="role" class="form-select" required>
                            <option value="">Select a role</option>
                            <option value="Senior Developer">Senior Developer</option>
                            <option value="UI/UX Designer">UI/UX Designer</option>
                            <option value="Marketing Manager">Marketing Manager</option>
                            <option value="DevOps Engineer">DevOps Engineer</option>
                            <option value="HR Specialist">HR Specialist</option>
                            <option value="Sales Representative">Sales Representative</option>
                            <option value="Financial Analyst">Financial Analyst</option>
                            <option value="Frontend Developer">Frontend Developer</option>
                            <option value="Graphic Designer">Graphic Designer</option>
                            <option value="Content Strategist">Content Strategist</option>
                            <option value="HR Manager">HR Manager</option>
                            <option value="Sales Manager">Sales Manager</option>
                            <option value="Finance Manager">Finance Manager</option>
                            <option value="Backend Developer">Backend Developer</option>
                            <option value="Product Designer">Product Designer</option>
                        </select>
                        <div class="form-error" id="role-error"></div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" id="cancel-form" class="btn btn--secondary">Cancel</button>
                        <button type="submit" class="btn btn--primary">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                                <polyline points="17,21 17,13 7,13 7,21"/>
                                <polyline points="7,3 7,8 15,8"/>
                            </svg>
                            <span id="submit-text">Add Employee</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="/static/js/data.js"></script>
    <script src="/static/js/app.js"></script>
</body>
</html>