/**
 * Centralized Test ID Constants
 *
 * This file contains all the test IDs used throughout the application.
 * Using this centralized approach ensures consistency between components and tests.
 */

// Auth related test IDs
export const AUTH_TEST_IDS = {
  // Login page
  loginForm: "login-form",
  loginButton: "login-button",
  loginError: "login-error",

  // Register page
  registerForm: "register-form",
  registerButton: "register-button",

  // Form inputs
  nameInput: "name-input",
  emailInput: "email-input",
  passwordInput: "password-input",
  confirmPasswordInput: "confirm-password-input",

  // Input errors
  nameError: "register-name-error",
  emailError: "register-email-error",
  passwordError: "register-password-error",
  confirmPasswordError: "register-confirm-password-error",
};

// Navigation test IDs
export const NAV_TEST_IDS = {
  loginLink: "login-link",
  getStartedLink: "get-started-link",
  navDashboard: "nav-dashboard",
  navTransactions: "nav-transactions",
  navBudgets: "nav-budgets",
  navGoals: "nav-goals",
  navReports: "nav-reports",
  navSettings: "nav-settings",
  navUsername: "nav-username",
  navLogout: "nav-logout-button",
  navRegister: "nav-register",
  navLogin: "nav-login",
};

// Dashboard page test IDs
export const DASHBOARD_TEST_IDS = {
  dashboardPage: "dashboard-page",
  dashboardTitle: "dashboard-title",
  dashboardLoading: "dashboard-loading",

  // Financial summary section
  financialSummarySection: "financial-summary-section",
  totalBalanceCard: "total-balance-card",
  totalBalanceValue: "total-balance-value",
  incomeCard: "income-card",
  incomeValue: "income-value",
  expensesCard: "expenses-card",
  expensesValue: "expenses-value",
  cashflowAmount: "cashflow-amount",

  // Recent transactions section
  recentTransactionsSection: "recent-transactions-section",
  viewAllTransactionsButton: "view-all-transactions-button",

  // Budget section
  budgetSummarySection: "budget-summary-section",
  viewAllBudgetsButton: "view-all-budgets-button",

  // Goals section
  upcomingBillsSection: "upcoming-bills-section",
  billItem: (id: string) => `bill-${id}`,

  // New transaction button
  newTransactionButton: "new-transaction-button",
};

// Transaction page test IDs
export const TRANSACTION_TEST_IDS = {
  transactionsPage: "transactions-page",
  transactionsTitle: "transactions-title",
  transactionsList: "transactions-list",
  transactionItem: (id: string) => `transaction-${id}`,
  deleteTransaction: (id: string) => `delete-transaction-${id}`,
  editTransaction: (id: string) => `edit-transaction-${id}`,
  newTransactionButton: "new-transaction-button",

  // Transaction form
  transactionForm: "transaction-form",
  transactionDescription: "transaction-description",
  transactionAmount: "transaction-amount",
  transactionCategory: "transaction-category",
  transactionDate: "transaction-date",
  transactionNotes: "transaction-notes",
  transactionTags: "transaction-tags",
  typeIncome: "type-income",
  typeExpense: "type-expense",
  submitTransaction: "submit-transaction",

  // Transaction form errors
  transactionDescriptionError: "transaction-description-error",
  transactionAmountError: "transaction-amount-error",
  transactionCategoryError: "transaction-category-error",
  transactionDateError: "transaction-date-error",
};

// Home page test IDs
export const HOME_TEST_IDS = {
  homeTitle: "home-title",
  homeSubtitle: "home-subtitle",
  getStartedButton: "get-started-button",
  loginButton: "login-button",
  featuresTitle: "features-title",
  feature1: "feature-1",
  feature2: "feature-2",
  feature3: "feature-3",
};

// UI Components test IDs
export const UI_TEST_IDS = {
  // Input component
  input: (name: string) => `input-${name}`,
  inputLabel: (name: string) => `input-${name}-label`,
  inputError: (name: string) => `input-${name}-error`,

  // Button component
  button: (name: string) => `button-${name}`,
};
