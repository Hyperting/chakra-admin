/* eslint-disable no-unused-vars */
export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export type SortType<T extends Record<string, any>> = Record<keyof T, SortDirection>
