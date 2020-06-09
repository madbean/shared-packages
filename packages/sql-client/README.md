# `sql-client`

> TODO: description

## Usage

```js
import { multi } from 'multi-dotenv'
import nconf from 'nconf';
import { SQLClient } from '@front-n-back/sql-client';

multi();
nconf.env();

export default new SQLClient(nconf.get());
```
