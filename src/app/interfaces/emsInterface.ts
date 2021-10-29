export interface EmsInterface {
  data: Daum[];
  links: Links;
  meta: Meta;
  actions: Action[];
  isModelTranslatable: boolean;
  orderBy: any;
  orderColumn: any[];
  sortableColumns: string[];
  sortOrder: string;
  defaultSearchKey: any;
  usesSoftDeletes: boolean;
  showSoftDeleted: boolean;
  showCheckboxColumn: boolean;
}

export interface Daum {
  id: number;
  codeEMS: string;
  dateEMS: string;
  departement: string;
  arrondissement: string;
  acteur: string;
  menagesTouches: number;
  personnesAssistances: number;
  resume: any;
  fichierEMS: string;
  created_at: string;
  updated_at: string;
  idAlerte: number;
  longitude: number;
  latitude: number;
}

export interface Links {
  first: string;
  last: string;
  prev: any;
  next: string;
}

export interface Meta {
  current_page: number;
  from: number;
  last_page: number;
  links: Link[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface Link {
  url?: string;
  label: string;
  active: boolean;
}

export interface Action {}
