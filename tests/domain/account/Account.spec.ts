import { describe, it, expect } from '@jest/globals'
import { Account } from '@domain/account'
import { Result } from '@domain/core'

const validCreateData = {
  bankId: '20354d7a-e4fe-47af-8ff6-187bca92f3f9',
  name: 'Minha Conta Nova',
  type: 'poupanca' as 'poupanca' | 'corrente',
  agency: '1234',
  number: '5678',
}

function createAccount(overrides = {}) {
  return Account.create({ ...validCreateData, ...overrides })
}

function expectFailureWithMessage(
  result: Result<any>,
  messagePart: string,
  length: number = 1,
) {
  expect(result.isFailure).toBe(true)
  expect(result.errors.length).toBeGreaterThanOrEqual(length)
  const hasMsg = result.errors.some((err: any) =>
    err.message.includes(messagePart),
  )
  expect(hasMsg).toBe(true)
}

const validAccountLoadData = {
  id: '8f2bd772-6af8-48a2-9326-6ef5049d51fa',
  bankId: '20354d7a-e4fe-47af-8ff6-187bca92f3f9',
  name: 'Minha Conta',
  type: 'corrente' as 'corrente' | 'poupanca',
  balance: 1000.55,
  agency: '12345',
  number: '987654',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
}

function loadAccount(overrides = {}) {
  return Account.load({ ...validAccountLoadData, ...overrides })
}

describe('Account Entity', () => {
  describe('Account Entity - create()', () => {
    it('should create a valid account with default balance = 0', () => {
      const result = createAccount()
      expect(result.isSuccess).toBe(true)

      const account = result.value
      expect(account.id).toBeDefined()
      expect(account.bankId.value).toBe(validCreateData.bankId)
      expect(account.name).toBe(validCreateData.name)
      expect(account.type).toBe(validCreateData.type)
      expect(account.balance).toBe(0)

      expect(account.agency).toBe(validCreateData.agency)
      expect(account.number).toBe(validCreateData.number)
    })

    it('should create a valid account with type "corrente"', () => {
      const result = createAccount({ type: 'corrente' })
      expect(result.isSuccess).toBe(true)

      const account = result.value
      expect(account.type).toBe('corrente')
    })

    it('should create a valid account with type "poupanca"', () => {
      const result = createAccount({ type: 'poupanca' })
      expect(result.isSuccess).toBe(true)

      const account = result.value
      expect(account.type).toBe('poupanca')
    })

    it('should fail if bankId is empty', () => {
      const result = createAccount({ bankId: '' })
      expectFailureWithMessage(result, '"bankId" is required', 1)
    })

    it('should fail if name is empty', () => {
      const result = createAccount({ name: '' })
      expectFailureWithMessage(result, '"name" is required', 1)
    })
    it('should fail if name < 3 chars', () => {
      const result = createAccount({ name: 'x' })
      expectFailureWithMessage(
        result,
        'The field "name" must be at least 3 characters. Current length: 1',
      )
    })

    it('should fail if type is invalid', () => {
      const result = createAccount({ type: 'investimento' })
      expectFailureWithMessage(
        result,
        'The field "type" must be "corrente" or "poupanca". Current: investimento',
      )
    })

    it('should fail if agency > 10 chars', () => {
      const result = createAccount({
        agency: '12345678901',
      })
      expectFailureWithMessage(
        result,
        'The field "agency" must be at most 10 characters. Current length: 11',
      )
    })
    it('should fail if number > 20 chars', () => {
      const result = createAccount({
        number: '123456789012345678901',
      })
      expectFailureWithMessage(
        result,
        'The field "number" must be at most 20 characters. Current length: 21',
      )
    })
  })
  describe('Account Entity - load()', () => {
    it('should load a valid account', () => {
      const result = loadAccount()
      expect(result.isSuccess).toBe(true)

      const account = result.value
      expect(account.id.value).toBe(validAccountLoadData.id)
      expect(account.bankId.value).toBe(validAccountLoadData.bankId)
      expect(account.name).toBe(validAccountLoadData.name)
      expect(account.type).toBe(validAccountLoadData.type)
      expect(account.balance).toBe(validAccountLoadData.balance)
      expect(account.agency).toBe(validAccountLoadData.agency)
      expect(account.number).toBe(validAccountLoadData.number)
    })
  })
  describe('Account Entity - update methods', () => {
    it('should update data (except balance)', () => {
      const loadResult = loadAccount()
      const account = loadResult.value

      const updateResult = account.updateData({
        bankId: '20354d7a-e4fe-47af-8ff6-187bca92f3f9',
        name: 'Conta Editada',
        type: 'corrente',
        agency: '999',
        number: 'XYZ',
      })

      expect(updateResult.isSuccess).toBe(true)

      expect(account.id.value).toBe(validAccountLoadData.id)
      expect(account.bankId.value).toBe(validAccountLoadData.bankId)
      expect(account.name).toBe('Conta Editada')
      expect(account.type).toBe('corrente')
      expect(account.agency).toBe('999')
      expect(account.number).toBe('XYZ')
    })

    it('should fail update fields are invalid', () => {
      const account = loadAccount().value

      const failResult = account.updateData({
        name: 'x',
        type: 'investimento' as 'corrente' | 'poupanca',
        agency: '12345678901',
        number: '123456789012345678901',
      })
      expect(failResult.isFailure).toBe(true)
      expect(failResult.errors.length).toBe(4)
      expect(failResult.errors[0].message).toBe(
        'The field "name" must be at least 3 characters. Current length: 1',
      )
      expect(failResult.errors[1].message).toBe(
        'The field "type" must be "corrente" or "poupanca". Current: investimento',
      )
      expect(failResult.errors[2].message).toBe(
        'The field "agency" must be at most 10 characters. Current length: 11',
      )
      expect(failResult.errors[3].message).toBe(
        'The field "number" must be at most 20 characters. Current length: 21',
      )
    })

    it('should update balance with setBalance()', () => {
      const account = loadAccount().value
      const resultSet = account.setBalance(2000)
      expect(resultSet.isSuccess).toBe(true)
      expect(account.balance).toBe(2000)
    })

    it('should fail if setBalance < 0', () => {
      const account = loadAccount().value
      const failResult = account.setBalance(-100)
      expectFailureWithMessage(
        failResult,
        'Balance cannot be negative. Current: -100',
      )
    })
  })
})
