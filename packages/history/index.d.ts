import { MemoryHistory } from 'history/createMemoryHistory';

export interface SamoyedHistory extends MemoryHistory {
  free: () => void;
}

declare const history: SamoyedHistory;

export default history;
