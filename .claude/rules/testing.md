---
paths:
  - "**/*.test.js"
  - "**/*.test.jsx"
  - "**/*.spec.js"
  - "**/*.spec.jsx"
---

# Testing Rules

- Use descriptive test names: "should [expected] when [condition]"
- Mock external dependencies, not internal modules
- Clean up side effects in `afterEach`
- Test component rendering and user interactions, not implementation details
- Use React Testing Library patterns (`getByRole`, `userEvent`) over direct DOM queries
