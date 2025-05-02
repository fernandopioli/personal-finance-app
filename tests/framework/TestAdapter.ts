export interface TestAdapter {
  assertEqual(actual: any, expected: any, message?: string): void
  assertTrue(value: boolean, message?: string): void
  assertFalse(value: boolean, message?: string): void
  assertDefined(value: any, message?: string): void
  assertUndefined(value: any, message?: string): void
  assertNull(value: any, message?: string): void
  assertNotNull(value: any, message?: string): void
  assertContains<T>(collection: T[], item: T, message?: string): void
  assertLength<T>(collection: T[], length: number, message?: string): void
  assertGreaterThan(actual: number, expected: number, message?: string): void
  assertLessThan(actual: number, expected: number, message?: string): void
  assertMatch(value: string, regex: RegExp, message?: string): void
  assertThrows(fn: Function, message?: string): void
  assertTypeOf(value: any, type: string, message?: string): void
  assertInstanceOf<T>(
    instance: any,
    expectedClass: new (...args: any[]) => T,
    message?: string,
  ): void
  assertDeepEqual(actual: any, expected: any, message?: string): void
  assertNotEqual(actual: any, expected: any, message?: string): void
  logMessage(message: string): void
}
