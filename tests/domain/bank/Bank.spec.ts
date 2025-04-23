import { Bank } from '@domain/bank'
import { Result } from '@domain/core'
import { expectFailureWithMessage } from '@tests/utils'

describe('Bank Entity', () => {
  const validBankData = {
    id: '20354d7a-e4fe-47af-8ff6-187bca92f3f9',
    name: 'Itau',
    code: '341',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  }

  const createBank = (overrides = {}) => {
    return Bank.load({ ...validBankData, ...overrides })
  }

  it('should load a valid Bank with name >= 3 and code 3-length', () => {
    const result = createBank()

    expect(result).toBeInstanceOf(Result)
    expect(result.isSuccess).toBe(true)

    const bank = result.value
    expect(bank.id.value).toBe(validBankData.id)
    expect(bank.name).toBe(validBankData.name)
    expect(bank.code).toBe(validBankData.code)
    expect(bank.createdAt).toBeInstanceOf(Date)
    expect(bank.updatedAt).toBeInstanceOf(Date)
    expect(bank.deletedAt).toBeNull()
  })

  it('should fail if nome is empty or < 3 chars', () => {
    let result = createBank({ name: '' })
    expectFailureWithMessage(result, 'The field "name" is required.')

    result = createBank({ name: 'Ab' })
    expectFailureWithMessage(
      result,
      'The field "name" must be at least 3 characters. Current length: 2',
    )
  })

  it('should fail if codigo is empty or not exactly 3 chars', () => {
    let result = createBank({ code: '' })
    expectFailureWithMessage(result, 'The field "code" is required.')

    result = createBank({ code: '12' })
    expectFailureWithMessage(
      result,
      'The field "code" must be at least 3 characters. Current length: 2',
    )

    result = createBank({ code: '1234' })
    expectFailureWithMessage(
      result,
      'The field "code" must be at most 3 characters. Current length: 4',
    )
  })
})
