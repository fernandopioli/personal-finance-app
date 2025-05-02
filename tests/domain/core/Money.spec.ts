import { Money } from '@domain/core'
import {
  IncompatibleCurrencyError,
  InvalidMoneyValueError,
} from '@domain/errors'
import { domainAssert } from '@tests/framework'

describe('Money Value Object', () => {
  describe('create()', () => {
    it('should create a valid Money with amount and default currency', () => {
      const result = Money.create(100.5)
      const money = domainAssert.expectResultSuccess(result)

      domainAssert.expectMoneyEquals(money, 100.5, 'BRL')
    })

    it('should create a valid Money with custom currency', () => {
      const result = Money.create(100.5, 'USD')
      const money = domainAssert.expectResultSuccess(result)

      domainAssert.expectMoneyEquals(money, 100.5, 'USD')
    })

    it('should normalize lowercase currency to uppercase', () => {
      const result = Money.create(100.5, 'usd')
      const money = domainAssert.expectResultSuccess(result)

      domainAssert.expectMoneyEquals(money, 100.5, 'USD')
    })

    it('should fail if amount has more than 2 decimal places', () => {
      const result = Money.create(100.505)

      domainAssert.expectResultFailure(result, [
        new InvalidMoneyValueError('amount', 100.505),
      ])
    })

    it('should fail if amount is not a number', () => {
      const result = Money.create(NaN)

      domainAssert.expectResultFailure(result, [
        new InvalidMoneyValueError('amount', NaN),
      ])
    })

    it('should fail if currency is not 3 letters', () => {
      const resultTooLong = Money.create(100, 'USDD')
      domainAssert.expectResultFailure(resultTooLong, [
        new InvalidMoneyValueError('currency', 'USDD'),
      ])

      const resultTooShort = Money.create(100, 'US')
      domainAssert.expectResultFailure(resultTooShort, [
        new InvalidMoneyValueError('currency', 'US'),
      ])
    })
  })

  describe('zero()', () => {
    it('should create a zero money value with default currency', () => {
      const money = Money.zero()

      domainAssert.expectMoneyEquals(money, 0, 'BRL')
    })
  })

  describe('add()', () => {
    it('should add two money values with same currency', () => {
      const money1 = domainAssert.expectResultSuccess(Money.create(100))
      const money2 = domainAssert.expectResultSuccess(Money.create(200))

      const result = money1.add(money2)
      const sum = domainAssert.expectResultSuccess(result)

      domainAssert.expectMoneyEquals(sum, 300, 'BRL')
    })

    it('should fail when adding different currencies', () => {
      const money1 = domainAssert.expectResultSuccess(Money.create(100, 'USD'))
      const money2 = domainAssert.expectResultSuccess(Money.create(200, 'EUR'))

      const result = money1.add(money2)

      domainAssert.expectResultFailure(result, [
        new IncompatibleCurrencyError('add', 'USD', 'EUR'),
      ])
    })

    it('should preserve decimal places when adding', () => {
      const money1 = domainAssert.expectResultSuccess(Money.create(100.25))
      const money2 = domainAssert.expectResultSuccess(Money.create(200.3))

      const result = money1.add(money2)
      const sum = domainAssert.expectResultSuccess(result)

      domainAssert.expectMoneyEquals(sum, 300.55, 'BRL')
    })
  })

  describe('subtract()', () => {
    it('should subtract two money values with same currency', () => {
      const money1 = domainAssert.expectResultSuccess(Money.create(300))
      const money2 = domainAssert.expectResultSuccess(Money.create(100))

      const result = money1.subtract(money2)
      const difference = domainAssert.expectResultSuccess(result)

      domainAssert.expectMoneyEquals(difference, 200, 'BRL')
    })

    it('should allow negative results from subtraction', () => {
      const money1 = domainAssert.expectResultSuccess(Money.create(100))
      const money2 = domainAssert.expectResultSuccess(Money.create(300))

      const result = money1.subtract(money2)
      const difference = domainAssert.expectResultSuccess(result)

      domainAssert.expectMoneyEquals(difference, -200, 'BRL')
    })

    it('should fail when subtracting different currencies', () => {
      const money1 = domainAssert.expectResultSuccess(Money.create(100, 'USD'))
      const money2 = domainAssert.expectResultSuccess(Money.create(200, 'EUR'))

      const result = money1.subtract(money2)

      domainAssert.expectResultFailure(result, [
        new IncompatibleCurrencyError('subtract', 'USD', 'EUR'),
      ])
    })
  })

  describe('multiply()', () => {
    it('should multiply money by a factor', () => {
      const money = domainAssert.expectResultSuccess(Money.create(100))

      const result = money.multiply(2.5)
      const product = domainAssert.expectResultSuccess(result)

      domainAssert.expectMoneyEquals(product, 250, 'BRL')
    })

    it('should handle multiplication by zero', () => {
      const money = domainAssert.expectResultSuccess(Money.create(100))

      const result = money.multiply(0)
      const product = domainAssert.expectResultSuccess(result)

      domainAssert.expectMoneyEquals(product, 0, 'BRL')
    })

    it('should handle multiplication by negative numbers', () => {
      const money = domainAssert.expectResultSuccess(Money.create(100))

      const result = money.multiply(-1)
      const product = domainAssert.expectResultSuccess(result)

      domainAssert.expectMoneyEquals(product, -100, 'BRL')
    })

    it('should preserve decimal precision', () => {
      const money = domainAssert.expectResultSuccess(Money.create(10))

      const result = money.multiply(0.33)
      const product = domainAssert.expectResultSuccess(result)

      domainAssert.assertTrue(
        Math.abs(product.amount - 3.3) < 0.00001,
        'Expected value to be approximately 3.3',
      )
    })
  })

  describe('format()', () => {
    it('should format BRL correctly', () => {
      const money = domainAssert.expectResultSuccess(Money.create(1234.56))
      const formatted = money.format()

      domainAssert.assertTrue(formatted.includes('R$'))
      domainAssert.assertTrue(formatted.includes('1.234,56'))
    })

    it('should format USD correctly', () => {
      const money = domainAssert.expectResultSuccess(
        Money.create(1234.56, 'USD'),
      )
      const formatted = money.format()

      domainAssert.assertTrue(formatted.includes('US$'))
      domainAssert.assertTrue(formatted.includes('1.234,56'))
    })
  })

  describe('equality', () => {
    it('should consider equal money with same amount and currency', () => {
      const money1 = domainAssert.expectResultSuccess(Money.create(100))
      const money2 = domainAssert.expectResultSuccess(Money.create(100))
      const money3 = domainAssert.expectResultSuccess(Money.create(200))
      const money4 = domainAssert.expectResultSuccess(Money.create(100, 'USD'))

      domainAssert.assertTrue(money1.equals(money2))
      domainAssert.expectMoneysEqual(money1, money2)
      domainAssert.assertFalse(money1.equals(money3))
      domainAssert.assertFalse(money1.equals(money4))
    })
  })
})
