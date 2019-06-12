import * as React from 'react';
import { RouterChildContext } from '.';

// eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
const context: React.Context<RouterChildContext> = React.createContext({} as RouterChildContext);

context.displayName = 'Router';

export default context;
