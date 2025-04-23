import { AccountType } from '@domain/account'
import { expectSuccess, expectFailureWithMessage } from '@tests/utils'
describe('AccountType Value Object', () => {
  it('should create valid AccountType instances', () => {
    const corrente = expectSuccess(AccountType.create('corrente'))
    const poupanca = expectSuccess(AccountType.create('poupanca'))

    expect(corrente.value).toBe('corrente')
    expect(poupanca.value).toBe('poupanca')
  })

  it('should fail with invalid type', () => {
    const result = AccountType.create('investimento')
    expectFailureWithMessage(
      result,
      'The field "type" must be "corrente" or "poupanca". Current: investimento',
    )
  })
  it('should fail with invalid type for validate method', () => {
    const result = AccountType.validate('investimento')
    expectFailureWithMessage(
      result,
      'The field "type" must be "corrente" or "poupanca". Current: investimento',
    )
  })

  it('should compare types correctly', () => {
    const corrente1 = expectSuccess(AccountType.create('corrente'))
    const corrente2 = expectSuccess(AccountType.create('corrente'))
    const poupanca = expectSuccess(AccountType.create('poupanca'))

    expect(corrente1.equals(corrente2)).toBe(true)
    expect(corrente1.equals(poupanca)).toBe(false)
  })
})
