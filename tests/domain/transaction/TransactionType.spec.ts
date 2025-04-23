import { TransactionType } from '@domain/transaction'
import { expectSuccess, expectFailureWithMessage } from '@tests/utils'
describe('TransactionType Value Object', () => {
  it('should create valid TransactionType instances', () => {
    const expense = expectSuccess(TransactionType.create('expense'))
    const income = expectSuccess(TransactionType.create('income'))

    expect(expense.value).toBe('expense')
    expect(income.value).toBe('income')
  })

  it('should fail with invalid type', () => {
    const result = TransactionType.create('invalid-type')
    expectFailureWithMessage(
      result,
      'The field "type" must be "expense" or "income". Current: invalid-type',
    )
  })
  it('should fail with invalid type for validate method', () => {
    const result = TransactionType.validate('invalid-type')
    expectFailureWithMessage(
      result,
      'The field "type" must be "expense" or "income". Current: invalid-type',
    )
  })

  it('should compare types correctly', () => {
    const expense1 = expectSuccess(TransactionType.create('expense'))
    const expense2 = expectSuccess(TransactionType.create('expense'))
    const income = expectSuccess(TransactionType.create('income'))

    expect(expense1.equals(expense2)).toBe(true)
    expect(expense1.equals(income)).toBe(false)
  })
})
