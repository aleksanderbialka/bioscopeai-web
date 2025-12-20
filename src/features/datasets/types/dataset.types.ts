export interface DatasetMinimal {
  id: string;
  name: string;
}

export interface Dataset {
  id: string;
  name: string;
  description: string | null;
  owner_username: string;
  created_at: string;
}

export interface DatasetCreate {
  name: string;
  description?: string | null;
}

export interface DatasetUpdate {
  name?: string | null;
  description?: string | null;
}
