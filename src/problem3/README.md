# Problem 3: Code Refactor Analysis

This section addresses the request to identify computational inefficiencies and anti-patterns in the provided React code snippet.

### Analysis of Issues

1.  **Inefficient `useMemo` Hook**:
    *   **Unnecessary Dependency**: The `useMemo` hook for `sortedBalances` incorrectly includes `prices` in its dependency array. Since `prices` is not used in the calculation, this causes the expensive sorting and filtering to re-run needlessly whenever `prices` changes.
    *   **Flawed Filtering Logic**: The filter logic incorrectly keeps only balances with non-positive amounts (`balance.amount <= 0`), which is the opposite of what's intended.

2.  **Redundant Component Re-rendering**:
    *   **`getPriority` Function Re-creation**: The `getPriority` function is defined inside the component, causing it to be re-created on every render. As a pure utility function, it should be defined outside the component scope to avoid this overhead.

3.  **Incorrect Prop Usage and Keys**:
    *   **Unused `children` Prop**: The `children` prop is destructured but never used.
    *   **Using Index as `key`**: Using the array `index` as the `key` for the `<WalletRow />` component is an anti-pattern. It can cause unpredictable UI behavior when the list changes. A unique, stable identifier from the data (e.g., `balance.currency`) should be used instead.

4.  **Type Safety and Readability**:
    *   **`any` Type**: The `blockchain` parameter in `getPriority` is typed as `any`, which undermines the benefits of TypeScript.
    *   **Missing Interface Property**: The `WalletBalance` interface is missing the `blockchain` property, which would cause a type error.

### Refactored Solution

The refactored code, which addresses all the issues above, can be found in the `solution.tsx` file in this directory.

The refactor improves efficiency, correctness, and code quality by moving utility functions outside the component, correcting the `useMemo` dependencies, fixing the filtering logic, using stable keys, and improving type safety.
