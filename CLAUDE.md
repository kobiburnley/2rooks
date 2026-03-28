# Code conventions

## Exports and imports
Always use named exports and imports. Never use `export default`.

```ts
// correct
export const Foo = ...
export function Foo() {}
import { Foo } from './Foo'

// wrong
export default Foo
import Foo from './Foo'
```
