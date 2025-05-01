# Finance Tracker - Testing Documentation

This document outlines the testing strategy for the Finance Tracker application, focusing on automation testing using Playwright.

## Testing Strategy

### 1. Functional Testing

Our automated tests cover key functional areas:

- **Authentication Flow**
  - User registration with validation
  - User login with validation
  - Session management (persistence and logout)

- **Transaction Management**
  - Creating new transactions (both income and expense)
  - Viewing transaction history
  - Filtering transactions by various criteria
  - Deleting transactions

- **Dashboard Functionality**
  - Displaying financial summaries
  - Showing recent transactions
  - Navigation to other sections

### 2. Test Types Implemented

#### UI Testing
- Component rendering verification
- Responsive layout testing across devices
- UI state transitions (loading, error, success states)

#### Form Validation Testing
- Required field validation
- Format validation (emails, numbers, etc.)
- Error message display

#### Navigation Flow Testing
- Page-to-page navigation
- Authenticated route protection
- Redirect behavior

#### API Integration Testing
- Backend API interaction simulation
- Error handling for API failures

## Test Implementation

### Data-Test Attributes Strategy

We've implemented a consistent pattern for test attributes:

- All interactive elements have a `data-testid` attribute
- Attribute naming follows the pattern: `{page/component}-{element-name}`
- Form inputs include additional attributes for labels and error messages
- List items include identifiers (e.g., transaction IDs)

This makes test selectors:
- Resilient to UI changes
- Clear in their purpose
- Easy to maintain

### Test Suites

1. **auth.spec.ts**
   - Tests for registration, login, and logout
   - Form validation tests
   - Authentication error handling

2. **transactions.spec.ts**
   - Transaction creation workflow
   - Transaction filtering
   - Transaction deletion
   - Form validation for transactions

3. **dashboard.spec.ts**
   - Financial summary display
   - Recent transactions section
   - Budget summary section
   - Loading states and navigation

## Running Tests

### Prerequisites

- Node.js 16+
- npm or yarn
- Browsers (handled by Playwright installation)

### Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Install Playwright browsers:
   ```
   npx playwright install
   ```

### Running Tests

Run all tests:
```
npx playwright test
```

Run a specific test file:
```
npx playwright test tests/auth.spec.ts
```

Run tests in UI mode (for debugging):
```
npx playwright test --ui
```

### Generating Test Reports

After running tests, view the HTML report:
```
npx playwright show-report
```

## Test Results Analysis

### Test Report Interpretation

The Playwright HTML report provides:
- Test run summaries
- Detailed test case results
- Screenshots of failures
- Traces for debugging

### Common Failure Patterns

1. **Timing Issues**
   - Solution: Use proper wait strategies (waitForSelector, etc.)

2. **Selector Changes**
   - Solution: Use data-testid attributes instead of CSS classes

3. **State Management Issues**
   - Solution: Ensure proper test isolation and setup

## Extending the Test Suite

When adding new features:

1. Add appropriate `data-testid` attributes to UI elements
2. Create test cases that verify the complete user flow
3. Include both happy path and error scenarios
4. Test across multiple browsers and viewport sizes

## Continuous Integration

These tests are designed to run in CI environments.

Sample CI workflow:
1. Build the application
2. Start the application in test mode
3. Run Playwright tests
4. Generate and store test reports

## Test Maintenance

To keep tests maintainable:
1. Update tests when changing UI components
2. Regularly review and refactor test code
3. Keep selectors consistent and descriptive
4. Document complex test scenarios