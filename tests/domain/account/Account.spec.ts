import { Account } from '@domain/account'
import { InvalidAccountTypeError } from '@domain/account/errors'
import {
  MinLengthError,
  RequiredFieldError,
  InvalidUuidError,
  MaxLengthError,
  InvalidCurrencyError,
} from '@domain/errors'
import { domainAssert } from '@tests/framework'

describe('Account Entity', () => {
  const validCreateData = {
    bankId: '20354d7a-e4fe-47af-8ff6-187bca92f3f9',
    name: 'Minha Conta Nova',
    type: 'poupanca',
    agency: '1234',
    number: '5678',
  }

  const validAccountLoadData = {
    ...validCreateData,
    balance: 1000.55,
    id: '8f2bd772-6af8-48a2-9326-6ef5049d51fa',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  }

  const createAccount = (overrides = {}) =>
    Account.create({ ...validCreateData, ...overrides })

  const loadAccount = (overrides = {}) =>
    Account.load({ ...validAccountLoadData, ...overrides })

  describe('create()', () => {
    it('should create a valid account with default balance = 0', () => {
      const result = createAccount()
      const account = domainAssert.expectResultSuccess(result)

      domainAssert.expectValidEntity(account)
      domainAssert.expectUniqueIdEquals(account.bankId, validCreateData.bankId)
      domainAssert.assertEqual(account.name, validCreateData.name)
      domainAssert.expectValidValueObject(account.type, validCreateData.type)
      domainAssert.assertEqual(account.balance, 0)
      domainAssert.assertEqual(account.agency, validCreateData.agency)
      domainAssert.assertEqual(account.number, validCreateData.number)
    })

    it('should create a valid account with type "corrente"', () => {
      const result = createAccount({ type: 'corrente' })
      const account = domainAssert.expectResultSuccess(result)
      domainAssert.expectValidValueObject(account.type, 'corrente')
    })

    it('should create a valid account with type "poupanca"', () => {
      const result = createAccount({ type: 'poupanca' })
      const account = domainAssert.expectResultSuccess(result)
      domainAssert.expectValidValueObject(account.type, 'poupanca')
    })

    it('should fail if bankId is empty', () => {
      const result = createAccount({ bankId: '' })
      domainAssert.expectResultFailure(result, [
        new RequiredFieldError('bankId'),
      ])
    })

    it('should fail if bankId is not a valid UUID', () => {
      const result = createAccount({ bankId: 'not-a-valid-uuid' })
      domainAssert.expectResultFailure(result, [
        new InvalidUuidError('bankId', 'not-a-valid-uuid'),
      ])
    })

    it('should fail if name is empty', () => {
      const result = createAccount({ name: '' })
      domainAssert.expectResultFailure(result, [new RequiredFieldError('name')])
    })

    it('should fail if name < 3 chars', () => {
      const result = createAccount({ name: 'x' })
      domainAssert.expectResultFailure(result, [
        new MinLengthError('name', 3, 1),
      ])
    })

    it('should fail if type is empty', () => {
      const result = createAccount({ type: '' })
      domainAssert.expectResultFailure(result, [
        new InvalidAccountTypeError('type', ''),
      ])
    })

    it('should fail if type is invalid', () => {
      const result = createAccount({ type: 'investimento' })
      domainAssert.expectResultFailure(result, [
        new InvalidAccountTypeError('type', 'investimento'),
      ])
    })

    it('should fail if agency > 10 chars', () => {
      const result = createAccount({
        agency: '12345678901',
      })
      domainAssert.expectResultFailure(result, [
        new MaxLengthError('agency', 10, 11),
      ])
    })

    it('should fail if number > 20 chars', () => {
      const result = createAccount({
        number: '123456789012345678901',
      })
      domainAssert.expectResultFailure(result, [
        new MaxLengthError('number', 20, 21),
      ])
    })
  })

  describe('load()', () => {
    it('should load a valid account', () => {
      const result = loadAccount()
      const account = domainAssert.expectResultSuccess(result)

      domainAssert.expectValidEntity(account, validAccountLoadData.id)
      domainAssert.expectUniqueIdEquals(
        account.bankId,
        validAccountLoadData.bankId,
      )
      domainAssert.assertEqual(account.name, validAccountLoadData.name)
      domainAssert.expectValidValueObject(
        account.type,
        validAccountLoadData.type,
      )
      domainAssert.assertEqual(account.balance, validAccountLoadData.balance)
      domainAssert.assertEqual(account.agency, validAccountLoadData.agency)
      domainAssert.assertEqual(account.number, validAccountLoadData.number)
    })
  })

  describe('update methods', () => {
    it('should update data (except balance)', () => {
      const result = loadAccount()
      const account = domainAssert.expectResultSuccess(result)
      const updates = {
        bankId: '20354d7a-e4fe-47af-8ff6-187bca92f3f9',
        name: 'Conta Editada',
        type: 'corrente',
        agency: '999',
        number: 'XYZ',
      }

      const updateResult = account.updateData(updates)

      domainAssert.expectResultSuccess(updateResult)
      domainAssert.expectUniqueIdEquals(account.bankId, updates.bankId)
      domainAssert.assertEqual(account.name, updates.name)
      domainAssert.expectValidValueObject(account.type, updates.type)
      domainAssert.assertEqual(account.agency, updates.agency)
      domainAssert.assertEqual(account.number, updates.number)
    })

    it('should fail update if fields are invalid', () => {
      const result = loadAccount()
      const account = domainAssert.expectResultSuccess(result)

      const updates = {
        name: 'x',
        bankId: 'not-a-valid-uuid',
        type: 'investimento',
        agency: '12345678901',
        number: '123456789012345678901',
      }

      const updateResult = account.updateData(updates)

      domainAssert.expectResultFailure(updateResult, [
        new MinLengthError('name', 3, 1),
        new InvalidUuidError('bankId', 'not-a-valid-uuid'),
        new MaxLengthError('agency', 10, 11),
        new MaxLengthError('number', 20, 21),
        new InvalidAccountTypeError('type', 'investimento'),
      ])
    })

    it('should update balance with setBalance()', () => {
      const result = loadAccount()
      const account = domainAssert.expectResultSuccess(result)

      const updateResult = account.setBalance(2000)
      domainAssert.expectResultSuccess(updateResult)
      domainAssert.assertEqual(account.balance, 2000)
    })

    it('should fail if setBalance < 0', () => {
      const result = loadAccount()
      const account = domainAssert.expectResultSuccess(result)

      const updateResult = account.setBalance(-100)
      domainAssert.expectResultFailure(updateResult, [
        new InvalidCurrencyError('balance', -100),
      ])
    })
  })
})
