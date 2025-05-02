import { TransactionType } from '@domain/transaction'
import { InvalidTransactionTypeError } from '@domain/transaction/errors'
import { domainAssert } from '@tests/framework'

describe('TransactionType Value Object', () => {
  it('should create valid TransactionType instances', () => {
    const expenseResult = TransactionType.create('expense')
    const expense = domainAssert.expectResultSuccess(expenseResult)
    domainAssert.expectValidValueObject(expense, 'expense')

    const incomeResult = TransactionType.create('income')
    const income = domainAssert.expectResultSuccess(incomeResult)
    domainAssert.expectValidValueObject(income, 'income')
  })

  it('should fail with invalid type', () => {
    const result = TransactionType.create('invalid-type')
    domainAssert.expectResultFailure(result, [
      new InvalidTransactionTypeError('type', 'invalid-type'),
    ])
  })

  it('should fail with invalid type for validate method', () => {
    const result = TransactionType.validate('invalid-type')
    domainAssert.expectResultFailure(result, [
      new InvalidTransactionTypeError('type', 'invalid-type'),
    ])
  })

  it('should compare types correctly', () => {
    const expense1 = TransactionType.create('expense').value
    const expense2 = TransactionType.create('expense').value
    const income = TransactionType.create('income').value

    domainAssert.assertTrue(expense1.equals(expense2))
    domainAssert.assertFalse(expense1.equals(income))
  })
})
