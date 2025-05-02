import { Bank } from '@domain/bank'
import {
  MinLengthError,
  RequiredFieldError,
  MaxLengthError,
  ValidationError,
} from '@domain/errors'
import { domainAssert } from '@tests/framework'

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

  describe('load()', () => {
    it('should load a valid Bank with name >= 3 and code 3-length', () => {
      const result = createBank()
      const bank = domainAssert.expectResultSuccess(result)

      domainAssert.expectValidEntity(bank)
      domainAssert.assertEqual(bank.name, validBankData.name)
      domainAssert.assertEqual(bank.code, validBankData.code)
      domainAssert.expectUniqueIdEquals(bank.id, validBankData.id)
    })

    it('should fail if name is empty or < 3 chars', () => {
      let result = createBank({ name: '' })
      domainAssert.expectResultFailure(result, [new RequiredFieldError('name')])

      result = createBank({ name: 'Ab' })
      domainAssert.expectResultFailure(result, [
        new MinLengthError('name', 3, 2),
      ])
    })

    it('should fail if code is empty or not exactly 3 chars', () => {
      let result = createBank({ code: '' })
      domainAssert.expectResultFailure(result, [new RequiredFieldError('code')])

      result = createBank({ code: '12' })
      domainAssert.expectResultFailure(result, [
        new MinLengthError('code', 3, 2),
      ])

      result = createBank({ code: '1234' })
      domainAssert.expectResultFailure(result, [
        new MaxLengthError('code', 3, 4),
      ])
    })
  })
})
