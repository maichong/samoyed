
export interface ListSelector {
  search?: string;
  sort?: string;
  filters?: any | null;
  populations?: string[] | any;
  limit?: number;
}


export interface List {
  search?: string;
  sort?: string;
  limit?: number;
  filters?: any;
  populations?: any | string[];
}
