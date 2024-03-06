import { useCallback, useEffect, useRef, useState } from 'react'
import Dexie, { Table } from 'dexie'
import { PaginationMode } from './ListProps'
import { nanoid } from 'nanoid/non-secure'
import { CursorPagination } from './useList'

const MAX_STACK_SIZE = 1000
const SESSION_STORAGE_KEY = 'chakra-admin-cursors-history'

export interface StackItem {
  id: string
  sessionId: string
  resource: string
}

export interface Session {
  id: string
  createdAt: number
}

export class StackDB extends Dexie {
  history!: Table<StackItem>

  sessions!: Table<Session>

  constructor() {
    super('CACursorsHistory')
    this.version(1).stores({
      history: 'id, sessionId',
      sessions: 'id, createdAt',
    })
  }
}

export const db = new StackDB()

export type UseCursorsHistoryOptions = Omit<CursorPagination, 'onPageChange' | 'onSortChange' | 'paginationMode'> & {
  resource: string
  paginationMode: PaginationMode
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UseCursorsHistoryResult<TItem> = {
  length: number
  push: (item?: TItem | undefined | null) => void
  pop: () => TItem | undefined | null
  reset: () => void
  get: (index: number) => TItem | undefined | null
  getLast: () => TItem | undefined | null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useCursorsHistory<TItem = string>({
  resource,
  paginationMode,
  after,
  before,
  total,
  pageCount,
}: UseCursorsHistoryOptions): UseCursorsHistoryResult<TItem> {
  const [length, setLength] = useState<number>(0)
  const listId = useRef<string | null>(null)
  const stack = useRef<(TItem | undefined | null)[]>([])

  const push = useCallback(
    (item) => {
      stack.current.push(item)
      db.history.add({ id: item, sessionId: listId.current!, resource: resource! })

      if (stack.current.length > MAX_STACK_SIZE) {
        const first = stack.current.shift()
        db.history
          .where('id')
          .equals(first as any)
          .delete()
      }

      setLength(stack.current.length)
    },
    [resource],
  )

  const pop = useCallback(() => {
    const item = stack.current.pop()
    db.history.where({ id: item }).delete()
    setLength(stack.current.length)
    return item
  }, [])

  const deleteStackFromDb = useCallback(() => {
    return db.history.where({ sessionId: listId.current, resource }).delete()
  }, [resource])

  const reset = useCallback(() => {
    stack.current = []
    deleteStackFromDb()
    setLength(0)
  }, [deleteStackFromDb])

  const get = useCallback((index: number) => {
    return stack.current[index]
  }, [])

  const getLast = useCallback(() => {
    return stack.current[stack.current.length - 1]
  }, [])

  useEffect(() => {
    let ignore = false

    const load = async () => {
      let newListId = sessionStorage?.getItem(SESSION_STORAGE_KEY)
      // clean up old sessions
      const sessions = await db.sessions
        .where('createdAt')
        .below(Date.now() - 1000 * 60 * 60 * 24)
        .toArray()

      db.history.bulkDelete(sessions.filter((s) => s.id !== listId.current).map((s) => s.id))
      db.sessions.bulkDelete(sessions.map((s) => s.id))

      if (!newListId) {
        newListId = nanoid(10)
        sessionStorage?.setItem(SESSION_STORAGE_KEY, newListId)
        await db.sessions.add({ id: newListId, createdAt: Date.now() })
      } else {
        await db.sessions.where({ id: newListId }).modify({ createdAt: Date.now() })
      }

      listId.current = newListId

      const items = await db.history.where({ sessionId: newListId, resource }).toArray()

      if (!ignore) {
        // the case when you go to the same page that before was paginated but now should start from the beginning
        if (!after && !before && items.length > 0) {
          await deleteStackFromDb()
          stack.current = []
          setLength(0)
        }
        // the case when you go to the same page in another session and the stack is empty
        else if ((after || before) && items.length === 0) {
          console.log('sono proprio qua')
        } else {
          stack.current = items.map((item) => item.id as any)
          setLength(stack.current.length)
        }
      }
    }

    if (paginationMode === 'cursor' && typeof total !== 'number' && typeof pageCount !== 'number') {
      load()
    }

    return () => {
      ignore = true
    }
  }, [])

  return {
    length,
    push,
    pop,
    reset,
    get,
    getLast,
  }
}
