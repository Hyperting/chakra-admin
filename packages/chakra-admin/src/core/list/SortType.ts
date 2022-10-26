/* eslint-disable no-unused-vars */
export enum OffsetSortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export type OffsetSortType<T extends Record<string, any>> = Record<keyof T, OffsetSortDirection>
