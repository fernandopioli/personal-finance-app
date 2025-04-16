import { Account, AccountType } from '@domain/account'
import { Result } from '@domain/core'

describe('Account Entity', () => {
  const validCreateData = {
    bankId: '20354d7a-e4fe-47af-8ff6-187bca92f3f9',
    name: 'Minha Conta Nova',
    type: 'poupanca' as AccountType,
    agency: '1234',
    number: '5678',
  }

  const validAccountLoadData = {
    id: '8f2bd772-6af8-48a2-9326-6ef5049d51fa',
    bankId: '20354d7a-e4fe-47af-8ff6-187bca92f3f9',
    name: 'Minha Conta',
    type: 'corrente' as AccountType,
    balance: 1000.55,
    agency: '12345',
    number: '987654',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  }

  const createAccount = (overrides = {}) =>
    Account.create({ ...validCreateData, ...overrides })

  const loadAccount = (overrides = {}) =>
    Account.load({ ...validAccountLoadData, ...overrides })

  const expectFailureWithMessage = (
    result: Result<any>,
    messagePart: string,
    length: number = 1,
  ) => {
    expect(result.isFailure).toBe(true)
    expect(result.errors.length).toBeGreaterThanOrEqual(length)
    const hasMsg = result.errors.some((err: any) =>
      err.message.includes(messagePart),
    )
    expect(hasMsg).toBe(true)
  }

  const expectSuccess = <T>(result: Result<T>) => {
    expect(result.isSuccess).toBe(true)
    return result.value
  }

  const expectMultipleErrors = (
    result: Result<any>,
    expectedErrors: string[],
  ) => {
    expect(result.isFailure).toBe(true)
    expect(result.errors.length).toBe(expectedErrors.length)

    expectedErrors.forEach((expectedError, index) => {
      expect(result.errors[index].message).toBe(expectedError)
    })
  }

  describe('create()', () => {
    it('should create a valid account with default balance = 0', () => {
      const account = expectSuccess(createAccount())

      expect(account.id).toBeDefined()
      expect(account.bankId.value).toBe(validCreateData.bankId)
      expect(account.name).toBe(validCreateData.name)
      expect(account.type).toBe(validCreateData.type)
      expect(account.balance).toBe(0)
      expect(account.agency).toBe(validCreateData.agency)
      expect(account.number).toBe(validCreateData.number)
    })

    it('should create a valid account with type "corrente"', () => {
      const account = expectSuccess(createAccount({ type: 'corrente' }))
      expect(account.type).toBe('corrente')
    })

    it('should create a valid account with type "poupanca"', () => {
      const account = expectSuccess(createAccount({ type: 'poupanca' }))
      expect(account.type).toBe('poupanca')
    })

    it('should fail if bankId is empty', () => {
      const result = createAccount({ bankId: '' })
      expectFailureWithMessage(result, '"bankId" is required', 1)
    })

    it('should fail if bankId is not a valid UUID', () => {
      const result = createAccount({ bankId: 'not-a-valid-uuid' })
      expectFailureWithMessage(result, 'must be a valid UUID', 1)
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
      const result = createAccount({ type: 'investimento' as any })
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

  describe('load()', () => {
    it('should load a valid account', () => {
      const account = expectSuccess(loadAccount())

      expect(account.id.value).toBe(validAccountLoadData.id)
      expect(account.bankId.value).toBe(validAccountLoadData.bankId)
      expect(account.name).toBe(validAccountLoadData.name)
      expect(account.type).toBe(validAccountLoadData.type)
      expect(account.balance).toBe(validAccountLoadData.balance)
      expect(account.agency).toBe(validAccountLoadData.agency)
      expect(account.number).toBe(validAccountLoadData.number)
    })
  })

  describe('update methods', () => {
    it('should update data (except balance)', () => {
      const account = expectSuccess(loadAccount())

      const updateResult = account.updateData({
        bankId: '20354d7a-e4fe-47af-8ff6-187bca92f3f9',
        name: 'Conta Editada',
        type: 'corrente',
        agency: '999',
        number: 'XYZ',
      })

      expectSuccess(updateResult)

      expect(account.id.value).toBe(validAccountLoadData.id)
      expect(account.bankId.value).toBe('20354d7a-e4fe-47af-8ff6-187bca92f3f9')
      expect(account.name).toBe('Conta Editada')
      expect(account.type).toBe('corrente')
      expect(account.agency).toBe('999')
      expect(account.number).toBe('XYZ')
    })

    it('should fail update if fields are invalid', () => {
      const account = expectSuccess(loadAccount())

      const failResult = account.updateData({
        name: 'x',
        bankId: 'not-a-valid-uuid',
        type: 'investimento' as any,
        agency: '12345678901',
        number: '123456789012345678901',
      })

      expectMultipleErrors(failResult, [
        'The field "name" must be at least 3 characters. Current length: 1',
        'The field "bankId" must be a valid UUID. Current: not-a-valid-uuid',
        'The field "type" must be "corrente" or "poupanca". Current: investimento',
        'The field "agency" must be at most 10 characters. Current length: 11',
        'The field "number" must be at most 20 characters. Current length: 21',
      ])
    })

    it('should update balance with setBalance()', () => {
      const account = expectSuccess(loadAccount())
      expectSuccess(account.setBalance(2000))
      expect(account.balance).toBe(2000)
    })

    it('should fail if setBalance < 0', () => {
      const account = expectSuccess(loadAccount())
      const failResult = account.setBalance(-100)
      expectFailureWithMessage(
        failResult,
        'Balance cannot be negative. Current: -100',
      )
    })
  })
})
