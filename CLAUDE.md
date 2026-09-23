# CLAUDE.md

Guidance for Claude Code working in this repository.

## What this is

A small React + TypeScript + Vite sandbox for practising component testing with
Jest and React Testing Library. It renders one page (`src/pages/users/Users.tsx`)
that fetches users from the public `jsonplaceholder.typicode.com` API and shows
them in a TanStack Table. Treat it as a learning playground, not a product: new
work is usually a new component plus its test.

## Commands

```bash
npm run dev            # Vite dev server
npm run build          # tsc typecheck, then vite build
npm run lint           # eslint, --max-warnings 0 (must stay clean)
npm test               # jest
npm test -- <pattern>  # run one suite, e.g. npm test -- Button
npm run test:coverage  # jest --coverage
```

`npm run build` runs `tsc` first, so a type error fails the build even though
Vite itself would transpile past it. Run `npm run build` (not just the tests) to
verify types.

## CI

`main` is protected: nobody pushes to it directly, so **every change lands via a
pull request** and the PR's CI run is the gate.

`.github/workflows/ci.yml` runs `npm ci` → `npm run lint` → `npm run build`
(tsc + vite) → `npm run test:coverage` on Node 24. Coverage is uploaded as a
build artifact even when tests fail. The workflow also runs on pushes to `main`,
which with protection on means merge commits — a post-merge safety net, not a
direct-push path.

Run the same sequence locally before opening a PR — it is exactly what CI does.

The required status check is the job named **`Lint, typecheck, test`**. Renaming
the job silently detaches that check from branch protection, so leave the `name:`
alone unless you also update the branch rule.

The test step is hermetic: no test makes a real HTTP request (see Testing
below), so a red test step points at the PR, not at jsonplaceholder.

## Testing

- Jest with the `ts-jest` preset, `jsdom` environment, setup in `testSetup.ts`
  (just `@testing-library/jest-dom`). Tests live beside their component as
  `*.test.tsx`.
- The full suite always runs to completion — `bail` is deliberately not set, so
  a red CI run reports every failing suite, not just the first one.
- **No test touches the network.** `Users.test.tsx` calls `jest.mock("axios")`
  and stubs `axios.get` with fixture users via `jest.mocked(axios.get)`. Do the
  same in any new test that fetches data — never add live-network assertions.
- `AppProvider`'s `QueryClient` is a module singleton, so its cache carries over
  between tests in the same file. A test that needs a fresh fetch (e.g. an
  error state) can't rely on an earlier test's cache being empty.
- Query components under test with `AppProvider` as the wrapper so React Query
  has a client: `render(<Users />, { wrapper: AppProvider })`.

## Import aliases

Two aliases are defined, and all three configs (`vite.config.ts`,
`tsconfig.json` `paths`, `jest.config.js` `moduleNameMapper`) agree on both:

| Alias | Resolves to |
|---|---|
| `@/*` | `src/*` |
| `@components/*` | `src/components/*` |

Convention: use `@/...` for anything that crosses a directory, and keep plain
`./Sibling` for same-folder imports (a test importing its component, `main.tsx`
importing `App`). There are no `../` imports left in `src` — don't reintroduce
them.

`@components/*` is wired up but currently unused; `@/components/...` is the
style the codebase actually uses. If you add a new alias, add it to **all
three** configs — Vite alone only fixes the dev server and leaves `tsc` and
Jest broken.

## Layout notes

- `src/AppProvider.tsx` owns the single `QueryClient`, including the retry
  policy (no retry on `AbortError` or 404, max 2 failures). Data fetching goes
  through hooks in `src/services/` (`useFetchUsers`), types in `src/models/`.
- `src/components/buttons/table/Table.tsx` is a generic TanStack Table renderer
  that has nothing to do with buttons — it is misplaced under `buttons/`. Don't
  copy that nesting for new components; put them directly under
  `src/components/<name>/`.
- Styling is Tailwind. Note that `Table.tsx` uses `bg-qp-gray` and
  `border-qp-dark-gray`, which are **not** defined in `tailwind.config.js` and
  therefore render as nothing. Either define them under `theme.extend.colors` or
  use stock Tailwind colors in new code.
