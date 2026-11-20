# AGENTS.md

Before completing a code-changing task:
- Run npm run lint after the final edit; require exit code 0.
- Fix failures rather than weakening checks.
- Get approval before adding suppression comments.
- Report validation results and any unresolved blockers.
- Remove any comments added in the diff that rule 7 does not allow.

## 1. Design Priorities

**1.1.** Optimize primarily for developer experience: readability, ease of modification, and ease of adding future capabilities.

**1.2.** Prefer elegant, simple designs with low cognitive complexity. Do not optimize for minimum line count or minimum file count.

**1.3.** Prefer familiar, consistently applied architectural patterns over locally smaller implementations when the familiar pattern makes the code easier to understand and extend.

**1.4.** Prefer designs where adding a new capability is localized: ideally, new behavior can be added without modifying or understanding unrelated existing implementations.

## 2. Control Flow

**2.1.** Keep control flow flat. Avoid nesting loops and conditionals. Place conditional logic at function boundaries: early guards or final result selection. If conditionals or ternaries interrupt a function's main work, extract focused helpers.

**2.2.** Avoid `else`. Use `return`, `continue`, and `break` to terminate cases early and keep the remaining path unindented.

**2.3.** Do not use `switch` statements.

**2.4.** Avoid conditional dispatch chains. Represent variation structurally with separate functions, classes, or design patterns instead.

**2.5.** A single ternary is acceptable in a variable assignment or return statement when immediately readable. Avoid dense ternaries and do not nest them.

**2.6.** Prefer straightforward imperative control flow when functional composition would introduce nesting or obscure execution order. Simple `for` loops with `continue` are often preferable to nested `map`, `filter`, or `flatMap` expressions.

## 3. Structural Dispatch and Strategies

**3.1.** Prefer structural dispatch over conditional dispatch. When several behaviors implement the same concept, represent them as separate implementations rather than branches in one function.

**3.2.** The Strategy pattern is a favored pattern in this codebase. Seriously consider it for most problems involving varying behavior, multiple cases, recognition, or dispatch.

**3.3.** Strategy systems should normally use an explicitly ordered registry. The first matching strategy owns the input.

**3.4.** Matching should normally be a static/class-level operation. Construct a strategy instance only after that strategy matches.

**3.5.** Compute or parse matching state once and pass it into the strategy instance. Do not repeat recognition work during execution.

**3.6.** Put shared mechanics in the base strategy. Concrete strategies should contain only the policy or behavior that varies.

**3.7.** Prefer inheritance when strategies share meaningful implementation behavior.

**3.8.** Adding a new strategy should normally require only adding its implementation and registering it at the appropriate priority. Avoid designs that require editing existing strategies to add a new case.

## 4. Semantic Modeling and State

**4.1.** Convert compact, encoded, or protocol-specific representations into semantic program concepts at their boundary.

**4.2.** Do not spread magic values or knowledge of external encodings through application logic. Prefer properties such as `isDeleted` over repeated interpretation of raw values such as `'D'`.

**4.3.** Store canonical or useful intermediate state on the object that owns it.

**4.4.** Prefer getters for inexpensive derived state so work is deferred until needed.

**4.5.** If derived state is expensive or repeatedly accessed, cache it on the instance rather than eagerly computing unrelated state.

## 5. Responsibilities and Modules

**5.1.** Follow the single responsibility principle for functions, classes, and files.

**5.2.** Treat files as architectural units, not containers for loosely related code. Prefer several small, focused files over large multi-purpose files.

**5.3.** A module should expose a small, coherent concept. Keep orchestration, generic mechanisms, domain-specific policies, and external-format parsing separate when they are distinct responsibilities.

**5.4.** Keep functions small and focused enough that their control flow and purpose can be understood locally.

**5.5.** Put regular expressions in named variables at file scope. Simple patterns with one to three characters in their body may remain inline, as may patterns in test and smoke files.

## 6. Robustness

**6.1.** Practice concrete defensiveness, not speculative defensiveness. Add validation or guards for specific, plausible failure modes rather than hypothetical misuse.

**6.2.** Do not introduce precautionary complexity unless it protects against a known problem or materially improves correctness.

**6.3.** Localize recoverable failures when practical. A problem with one operation should not automatically invalidate unrelated operations.

**6.4.** Prefer warning and safely skipping an individual operation over aborting the entire run when continued execution is safe.

**6.5.** Never perform a destructive operation when a known required precondition is unsatisfied.

## 7. JSDoc and Comments

**7.1.** Do not use comments to explain code. Express intent through names, small functions, and structure.

**7.2.** Use JSDoc to document extension-facing APIs when explicitly requested. You may suggest documentation for a specific API and explain why it would help.

**7.3.** Use named types in JSDoc. Import expressions and import tags inside JSDoc are prohibited; they do not resolve reliably in this project's WebStorm setup.

**7.4.** Make external library types available through project TypeScript declaration files and global aliases.

**7.5.** Use multiline blocks for function and class documentation. A single-line `@type` annotation on a variable or property is allowed.

**7.6.** Documented functions must explain their contract and specify every parameter's type and the return type, including `void`. Document relevant errors and edge cases.

**7.7.** A class must have complete, consistent extension API documentation or no JSDoc. When updating documentation, make it complete and useful or omit it. Explicit user instructions take precedence.

## 8. Project Specifics

**8.1.** `src/pie/canonTierTable.js` is generated by `npm run pie`. Change tier thresholds in `src/pie/canonTiers.js` and regenerate; do not edit the table by hand.

**8.2.** Measure parser and tag changes with the research tasks (`npm run evaluate`, `npm run verdicts`, `npm run pie`, `npm run ast-fixtures`) before committing. Tag precision against Scryfall and held review verdicts must not regress. AST fixtures in `tasks/ast/fixtures/` must not regress; when a change fixes a pending case, remove its `pending` marker in the same change.

**8.3.** Inspect a card's parse tree with `npm run ast -- "Card Name"` rather than ad hoc scripts.
