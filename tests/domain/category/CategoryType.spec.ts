import { CategoryType } from '@domain/category'
import { expectSuccess, expectFailureWithMessage } from '@tests/utils'

describe('CategoryType Value Object', () => {
  it('should create valid CategoryType instances', () => {
    const expense = expectSuccess(CategoryType.create('expense'))
    const income = expectSuccess(CategoryType.create('income'))

    expect(expense.value).toBe('expense')
    expect(income.value).toBe('income')
  })

  it('should fail with invalid type', () => {
    const result = CategoryType.create('invalid-type')
    expectFailureWithMessage(
      result,
      'The field "type" must be "expense" or "income". Current: invalid-type',
    )
  })

  it('should fail with invalid type for validate method', () => {
    const result = CategoryType.validate('invalid-type')
    expectFailureWithMessage(
      result,
      'The field "type" must be "expense" or "income". Current: invalid-type',
    )
  })

  it('should compare types correctly', () => {
    const expense1 = expectSuccess(CategoryType.create('expense'))
    const expense2 = expectSuccess(CategoryType.create('expense'))
    const income = expectSuccess(CategoryType.create('income'))

    expect(expense1.equals(expense2)).toBe(true)
    expect(expense1.equals(income)).toBe(false)
  })
})
