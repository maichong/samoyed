import createMemoryHistory from 'history/createMemoryHistory';
import { SamoyedHistory } from '.';

const history = createMemoryHistory() as SamoyedHistory;

history.free = () => {
  console.log('free');
};

export default history;
