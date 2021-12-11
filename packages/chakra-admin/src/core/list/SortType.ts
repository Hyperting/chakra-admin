export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export type SortType<T extends object> = Record<keyof T, SortDirection>
