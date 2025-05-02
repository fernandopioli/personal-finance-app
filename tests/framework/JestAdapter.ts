import { TestAdapter } from '@tests/framework/TestAdapter'

export class JestAdapter implements TestAdapter {
  assertEqual(actual: any, expected: any, message?: string): void {
    if (message) {
      try {
        expect(actual).toBe(expected)
      } catch (error) {
        throw new Error(message)
      }
    } else {
      expect(actual).toBe(expected)
    }
  }

  assertTrue(value: boolean, message?: string): void {
    if (message) {
      try {
        expect(value).toBe(true)
      } catch (error) {
        throw new Error(message)
      }
    } else {
      expect(value).toBe(true)
    }
  }

  assertFalse(value: boolean, message?: string): void {
    if (message) {
      try {
        expect(value).toBe(false)
      } catch (error) {
        throw new Error(message)
      }
    } else {
      expect(value).toBe(false)
    }
  }

  assertDefined(value: any, message?: string): void {
    if (message) {
      try {
        expect(value).toBeDefined()
      } catch (error) {
        throw new Error(message)
      }
    } else {
      expect(value).toBeDefined()
    }
  }

  assertUndefined(value: any, message?: string): void {
    if (message) {
      try {
        expect(value).toBeUndefined()
      } catch (error) {
        throw new Error(message)
      }
    } else {
      expect(value).toBeUndefined()
    }
  }

  assertNull(value: any, message?: string): void {
    if (message) {
      try {
        expect(value).toBeNull()
      } catch (error) {
        throw new Error(message)
      }
    } else {
      expect(value).toBeNull()
    }
  }

  assertNotNull(value: any, message?: string): void {
    if (message) {
      try {
        expect(value).not.toBeNull()
      } catch (error) {
        throw new Error(message)
      }
    } else {
      expect(value).not.toBeNull()
    }
  }

  assertContains<T>(collection: T[], item: T, message?: string): void {
    if (message) {
      try {
        expect(collection).toContain(item)
      } catch (error) {
        throw new Error(message)
      }
    } else {
      expect(collection).toContain(item)
    }
  }

  assertLength<T>(collection: T[], length: number, message?: string): void {
    if (message) {
      try {
        expect(collection).toHaveLength(length)
      } catch (error) {
        throw new Error(message)
      }
    } else {
      expect(collection).toHaveLength(length)
    }
  }

  assertGreaterThan(actual: number, expected: number, message?: string): void {
    if (message) {
      try {
        expect(actual).toBeGreaterThan(expected)
      } catch (error) {
        throw new Error(message)
      }
    } else {
      expect(actual).toBeGreaterThan(expected)
    }
  }

  assertLessThan(actual: number, expected: number, message?: string): void {
    if (message) {
      try {
        expect(actual).toBeLessThan(expected)
      } catch (error) {
        throw new Error(message)
      }
    } else {
      expect(actual).toBeLessThan(expected)
    }
  }

  assertMatch(value: string, regex: RegExp, message?: string): void {
    if (message) {
      try {
        expect(value).toMatch(regex)
      } catch (error) {
        throw new Error(message)
      }
    } else {
      expect(value).toMatch(regex)
    }
  }

  assertThrows(fn: Function, message?: string): void {
    if (message) {
      try {
        expect(fn).toThrow()
      } catch (error) {
        throw new Error(message)
      }
    } else {
      expect(fn).toThrow()
    }
  }

  assertTypeOf(value: any, type: string, message?: string): void {
    if (message) {
      try {
        expect(typeof value).toBe(type)
      } catch (error) {
        throw new Error(message)
      }
    } else {
      expect(typeof value).toBe(type)
    }
  }

  assertInstanceOf<T>(
    instance: any,
    expectedClass: new (...args: any[]) => T,
    message?: string,
  ): void {
    if (message) {
      try {
        expect(instance).toBeInstanceOf(expectedClass)
      } catch (error) {
        throw new Error(message)
      }
    } else {
      expect(instance).toBeInstanceOf(expectedClass)
    }
  }

  assertDeepEqual(actual: any, expected: any, message?: string): void {
    if (message) {
      try {
        expect(actual).toEqual(expected)
      } catch (error) {
        throw new Error(message)
      }
    } else {
      expect(actual).toEqual(expected)
    }
  }

  assertNotEqual(actual: any, expected: any, message?: string): void {
    if (message) {
      try {
        expect(actual).not.toBe(expected)
      } catch (error) {
        throw new Error(message)
      }
    } else {
      expect(actual).not.toBe(expected)
    }
  }

  logMessage(message: string): void {
    console.log(message)
  }
}
