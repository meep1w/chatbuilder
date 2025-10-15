/**
 * Make Picked properties in T optional
 */
type PartialPick<T, K extends keyof T> = Omit<T, K> & {
   [P in K]?: T[P]
}

/** If A exists Return B else C  */
type ifGen<A, B, C> = [A] extends [undefined | never] ? C : B

/** Indexes of an array ["a", "b", "c"] => 0 | 1 | 2*/
type IndexesOf<A extends unknown[], R = []> = R["length"] extends A["length"] ? R[number] : IndexesOf<A, [...R, R["length"]]>
