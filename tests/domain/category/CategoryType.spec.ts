import { CategoryType } from '@domain/category'
import { InvalidCategoryTypeError } from '@domain/category/errors'
import { domainAssert } from '@tests/framework'

describe('CategoryType Value Object', () => {
  describe('create()', () => {
    it('should create valid CategoryType instances', () => {
      const expenseResult = CategoryType.create('expense')
      domainAssert.expectResultSuccess(expenseResult)
      domainAssert.expectValidValueObject(expenseResult.value, 'expense')

      const incomeResult = CategoryType.create('income')
      domainAssert.expectResultSuccess(incomeResult)
      domainAssert.expectValidValueObject(incomeResult.value, 'income')
    })

    it('should fail with invalid type', () => {
      const result = CategoryType.create('invalid-type')

      domainAssert.expectResultFailure(result, [
        new InvalidCategoryTypeError('type', 'invalid-type'),
      ])
    })
  })

  describe('validate()', () => {
    it('should fail with invalid type for validate method', () => {
      const result = CategoryType.validate('invalid-type')

      domainAssert.expectResultFailure(result, [
        new InvalidCategoryTypeError('type', 'invalid-type'),
      ])
    })
  })

  describe('equals()', () => {
    it('should compare types correctly', () => {
      const expense1 = CategoryType.create('expense').value
      const expense2 = CategoryType.create('expense').value
      const income = CategoryType.create('income').value

      domainAssert.expectValidValueObject(expense1, 'expense')

      domainAssert.assertTrue(expense1.equals(expense2))
      domainAssert.assertFalse(expense1.equals(income))
    })
  })
})
