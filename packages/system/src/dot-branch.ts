export type AnyObject = Record<string, any>

export type DotJoin<A extends string, B extends string> = A extends '' ? B : `${A}.${B}`

export type DeepKeys<O extends AnyObject> = {
  [K in keyof O]: O[K] extends AnyObject ? K : never
}[keyof O]

/**
 * from: https://stackoverflow.com/a/67779282/4012282
 */
export type DotBranch<
  O extends AnyObject,
  P extends string = '',
  // @ts-expect-error Type 'keyof O' does not satisfy the constraint 'string'.
  K extends string = keyof O
> = K extends DeepKeys<O> ? DotBranch<O[K], DotJoin<P, K>> : /** ********** */ DotJoin<P, K>
