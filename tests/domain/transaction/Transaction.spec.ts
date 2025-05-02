import {
  Transaction,
  TransactionCreateInput,
  TransactionLoadInput,
} from '@domain/transaction'
import {
  InvalidTransactionTypeError,
  InvalidTransactionSourceError,
  InvalidInstallmentError,
} from '@domain/transaction/errors'
import {
  RequiredFieldError,
  InvalidUuidError,
  MinLengthError,
  InvalidDateError,
  InvalidCurrencyError,
} from '@domain/errors'
import { domainAssert } from '@tests/framework'

describe('Transaction Entity', () => {
  const validAccountTransaction: TransactionCreateInput = {
    date: new Date(),
    type: 'expense',
    description: 'Mercado',
    amount: 100,
    categoryId: '8f2bd772-6af8-48a2-9326-6ef5049d51fa',
    accountId: '20354d7a-e4fe-47af-8ff6-187bca92f3f9',
  }

  const validInvoiceTransaction: TransactionCreateInput = {
    date: new Date(),
    type: 'expense',
    description: 'Restaurante',
    amount: 150,
    categoryId: '8f2bd772-6af8-48a2-9326-6ef5049d51fa',
    invoiceId: '30354d7a-e4fe-47af-8ff6-187bca92f3f9',
  }

  const validInstallmentTransaction: TransactionCreateInput = {
    date: new Date(),
    type: 'expense',
    description: 'TV Nova',
    amount: 500,
    categoryId: '8f2bd772-6af8-48a2-9326-6ef5049d51fa',
    invoiceId: '30354d7a-e4fe-47af-8ff6-187bca92f3f9',
    currentInstallment: 1,
    totalInstallments: 10,
    installmentGroupId: '40354d7a-e4fe-47af-8ff6-187bca92f3f9',
  }

  const validIncomeTransaction: TransactionCreateInput = {
    date: new Date(),
    type: 'income',
    description: 'Salário',
    amount: 2000,
    categoryId: '8f2bd772-6af8-48a2-9326-6ef5049d51fa',
    accountId: '20354d7a-e4fe-47af-8ff6-187bca92f3f9',
  }

  const validLoadData: TransactionLoadInput = {
    id: '8f2bd772-6af8-48a2-9326-6ef5049d51fa',
    date: new Date(),
    type: 'expense',
    description: 'Mercado',
    amount: 100,
    categoryId: '8f2bd772-6af8-48a2-9326-6ef5049d51fa',
    accountId: '20354d7a-e4fe-47af-8ff6-187bca92f3f9',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  }

  const validLoadInstallmentData: TransactionLoadInput = {
    ...validLoadData,
    accountId: undefined,
    invoiceId: '30354d7a-e4fe-47af-8ff6-187bca92f3f9',
    currentInstallment: 1,
    totalInstallments: 10,
    installmentGroupId: '40354d7a-e4fe-47af-8ff6-187bca92f3f9',
  }

  describe('create()', () => {
    it('should create a valid expense transaction from account', () => {
      const result = Transaction.create(validAccountTransaction)
      const transaction = domainAssert.expectResultSuccess(result)

      domainAssert.expectValidEntity(transaction)
      domainAssert.assertEqual(transaction.date, validAccountTransaction.date)
      domainAssert.assertTrue(transaction.isExpense())
      domainAssert.assertFalse(transaction.isIncome())
      domainAssert.assertEqual(
        transaction.description,
        validAccountTransaction.description,
      )
      domainAssert.expectUniqueIdEquals(
        transaction.categoryId,
        validAccountTransaction.categoryId,
      )
      domainAssert.assertEqual(
        transaction.amount,
        validAccountTransaction.amount,
      )
      domainAssert.expectUniqueIdEquals(
        transaction.accountId!,
        validAccountTransaction.accountId!,
      )
      domainAssert.assertEqual(transaction.invoiceId, undefined)
      domainAssert.assertTrue(transaction.isFromAccount())
      domainAssert.assertFalse(transaction.isFromInvoice())
      domainAssert.assertFalse(transaction.isInstallment())
    })

    it('should create a valid expense transaction from invoice', () => {
      const result = Transaction.create(validInvoiceTransaction)
      const transaction = domainAssert.expectResultSuccess(result)

      domainAssert.expectValidEntity(transaction)
      domainAssert.assertTrue(transaction.isExpense())
      domainAssert.assertEqual(
        transaction.amount,
        validInvoiceTransaction.amount,
      )
      domainAssert.assertEqual(transaction.accountId, undefined)
      domainAssert.expectUniqueIdEquals(
        transaction.invoiceId!,
        validInvoiceTransaction.invoiceId!,
      )
      domainAssert.assertFalse(transaction.isFromAccount())
      domainAssert.assertTrue(transaction.isFromInvoice())
    })

    it('should create a valid income transaction', () => {
      const result = Transaction.create(validIncomeTransaction)
      const transaction = domainAssert.expectResultSuccess(result)

      domainAssert.expectValidEntity(transaction)
      domainAssert.assertEqual(
        transaction.amount,
        validIncomeTransaction.amount,
      )
      domainAssert.assertFalse(transaction.isExpense())
      domainAssert.assertTrue(transaction.isIncome())
    })

    it('should create a valid installment transaction', () => {
      const result = Transaction.create(validInstallmentTransaction)
      const transaction = domainAssert.expectResultSuccess(result)

      domainAssert.assertEqual(transaction.accountId, undefined)
      domainAssert.expectUniqueIdEquals(
        transaction.invoiceId!,
        validInstallmentTransaction.invoiceId!,
      )
      domainAssert.assertFalse(transaction.isFromAccount())
      domainAssert.assertTrue(transaction.isFromInvoice())
      domainAssert.assertEqual(
        transaction.currentInstallment,
        validInstallmentTransaction.currentInstallment,
      )
      domainAssert.assertEqual(
        transaction.totalInstallments,
        validInstallmentTransaction.totalInstallments,
      )
      domainAssert.expectUniqueIdEquals(
        transaction.installmentGroupId!,
        validInstallmentTransaction.installmentGroupId!,
      )
      domainAssert.assertTrue(transaction.isInstallment())
    })

    it('should fail if date is empty', () => {
      const result = Transaction.create({
        ...validAccountTransaction,
        date: undefined as unknown as Date,
      })

      domainAssert.expectResultFailure(result, [new RequiredFieldError('date')])
    })

    it('should fail if date is not a valid date', () => {
      const result = Transaction.create({
        ...validAccountTransaction,
        date: 'not-a-valid-date' as unknown as Date,
      })

      domainAssert.expectResultFailure(result, [
        new InvalidDateError('date', 'not-a-valid-date'),
      ])
    })

    it('should fail if type is empty', () => {
      const result = Transaction.create({
        ...validAccountTransaction,
        type: '',
      })

      domainAssert.expectFieldErrors(result, ['type'])
    })

    it('should fail if type is not a valid transaction type', () => {
      const result = Transaction.create({
        ...validAccountTransaction,
        type: 'not-a-valid-type',
      })

      domainAssert.expectResultFailure(result, [
        new InvalidTransactionTypeError('type', 'not-a-valid-type'),
      ])
    })

    it('should fail if description is empty', () => {
      const result = Transaction.create({
        ...validAccountTransaction,
        description: '',
      })

      domainAssert.expectResultFailure(result, [
        new RequiredFieldError('description'),
      ])
    })

    it('should fail if description is too short', () => {
      const result = Transaction.create({
        ...validAccountTransaction,
        description: 'AB',
      })

      domainAssert.expectResultFailure(result, [
        new MinLengthError('description', 3, 2),
      ])
    })

    it('should fail if categoryId is empty', () => {
      const result = Transaction.create({
        ...validAccountTransaction,
        categoryId: '',
      })

      domainAssert.expectResultFailure(result, [
        new RequiredFieldError('categoryId'),
      ])
    })

    it('should fail if categoryId is not a valid UUID', () => {
      const result = Transaction.create({
        ...validAccountTransaction,
        categoryId: 'not-a-valid-uuid',
      })

      domainAssert.expectResultFailure(result, [
        new InvalidUuidError('categoryId', 'not-a-valid-uuid'),
      ])
    })

    it('should fail if amount is empty', () => {
      const result = Transaction.create({
        ...validAccountTransaction,
        amount: undefined as unknown as number,
      })

      domainAssert.expectResultFailure(result, [
        new RequiredFieldError('amount'),
      ])
    })

    it('should fail if amount is not a number', () => {
      const result = Transaction.create({
        ...validAccountTransaction,
        amount: 'not-a-number' as unknown as number,
      })

      domainAssert.expectResultFailure(result, [
        new InvalidCurrencyError('amount', 'not-a-number' as unknown as number),
      ])
    })

    it('should fail if both accountId and invoiceId are provided', () => {
      const result = Transaction.create({
        ...validAccountTransaction,
        invoiceId: '30354d7a-e4fe-47af-8ff6-187bca92f3f9',
      })

      domainAssert.expectResultFailure(result, [
        new InvalidTransactionSourceError(),
      ])
    })

    it('should fail if neither accountId nor invoiceId is provided', () => {
      const { accountId, ...noAccountInput } = validAccountTransaction
      const result = Transaction.create(noAccountInput)

      domainAssert.expectResultFailure(result, [
        new InvalidTransactionSourceError(),
      ])
    })

    it('should fail if accountId is not a valid UUID', () => {
      const result = Transaction.create({
        ...validAccountTransaction,
        accountId: 'not-a-valid-uuid',
      })

      domainAssert.expectResultFailure(result, [
        new InvalidUuidError('accountId', 'not-a-valid-uuid'),
      ])
    })

    it('should fail if invoiceId is not a valid UUID', () => {
      const result = Transaction.create({
        ...validInvoiceTransaction,
        invoiceId: 'not-a-valid-uuid',
      })

      domainAssert.expectResultFailure(result, [
        new InvalidUuidError('invoiceId', 'not-a-valid-uuid'),
      ])
    })

    it('should fail if missing current installment', () => {
      const { currentInstallment, ...noCurrentInput } =
        validInstallmentTransaction
      const result = Transaction.create(noCurrentInput)

      domainAssert.expectResultFailure(result, [
        InvalidInstallmentError.missingCurrentInstallment(),
      ])
    })

    it('should fail if missing total installments', () => {
      const { totalInstallments, ...noTotalInput } = validInstallmentTransaction
      const result = Transaction.create(noTotalInput)

      domainAssert.expectResultFailure(result, [
        InvalidInstallmentError.missingTotalInstallments(),
      ])
    })

    it('should fail if missing installment group ID', () => {
      const { installmentGroupId, ...noGroupInput } =
        validInstallmentTransaction
      const result = Transaction.create(noGroupInput)

      domainAssert.expectResultFailure(result, [
        InvalidInstallmentError.missingGroupId(),
      ])
    })

    it('should fail if current installment > total installments', () => {
      const result = Transaction.create({
        ...validInstallmentTransaction,
        currentInstallment: 11,
        totalInstallments: 10,
      })

      domainAssert.expectResultFailure(result, [
        InvalidInstallmentError.currentGreaterThanTotal(11, 10),
      ])
    })

    it('should fail if currentInstallment value < 1', () => {
      const result = Transaction.create({
        ...validInstallmentTransaction,
        currentInstallment: 0,
        totalInstallments: 10,
      })

      domainAssert.expectResultFailure(result, [
        InvalidInstallmentError.invalidValue('current installment', 0),
      ])
    })

    it('should fail if totalInstallments value < 1', () => {
      const result = Transaction.create({
        ...validInstallmentTransaction,
        currentInstallment: 1,
        totalInstallments: 0,
      })

      domainAssert.expectResultFailure(result, [
        InvalidInstallmentError.invalidValue('total installments', 0),
      ])
    })

    it('should fail if installments > 1 without group ID', () => {
      const { installmentGroupId, ...noGroupInput } =
        validInstallmentTransaction
      const result = Transaction.create(noGroupInput)

      domainAssert.expectResultFailure(result, [
        InvalidInstallmentError.missingGroupId(),
      ])
    })

    it('should fail if non-integer installment values', () => {
      const result = Transaction.create({
        ...validInstallmentTransaction,
        currentInstallment: 1.5,
        totalInstallments: 10,
      })

      domainAssert.expectResultFailure(result, [
        InvalidInstallmentError.invalidValue('current installment', 1.5),
      ])
    })
  })

  describe('load()', () => {
    it('should load a valid account transaction', () => {
      const result = Transaction.load(validLoadData)
      const transaction = domainAssert.expectResultSuccess(result)

      domainAssert.expectValidEntity(transaction, validLoadData.id)
      domainAssert.expectValidValueObject(transaction.type, validLoadData.type)
      domainAssert.assertTrue(transaction.isExpense())
      domainAssert.assertEqual(transaction.amount, validLoadData.amount)
      domainAssert.assertEqual(transaction.date, validLoadData.date)
      domainAssert.assertEqual(
        transaction.description,
        validLoadData.description,
      )
      domainAssert.expectUniqueIdEquals(
        transaction.categoryId,
        validLoadData.categoryId,
      )
      domainAssert.expectUniqueIdEquals(
        transaction.accountId!,
        validLoadData.accountId!,
      )
    })

    it('should load a valid installment transaction', () => {
      const result = Transaction.load(validLoadInstallmentData)
      const transaction = domainAssert.expectResultSuccess(result)

      domainAssert.expectValidEntity(transaction, validLoadInstallmentData.id)
      domainAssert.assertEqual(
        transaction.amount,
        validLoadInstallmentData.amount,
      )
      domainAssert.assertTrue(transaction.isExpense())
      domainAssert.assertEqual(transaction.date, validLoadInstallmentData.date)
      domainAssert.assertEqual(
        transaction.description,
        validLoadInstallmentData.description,
      )
      domainAssert.expectUniqueIdEquals(
        transaction.categoryId,
        validLoadInstallmentData.categoryId,
      )
      domainAssert.assertEqual(transaction.accountId, undefined)
      domainAssert.expectUniqueIdEquals(
        transaction.invoiceId!,
        validLoadInstallmentData.invoiceId!,
      )
      domainAssert.assertEqual(
        transaction.currentInstallment,
        validLoadInstallmentData.currentInstallment,
      )
      domainAssert.assertEqual(
        transaction.totalInstallments,
        validLoadInstallmentData.totalInstallments,
      )
      domainAssert.expectUniqueIdEquals(
        transaction.installmentGroupId!,
        validLoadInstallmentData.installmentGroupId!,
      )
    })
  })

  describe('updateData()', () => {
    it('should update basic fields', () => {
      const loadResult = Transaction.load(validLoadData)
      const transaction = domainAssert.expectResultSuccess(loadResult)

      const newDate = new Date(2023, 5, 15)
      const newType = 'income'
      const newAmount = 200
      const newDescription = 'Mercado Atualizado'
      const newCategoryId = '9f2bd772-6af8-48a2-9326-6ef5049d51fa'

      const updateResult = transaction.updateData({
        date: newDate,
        type: newType,
        amount: newAmount,
        description: newDescription,
        categoryId: newCategoryId,
      })

      domainAssert.expectResultSuccess(updateResult)
      domainAssert.assertEqual(transaction.date, newDate)
      domainAssert.expectValidValueObject(transaction.type, newType)
      domainAssert.assertEqual(transaction.amount, newAmount)
      domainAssert.assertEqual(transaction.description, newDescription)
      domainAssert.expectUniqueIdEquals(transaction.categoryId, newCategoryId)
    })

    it('should fail if date is not a valid date', () => {
      const loadResult = Transaction.load(validLoadData)
      const transaction = domainAssert.expectResultSuccess(loadResult)

      const result = transaction.updateData({
        date: 'not-a-valid-date' as unknown as Date,
      })

      domainAssert.expectResultFailure(result, [
        new InvalidDateError('date', 'not-a-valid-date'),
      ])
    })

    it('should fail if type is not a valid transaction type', () => {
      const loadResult = Transaction.load(validLoadData)
      const transaction = domainAssert.expectResultSuccess(loadResult)

      const result = transaction.updateData({ type: 'not-a-valid-type' })

      domainAssert.expectResultFailure(result, [
        new InvalidTransactionTypeError('type', 'not-a-valid-type'),
      ])
    })

    it('should fail if description is too short', () => {
      const loadResult = Transaction.load(validLoadData)
      const transaction = domainAssert.expectResultSuccess(loadResult)

      const result = transaction.updateData({ description: 'AB' })

      domainAssert.expectResultFailure(result, [
        new MinLengthError('description', 3, 2),
      ])
    })

    it('should fail if categoryId is not a valid UUID', () => {
      const loadResult = Transaction.load(validLoadData)
      const transaction = domainAssert.expectResultSuccess(loadResult)

      const result = transaction.updateData({ categoryId: 'not-a-valid-uuid' })

      domainAssert.expectResultFailure(result, [
        new InvalidUuidError('categoryId', 'not-a-valid-uuid'),
      ])
    })

    it('should fail if amount is not a valid currency value', () => {
      const loadResult = Transaction.load(validLoadData)
      const transaction = domainAssert.expectResultSuccess(loadResult)

      const result = transaction.updateData({
        amount: 'not-a-valid-currency' as unknown as number,
      })

      domainAssert.expectFailureWithMessage(
        result,
        'must be a valid currency value',
      )
    })
  })
})
