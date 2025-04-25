import { Transaction } from '@domain/transaction'
import { expectSuccess, expectFailureWithMessage } from '@tests/utils'

describe('Transaction Entity', () => {
  const validAccountTransaction = {
    date: new Date(),
    type: 'expense',
    description: 'Mercado',
    amount: 100,
    categoryId: '8f2bd772-6af8-48a2-9326-6ef5049d51fa',
    accountId: '20354d7a-e4fe-47af-8ff6-187bca92f3f9',
  }

  const validInvoiceTransaction = {
    date: new Date(),
    type: 'expense',
    description: 'Restaurante',
    amount: 150,
    categoryId: '8f2bd772-6af8-48a2-9326-6ef5049d51fa',
    invoiceId: '30354d7a-e4fe-47af-8ff6-187bca92f3f9',
  }

  const validInstallmentTransaction = {
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

  const validIncomeTransaction = {
    date: new Date(),
    type: 'income',
    description: 'Salário',
    amount: 2000,
    categoryId: '8f2bd772-6af8-48a2-9326-6ef5049d51fa',
    accountId: '20354d7a-e4fe-47af-8ff6-187bca92f3f9',
  }

  const validLoadData = {
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

  const validLoadInstallmentData = {
    ...validLoadData,
    accountId: undefined,
    invoiceId: '30354d7a-e4fe-47af-8ff6-187bca92f3f9',
    currentInstallment: 1,
    totalInstallments: 10,
    installmentGroupId: '40354d7a-e4fe-47af-8ff6-187bca92f3f9',
  }

  describe('create()', () => {
    it('should create a valid expense transaction from account', () => {
      const transaction = expectSuccess(
        Transaction.create(validAccountTransaction),
      )

      expect(transaction.id).toBeDefined()
      expect(transaction.date).toBe(validAccountTransaction.date)
      expect(transaction.isExpense()).toBe(true)
      expect(transaction.isIncome()).toBe(false)
      expect(transaction.description).toBe(validAccountTransaction.description)
      expect(transaction.categoryId.value).toBe(
        validAccountTransaction.categoryId,
      )
      expect(transaction.amount).toBe(validAccountTransaction.amount)
      expect(transaction.accountId?.value).toBe(
        validAccountTransaction.accountId,
      )
      expect(transaction.invoiceId).toBeUndefined()
      expect(transaction.isFromAccount()).toBe(true)
      expect(transaction.isFromInvoice()).toBe(false)
      expect(transaction.isInstallment()).toBe(false)
    })

    it('should create a valid expense transaction from invoice', () => {
      const transaction = expectSuccess(
        Transaction.create(validInvoiceTransaction),
      )

      expect(transaction.id).toBeDefined()
      expect(transaction.isExpense()).toBe(true)
      expect(transaction.amount).toBe(validInvoiceTransaction.amount)
      expect(transaction.invoiceId?.value).toBe(
        validInvoiceTransaction.invoiceId,
      )
      expect(transaction.accountId).toBeUndefined()
      expect(transaction.isFromAccount()).toBe(false)
      expect(transaction.isFromInvoice()).toBe(true)
    })

    it('should create a valid income transaction', () => {
      const transaction = expectSuccess(
        Transaction.create(validIncomeTransaction),
      )

      expect(transaction.id).toBeDefined()
      expect(transaction.amount).toBe(validIncomeTransaction.amount)
      expect(transaction.isExpense()).toBe(false)
      expect(transaction.isIncome()).toBe(true)
    })

    it('should create a valid installment transaction', () => {
      const transaction = expectSuccess(
        Transaction.create(validInstallmentTransaction),
      )

      expect(transaction.currentInstallment).toBe(
        validInstallmentTransaction.currentInstallment,
      )
      expect(transaction.totalInstallments).toBe(
        validInstallmentTransaction.totalInstallments,
      )
      expect(transaction.installmentGroupId?.value).toBe(
        validInstallmentTransaction.installmentGroupId,
      )
      expect(transaction.isInstallment()).toBe(true)
    })

    it('should fail if date is empty', () => {
      const result = Transaction.create({
        ...validAccountTransaction,
        date: undefined as unknown as Date,
      })

      expectFailureWithMessage(result, '"date" is required')
    })

    it('should fail if date is not a valid date', () => {
      const result = Transaction.create({
        ...validAccountTransaction,
        date: 'not-a-valid-date' as unknown as Date,
      })

      expectFailureWithMessage(result, 'must be a valid date')
    })

    it('should fail if type is empty', () => {
      const result = Transaction.create({
        ...validAccountTransaction,
        type: '',
      })

      expectFailureWithMessage(result, '"type" is required')
    })

    it('should fail if type is not a valid transaction type', () => {
      const result = Transaction.create({
        ...validAccountTransaction,
        type: 'not-a-valid-type',
      })

      expectFailureWithMessage(result, 'must be "expense" or "income"')
    })

    it('should fail if description is empty', () => {
      const result = Transaction.create({
        ...validAccountTransaction,
        description: '',
      })

      expectFailureWithMessage(result, '"description" is required')
    })

    it('should fail if description is too short', () => {
      const result = Transaction.create({
        ...validAccountTransaction,
        description: 'AB',
      })

      expectFailureWithMessage(
        result,
        'The field "description" must be at least 3 characters',
      )
    })

    it('should fail if categoryId is empty', () => {
      const result = Transaction.create({
        ...validAccountTransaction,
        categoryId: '',
      })

      expectFailureWithMessage(result, '"categoryId" is required')
    })

    it('should fail if categoryId is not a valid UUID', () => {
      const result = Transaction.create({
        ...validAccountTransaction,
        categoryId: 'not-a-valid-uuid',
      })

      expectFailureWithMessage(result, 'must be a valid UUID')
    })

    it('should fail if amount is empty', () => {
      const result = Transaction.create({
        ...validAccountTransaction,
        amount: undefined as unknown as number,
      })

      expectFailureWithMessage(result, '"amount" is required')
    })

    it('should fail if amount is not a number', () => {
      const result = Transaction.create({
        ...validAccountTransaction,
        amount: 'not-a-number' as unknown as number,
      })

      expectFailureWithMessage(result, 'must be a valid currency value')
    })

    it('should fail if both accountId and invoiceId are provided', () => {
      const result = Transaction.create({
        ...validAccountTransaction,
        invoiceId: '30354d7a-e4fe-47af-8ff6-187bca92f3f9',
      })

      expectFailureWithMessage(
        result,
        'Transaction must be associated with either an account or an invoice, but not both',
      )
    })

    it('should fail if neither accountId nor invoiceId is provided', () => {
      const { accountId, ...noAccountInput } = validAccountTransaction
      const result = Transaction.create(noAccountInput)

      expectFailureWithMessage(
        result,
        'Transaction must be associated with either an account or an invoice, but not both',
      )
    })

    it('should fail if accountId is not a valid UUID', () => {
      const result = Transaction.create({
        ...validAccountTransaction,
        accountId: 'not-a-valid-uuid',
      })

      expectFailureWithMessage(result, 'must be a valid UUID')
    })

    it('should fail if invoiceId is not a valid UUID', () => {
      const result = Transaction.create({
        ...validInvoiceTransaction,
        invoiceId: 'not-a-valid-uuid',
      })

      expectFailureWithMessage(result, 'must be a valid UUID')
    })

    it('should fail if missing current installment', () => {
      const { currentInstallment, ...noCurrentInput } =
        validInstallmentTransaction
      const result = Transaction.create(noCurrentInput)

      expectFailureWithMessage(
        result,
        'Current installment is required when total installments is provided',
      )
    })

    it('should fail if missing total installments', () => {
      const { totalInstallments, ...noTotalInput } = validInstallmentTransaction
      const result = Transaction.create(noTotalInput)

      expectFailureWithMessage(
        result,
        'Total installments is required when current installment is provided',
      )
    })

    it('should fail if missing installment group ID', () => {
      const { installmentGroupId, ...noGroupInput } =
        validInstallmentTransaction
      const result = Transaction.create(noGroupInput)
    })

    it('should fail if current installment > total installments', () => {
      const result = Transaction.create({
        ...validInstallmentTransaction,
        currentInstallment: 11,
        totalInstallments: 10,
      })

      expectFailureWithMessage(
        result,
        'Current installment (11) cannot be greater than total installments (10)',
      )
    })

    it('should fail if currentInstallment value < 1', () => {
      const result = Transaction.create({
        ...validInstallmentTransaction,
        currentInstallment: 0,
        totalInstallments: 10,
      })

      expectFailureWithMessage(
        result,
        'Invalid current installment value: 0. Must be a positive integer.',
      )
    })

    it('should fail if totalInstallments value < 1', () => {
      const result = Transaction.create({
        ...validInstallmentTransaction,
        currentInstallment: 1,
        totalInstallments: 0,
      })

      expectFailureWithMessage(
        result,
        'Invalid total installments value: 0. Must be a positive integer.',
      )
    })

    it('should fail if installments > 1 without group ID', () => {
      const { installmentGroupId, ...noGroupInput } =
        validInstallmentTransaction
      const result = Transaction.create(noGroupInput)

      expectFailureWithMessage(
        result,
        'Installment group ID is required for installment transactions',
      )
    })

    it('should fail if non-integer installment values', () => {
      const result = Transaction.create({
        ...validInstallmentTransaction,
        currentInstallment: 1.5,
        totalInstallments: 10,
      })

      expectFailureWithMessage(
        result,
        'Invalid current installment value: 1.5. Must be a positive integer.',
      )
    })
  })

  describe('load()', () => {
    it('should load a valid account transaction', () => {
      const transaction = expectSuccess(Transaction.load(validLoadData))

      expect(transaction.id.value).toBe(validLoadData.id)
      expect(transaction.type.value).toBe(validLoadData.type)
      expect(transaction.isExpense()).toBe(true)
      expect(transaction.amount).toBe(validLoadData.amount)
      expect(transaction.date).toBe(validLoadData.date)
      expect(transaction.description).toBe(validLoadData.description)
      expect(transaction.categoryId.value).toBe(validLoadData.categoryId)
      expect(transaction.accountId?.value).toBe(validLoadData.accountId)
    })
    it('should load a valid installment transaction', () => {
      const transaction = expectSuccess(
        Transaction.load(validLoadInstallmentData),
      )

      expect(transaction.id.value).toBe(validLoadInstallmentData.id)
      expect(transaction.amount).toBe(validLoadInstallmentData.amount)
      expect(transaction.isExpense()).toBe(true)
      expect(transaction.date).toBe(validLoadInstallmentData.date)
      expect(transaction.description).toBe(validLoadInstallmentData.description)
      expect(transaction.categoryId.value).toBe(
        validLoadInstallmentData.categoryId,
      )
      expect(transaction.accountId).toBeUndefined()
      expect(transaction.invoiceId?.value).toBe(
        validLoadInstallmentData.invoiceId,
      )
      expect(transaction.currentInstallment).toBe(
        validLoadInstallmentData.currentInstallment,
      )
      expect(transaction.totalInstallments).toBe(
        validLoadInstallmentData.totalInstallments,
      )
      expect(transaction.installmentGroupId?.value).toBe(
        validLoadInstallmentData.installmentGroupId,
      )
    })
  })

  describe('updateData()', () => {
    it('should update basic fields', () => {
      const transaction = expectSuccess(Transaction.load(validLoadData))
      const newDate = new Date(2023, 5, 15)
      const newType = 'income'
      const newAmount = 200
      const newDescription = 'Mercado Atualizado'
      const newCategoryId = '9f2bd772-6af8-48a2-9326-6ef5049d51fa'

      expectSuccess(
        transaction.updateData({
          date: newDate,
          type: newType,
          amount: newAmount,
          description: newDescription,
          categoryId: newCategoryId,
        }),
      )

      expect(transaction.date).toBe(newDate)
      expect(transaction.type.value).toBe(newType)
      expect(transaction.amount).toBe(newAmount)
      expect(transaction.description).toBe(newDescription)
      expect(transaction.categoryId.value).toBe(newCategoryId)
    })

    it('should fail if date is not a valid date', () => {
      const transaction = expectSuccess(Transaction.load(validLoadData))
      const result = transaction.updateData({
        date: 'not-a-valid-date' as unknown as Date,
      })

      expectFailureWithMessage(result, 'must be a valid date')
    })

    it('should fail if type is not a valid transaction type', () => {
      const transaction = expectSuccess(Transaction.load(validLoadData))
      const result = transaction.updateData({ type: 'not-a-valid-type' })

      expectFailureWithMessage(result, 'must be "expense" or "income"')
    })

    it('should fail if description is too short', () => {
      const transaction = expectSuccess(Transaction.load(validLoadData))
      const result = transaction.updateData({ description: 'AB' })

      expectFailureWithMessage(
        result,
        'The field "description" must be at least 3 characters',
      )
    })

    it('should fail if categoryId is not a valid UUID', () => {
      const transaction = expectSuccess(Transaction.load(validLoadData))
      const result = transaction.updateData({ categoryId: 'not-a-valid-uuid' })

      expectFailureWithMessage(result, 'must be a valid UUID')
    })

    it('should fail if amount is not a valid currency value', () => {
      const transaction = expectSuccess(Transaction.load(validLoadData))
      const result = transaction.updateData({
        amount: 'not-a-valid-currency' as unknown as number,
      })

      expectFailureWithMessage(result, 'must be a valid currency value')
    })
  })
})
