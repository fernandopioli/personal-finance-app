import { Invoice } from '@domain/invoice'
import {
  InvoiceCreateInput,
  InvoiceLoadInput,
  InvoiceUpdateInput,
} from '@domain/invoice/InvoiceTypes'
import {
  expectSuccess,
  expectFailureWithMessage,
  expectFieldErrors,
} from '@tests/utils'
describe('Invoice Entity', () => {
  const validCreateData: InvoiceCreateInput = {
    cardId: '123e4567-e89b-42d3-a456-556642440000',
    dueDate: new Date('2023-05-15'),
    startDate: new Date('2023-04-15'),
    endDate: new Date('2023-05-14'),
    totalAmount: 1500.0,
    status: 'open',
  }

  const validLoadData: InvoiceLoadInput = {
    id: '123e4567-e89b-42d3-a456-556642440000',
    cardId: '123e4567-e89b-42d3-a456-556642440000',
    dueDate: new Date('2023-05-15'),
    startDate: new Date('2023-04-15'),
    endDate: new Date('2023-05-14'),
    totalAmount: 1500.0,
    status: 'open',
    createdAt: new Date('2023-04-01'),
    updatedAt: new Date('2023-04-01'),
    deletedAt: null,
  }

  const createInvoice = (overrides = {}) =>
    Invoice.create({ ...validCreateData, ...overrides })

  const loadInvoice = (overrides = {}) =>
    Invoice.load({ ...validLoadData, ...overrides })

  describe('create()', () => {
    it('should create a valid invoice', () => {
      const invoice = expectSuccess(createInvoice())

      expect(invoice.cardId.value).toBe(validCreateData.cardId)
      expect(invoice.dueDate).toEqual(validCreateData.dueDate)
      expect(invoice.startDate).toEqual(validCreateData.startDate)
      expect(invoice.endDate).toEqual(validCreateData.endDate)
      expect(invoice.totalAmount).toBe(validCreateData.totalAmount)
      expect(invoice.status.value).toBe(validCreateData.status)
    })

    it('should set default values when not provided', () => {
      const invoice = expectSuccess(
        createInvoice({
          totalAmount: undefined,
          status: undefined,
        }),
      )

      expect(invoice.totalAmount).toBe(0)
      expect(invoice.status.value).toBe('open')
    })

    it('should validate required fields', () => {
      const result = createInvoice({
        cardId: undefined,
        dueDate: undefined,
        startDate: undefined,
        endDate: undefined,
      })

      expect(result.isFailure).toBe(true)
      expectFieldErrors(result, ['cardId', 'dueDate', 'startDate', 'endDate'])
    })

    it('should validate cardId is a valid UUID', () => {
      const result = createInvoice({ cardId: 'invalid-uuid' })

      expectFailureWithMessage(result, 'must be a valid UUID', 1)
    })

    it('should validate that totalAmount is non-negative', () => {
      const result = createInvoice({ totalAmount: -100 })

      expectFailureWithMessage(result, 'must be greater than or equal to 0', 1)
    })

    it('should validate invoice status is valid', () => {
      const result = createInvoice({
        status: 'invalid-status',
      })

      expectFailureWithMessage(result, 'must be "open", "closed" or "paid"', 1)
    })

    it('should validate dueDate, startDate and endDate are valid dates', () => {
      const result = createInvoice({
        dueDate: new Date('invalid-date'),
        startDate: new Date('invalid-date'),
        endDate: new Date('invalid-date'),
      })

      expect(result.isFailure).toBe(true)
      expectFieldErrors(result, ['dueDate', 'startDate', 'endDate'])

      result.errors.forEach((error) => {
        expect(error.message).toContain('must be a valid date')
      })
    })

    it('should validate endDate is after startDate', () => {
      const result = createInvoice({
        startDate: new Date('2023-05-15'),
        endDate: new Date('2023-05-14'),
      })

      expectFailureWithMessage(result, 'must be after startDate', 1)
    })
  })

  describe('load()', () => {
    it('should load a valid invoice', () => {
      const invoice = expectSuccess(loadInvoice())

      expect(invoice.id.value).toBe(validLoadData.id)
      expect(invoice.cardId.value).toBe(validLoadData.cardId)
      expect(invoice.dueDate).toEqual(validLoadData.dueDate)
      expect(invoice.startDate).toEqual(validLoadData.startDate)
      expect(invoice.endDate).toEqual(validLoadData.endDate)
      expect(invoice.totalAmount).toBe(validLoadData.totalAmount)
      expect(invoice.status.value).toBe(validLoadData.status)
      expect(invoice.createdAt).toEqual(validLoadData.createdAt)
      expect(invoice.updatedAt).toEqual(validLoadData.updatedAt)
      expect(invoice.deletedAt).toEqual(validLoadData.deletedAt)
    })
  })

  describe('update methods', () => {
    describe('updateStatus()', () => {
      it('should update invoice status', () => {
        const invoice = expectSuccess(createInvoice())
        const result = invoice.updateStatus('closed')

        expect(result.isSuccess).toBe(true)
        expect(invoice.status.value).toBe('closed')
      })

      it('should validate new status', () => {
        const invoice = expectSuccess(createInvoice())
        const result = invoice.updateStatus('invalid-status')

        expect(result.isFailure).toBe(true)
        expect(result.errors[0].message).toContain(
          'must be "open", "closed" or "paid"',
        )
        expect(invoice.status.value).toBe('open')
      })
    })

    describe('updateTotalAmount()', () => {
      it('should update invoice total amount', () => {
        const invoice = expectSuccess(createInvoice())
        const result = invoice.updateTotalAmount(2000.0)

        expect(result.isSuccess).toBe(true)
        expect(invoice.totalAmount).toBe(2000.0)
      })

      it('should validate new amount is required', () => {
        const invoice = expectSuccess(createInvoice())
        const result = invoice.updateTotalAmount(undefined as any)

        expectFailureWithMessage(result, 'is required')
        expect(invoice.totalAmount).toBe(validCreateData.totalAmount)
      })

      it('should validate new amount is non-negative', () => {
        const invoice = expectSuccess(createInvoice())
        const result = invoice.updateTotalAmount(-100)

        expectFailureWithMessage(result, 'must be greater than or equal to 0')
        expect(invoice.totalAmount).toBe(validCreateData.totalAmount)
      })
    })

    describe('updateData()', () => {
      it('should update multiple invoice fields', () => {
        const invoice = expectSuccess(createInvoice())
        const updateData: InvoiceUpdateInput = {
          dueDate: new Date('2023-05-20'),
          startDate: new Date('2023-04-20'),
          endDate: new Date('2023-05-20'),
          totalAmount: 2000.0,
          status: 'closed',
        }

        const result = invoice.updateData(updateData)

        expect(result.isSuccess).toBe(true)
        expect(invoice.dueDate).toEqual(updateData.dueDate)
        expect(invoice.startDate).toEqual(updateData.startDate)
        expect(invoice.endDate).toEqual(updateData.endDate)
        expect(invoice.totalAmount).toBe(updateData.totalAmount)
        expect(invoice.status.value).toBe(updateData.status)
      })

      it('should validate dueDate, startDate and endDate are valid dates', () => {
        const invoice = expectSuccess(createInvoice())
        const updateData: InvoiceUpdateInput = {
          dueDate: new Date('invalid-date'),
          startDate: new Date('invalid-date'),
          endDate: new Date('invalid-date'),
        }

        const result = invoice.updateData(updateData)

        expect(result.isFailure).toBe(true)
        expectFieldErrors(result, ['dueDate', 'startDate', 'endDate'])

        const dateErrors = result.errors.filter((error) =>
          error.message.includes('must be a valid date'),
        )
        expect(dateErrors.length).toBe(3)
      })

      it('should update date range successfully', () => {
        const invoice = expectSuccess(createInvoice())
        const updateData: InvoiceUpdateInput = {
          startDate: new Date('2023-05-01'),
          endDate: new Date('2023-05-31'),
        }

        const result = invoice.updateData(updateData)

        expect(result.isSuccess).toBe(true)
        expect(invoice.startDate).toEqual(updateData.startDate)
        expect(invoice.endDate).toEqual(updateData.endDate)
      })

      it('should validate status is valid', () => {
        const invoice = expectSuccess(createInvoice())
        const updateData: InvoiceUpdateInput = {
          status: 'invalid-status',
        }

        const result = invoice.updateData(updateData)

        expectFailureWithMessage(
          result,
          'must be "open", "closed" or "paid"',
          1,
        )
        expect(invoice.status.value).toBe(validCreateData.status)
      })

      it('should validate totalAmount is non-negative', () => {
        const invoice = expectSuccess(createInvoice())
        const updateData: InvoiceUpdateInput = {
          totalAmount: -100,
        }

        const result = invoice.updateData(updateData)

        expectFailureWithMessage(
          result,
          'must be greater than or equal to 0',
          1,
        )
        expect(invoice.totalAmount).toBe(validCreateData.totalAmount)
      })

      it('should validate endDate is after startDate when both are updated', () => {
        const invoice = expectSuccess(createInvoice())
        const updateData: InvoiceUpdateInput = {
          startDate: new Date('2023-05-15'),
          endDate: new Date('2023-05-14'),
        }

        const result = invoice.updateData(updateData)

        expectFailureWithMessage(result, 'must be after startDate', 1)
        expect(invoice.startDate).toEqual(validCreateData.startDate)
        expect(invoice.endDate).toEqual(validCreateData.endDate)
      })

      it('should validate endDate is after startDate when only endDate is updated', () => {
        const invoice = expectSuccess(
          createInvoice({
            startDate: new Date('2023-05-10'),
          }),
        )

        const updateData: InvoiceUpdateInput = {
          endDate: new Date('2023-05-09'),
        }

        const result = invoice.updateData(updateData)

        expectFailureWithMessage(result, 'must be after startDate', 1)
        expect(invoice.endDate).toEqual(validCreateData.endDate)
      })

      it('should validate endDate is after startDate when only startDate is updated', () => {
        const invoice = expectSuccess(createInvoice())
        const updateData: InvoiceUpdateInput = {
          startDate: new Date('2023-05-15'),
        }

        const result = invoice.updateData(updateData)

        expectFailureWithMessage(result, 'must be after startDate', 1)
        expect(invoice.startDate).toEqual(validCreateData.startDate)
      })
    })
  })
})
