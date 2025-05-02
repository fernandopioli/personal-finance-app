import { AccountType } from '@domain/account'
import { InvalidAccountTypeError } from '@domain/account/errors'
import { domainAssert } from '@tests/framework'

describe('AccountType Value Object', () => {
  it('should create valid AccountType instances', () => {
    const correnteResult = AccountType.create('corrente')
    const corrente = domainAssert.expectResultSuccess(correnteResult)
    domainAssert.expectValidValueObject(corrente, 'corrente')

    const poupancaResult = AccountType.create('poupanca')
    const poupanca = domainAssert.expectResultSuccess(poupancaResult)
    domainAssert.expectValidValueObject(poupanca, 'poupanca')
  })

  it('should fail with invalid type', () => {
    const result = AccountType.create('investimento')
    domainAssert.expectResultFailure(result, [
      new InvalidAccountTypeError('type', 'investimento'),
    ])
  })

  it('should fail with invalid type for validate method', () => {
    const result = AccountType.validate('investimento')
    domainAssert.expectResultFailure(result, [
      new InvalidAccountTypeError('type', 'investimento'),
    ])
  })

  it('should compare types correctly', () => {
    const corrente1 = AccountType.create('corrente').value
    const corrente2 = AccountType.create('corrente').value
    const poupanca = AccountType.create('poupanca').value

    domainAssert.assertTrue(corrente1.equals(corrente2))
    domainAssert.assertFalse(corrente1.equals(poupanca))
  })
})
