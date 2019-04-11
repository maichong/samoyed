import * as React from 'react';
import { RouterChildContext } from '.';

const context: React.Context<RouterChildContext> = React.createContext({} as RouterChildContext);

context.displayName = 'Router';

export default context;
