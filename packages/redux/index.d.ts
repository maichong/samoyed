
import { Store as ReduxStore, Reducer } from 'redux';
import { Action } from 'redux-actions';
import { Saga, Task } from '@redux-saga/types';
import { ObjectMap } from '@samoyed/types';

declare module '@samoyed/app' {
  export interface Defaults {
    generateListApiUrl?: (params: GenerateListApiParams) => string;
    generateDetailApiUrl?: (params: GenerateDetailApiParams) => string;
  }

  export interface Actions {
    // device
    applyDevice?: (payload: ApplyDevicePayload) => void;
    // user
    applyUser?: (payload: Partial<UserState>) => void;
    // lists
    loadList?: (payload: LoadListPayload) => void;
    loadMore?: (payload: LoadMorePayload) => void;
    applyList?: (payload: ApplyListPayload) => void;
    clearList?: (payload: ClearListPayload) => void;
    // details
    loadDetail?: (payload: LoadDetailPayload) => void;
    applyDetail?: (payload: ApplyDetailPayload) => void;
    clearDetails?: (payload: ClearDetailsPayload) => void;
    batchClearDetails?: (payload: ClearDetailsPayload[]) => void;
  }
}

// exports

export function configureStore(rootReducer: Reducer, rootSaga: Saga): Store;

// interfaces

export interface GenerateListApiParams {
  model: string;
  limit: number;
  filters?: any | null;
}

export interface GenerateDetailApiParams {
  model: string;
  id: string;
}

export interface User {
  id: string;
  displayName: string;
  avatar: string;
}

export interface Client {
}

export interface Site {
}

export interface Page {
}

export interface Layout {
}

export interface Store extends ReduxStore<StoreState, any> {
  runSaga<S extends Saga>(saga: S, ...args: Parameters<S>): Task;
}

export interface StoreState {
  details: DetailsState;
  lists: ListsState;
  site: SiteState;
  client: ClientState;
  user: UserState;
  pages: PagesState;
  layouts: LayoutsState;
}

export type SiteState = Site | null;
export type ClientState = Client | null;
export type UserState = User;

export interface PagesState {
  list: Page[];
  map: ObjectMap<Page>;
}

export interface LayoutsState {
  list: Layout[];
  map: ObjectMap<Layout>;
}

export interface ApplyDevicePayload {
  id: string;
  session: string;
  site?: Site;
  client?: Client;
  user?: User | null;
  pages?: Page[];
  layouts?: Layout[];
}

// details

export interface DetailsState {
  [model: string]: ObjectMap<Record>;
}

export interface Record {
  id?: string;
  error?: Error;
  fetching?: boolean;
  loaded?: boolean;
  rev?: number;
  [path: string]: any;
}

export type RecordMap<T extends Record = Record> = ObjectMap<T>;

export interface ClearDetailsPayload {
  model: string;
  ids?: string[];
}

export interface LoadDetailPayload {
  model: string;
  id: any;
  callback?: (data: any) => any;
}

export interface ApplyDetailPayload {
  model: string;
  data: any;
}

// lists

export interface ListsState {
  [model: string]: RecordList[];
}

export type RecordListArray<T extends Record = Record> = RecordList<T>[];

export interface ClearListPayload {
  model?: string;
}

export interface LoadListPayload {
  model: string;
  page?: number;
  limit?: number;
  filters?: any;
  search?: string;
  sort?: string;
  populations?: string[] | null;
  callback?: (list: RecordList) => any;
}

export interface LoadMorePayload {
  model: string;
  list: RecordList;
  callback?: (list: RecordList) => any;
}

export interface ApplyListPayload<T = any> {
  model: string;
  sort?: string;
  search?: string;
  filters: any | null;
  populations: string[] | null;

  rev?: number;

  // akita result
  limit: number;
  total: number;
  totalPage: number;
  page: number;
  previous: number;
  next: number;
  results: T[];
}

export interface LoadListFailurePayload {
  model: string;
  error: Error;

  sort?: string;
  search?: string;
  filters: any | null;
  populations?: string[] | null;
  limit: number;
}

export interface RecordList<T extends Record = Record> {
  // request
  model: string;
  sort?: string;
  search?: string;
  filters: any | null;
  populations: string[] | null;
  limit: number;

  // status
  error?: Error;
  fetching: boolean;
  loaded?: boolean;
  rev: number;

  // akita result
  total: number;
  totalPage: number;
  page: number;
  previous: number;
  next: number;
  results: T[];
  map: ObjectMap<T>;
}
