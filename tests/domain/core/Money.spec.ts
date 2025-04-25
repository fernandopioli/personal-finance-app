import { Money, Result } from '@domain/core'
import { expectSuccess, expectFailureWithMessage } from '@tests/utils'

describe('Money Value Object', () => {
  describe('create()', () => {
    it('should create a valid Money with amount and default currency', () => {
      const money = expectSuccess(Money.create(100.5))

      expect(money.amount).toBe(100.5)
      expect(money.currency).toBe('BRL')
    })

    it('should create a valid Money with custom currency', () => {
      const money = expectSuccess(Money.create(100.5, 'USD'))

      expect(money.amount).toBe(100.5)
      expect(money.currency).toBe('USD')
    })

    it('should fail if amount has more than 2 decimal places', () => {
      const result = Money.create(100.505)

      expectFailureWithMessage(
        result,
        'must be a valid monetary value with up to 2 decimal places',
      )
    })

    it('should fail if amount is not a number', () => {
      const result = Money.create(NaN)

      expectFailureWithMessage(result, 'must be a valid monetary value')
    })

    it('should fail if currency is not 3 uppercase letters', () => {
      const resultLowercase = Money.create(100, 'usd')
      expectFailureWithMessage(
        resultLowercase,
        'must be a valid ISO 4217 currency code',
      )

      const resultTooLong = Money.create(100, 'USDD')
      expectFailureWithMessage(
        resultTooLong,
        'must be a valid ISO 4217 currency code',
      )

      const resultTooShort = Money.create(100, 'US')
      expectFailureWithMessage(
        resultTooShort,
        'must be a valid ISO 4217 currency code',
      )
    })
  })

  describe('zero()', () => {
    it('should create a zero money value with default currency', () => {
      const money = Money.zero()

      expect(money.amount).toBe(0)
      expect(money.currency).toBe('BRL')
    })
  })

  describe('add()', () => {
    it('should add two money values with same currency', () => {
      const money1 = expectSuccess(Money.create(100))
      const money2 = expectSuccess(Money.create(200))

      const result = money1.add(money2)
      const sum = expectSuccess(result)

      expect(sum.amount).toBe(300)
      expect(sum.currency).toBe('BRL')
    })

    it('should fail when adding different currencies', () => {
      const money1 = expectSuccess(Money.create(100, 'USD'))
      const money2 = expectSuccess(Money.create(200, 'EUR'))

      const result = money1.add(money2)

      expectFailureWithMessage(
        result,
        'Cannot add money with different currencies: USD and EUR',
      )
    })

    it('should preserve decimal places when adding', () => {
      const money1 = expectSuccess(Money.create(100.25))
      const money2 = expectSuccess(Money.create(200.3))

      const result = money1.add(money2)
      const sum = expectSuccess(result)

      expect(sum.amount).toBe(300.55)
    })
  })

  describe('subtract()', () => {
    it('should subtract two money values with same currency', () => {
      const money1 = expectSuccess(Money.create(300))
      const money2 = expectSuccess(Money.create(100))

      const result = money1.subtract(money2)
      const difference = expectSuccess(result)

      expect(difference.amount).toBe(200)
      expect(difference.currency).toBe('BRL')
    })

    it('should allow negative results from subtraction', () => {
      const money1 = expectSuccess(Money.create(100))
      const money2 = expectSuccess(Money.create(300))

      const result = money1.subtract(money2)
      const difference = expectSuccess(result)

      expect(difference.amount).toBe(-200)
    })

    it('should fail when subtracting different currencies', () => {
      const money1 = expectSuccess(Money.create(100, 'USD'))
      const money2 = expectSuccess(Money.create(200, 'EUR'))

      const result = money1.subtract(money2)

      expectFailureWithMessage(
        result,
        'Cannot subtract money with different currencies: USD and EUR',
      )
    })
  })

  describe('multiply()', () => {
    it('should multiply money by a factor', () => {
      const money = expectSuccess(Money.create(100))

      const result = money.multiply(2.5)
      const product = expectSuccess(result)

      expect(product.amount).toBe(250)
    })

    it('should handle multiplication by zero', () => {
      const money = expectSuccess(Money.create(100))

      const result = money.multiply(0)
      const product = expectSuccess(result)

      expect(product.amount).toBe(0)
    })

    it('should handle multiplication by negative numbers', () => {
      const money = expectSuccess(Money.create(100))

      const result = money.multiply(-1)
      const product = expectSuccess(result)

      expect(product.amount).toBe(-100)
    })

    it('should preserve decimal precision', () => {
      const money = expectSuccess(Money.create(10))

      const result = money.multiply(0.33)
      const product = expectSuccess(result)

      expect(product.amount).toBeCloseTo(3.3, 2)
    })
  })

  describe('format()', () => {
    it('should format BRL correctly', () => {
      const money = expectSuccess(Money.create(1234.56))
      const formatted = money.format()

      expect(formatted).toContain('R$')
      expect(formatted).toContain('1.234,56')
    })

    it('should format USD correctly', () => {
      const money = expectSuccess(Money.create(1234.56, 'USD'))
      const formatted = money.format()

      expect(formatted).toContain('US$')
      expect(formatted).toContain('1.234,56')
    })
  })

  describe('equality', () => {
    it('should consider equal money with same amount and currency', () => {
      const money1 = expectSuccess(Money.create(100))
      const money2 = expectSuccess(Money.create(100))

      expect(money1.equals(money2)).toBe(true)
    })

    it('should consider different money with different amount', () => {
      const money1 = expectSuccess(Money.create(100))
      const money2 = expectSuccess(Money.create(200))

      expect(money1.equals(money2)).toBe(false)
    })

    it('should consider different money with different currency', () => {
      const money1 = expectSuccess(Money.create(100, 'USD'))
      const money2 = expectSuccess(Money.create(100, 'EUR'))

      expect(money1.equals(money2)).toBe(false)
    })
  })
})
