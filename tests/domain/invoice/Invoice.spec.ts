import {
  Invoice,
  InvoiceCreateInput,
  InvoiceLoadInput,
  InvoiceUpdateInput,
} from '@domain/invoice'
import { InvalidInvoiceStatusError } from '@domain/invoice/errors'
import {
  RequiredFieldError,
  InvalidUuidError,
  InvalidCurrencyError,
  InvalidDateError,
  InvalidDateRangeError,
} from '@domain/errors'
import { domainAssert } from '@tests/framework'

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
      const result = createInvoice()
      const invoice = domainAssert.expectResultSuccess(result)

      domainAssert.expectValidEntity(invoice)
      domainAssert.expectUniqueIdEquals(invoice.cardId, validCreateData.cardId)
      domainAssert.assertEqual(invoice.dueDate, validCreateData.dueDate)
      domainAssert.assertEqual(invoice.startDate, validCreateData.startDate)
      domainAssert.assertEqual(invoice.endDate, validCreateData.endDate)
      domainAssert.assertEqual(invoice.totalAmount, validCreateData.totalAmount)
      domainAssert.expectValidValueObject(
        invoice.status,
        validCreateData.status,
      )
    })

    it('should set default values when not provided', () => {
      const result = createInvoice({
        totalAmount: undefined,
        status: undefined,
      })
      const invoice = domainAssert.expectResultSuccess(result)

      domainAssert.assertEqual(invoice.totalAmount, 0)
      domainAssert.expectValidValueObject(invoice.status, 'open')
    })

    it('should validate required fields', () => {
      const result = createInvoice({
        cardId: undefined,
        dueDate: undefined,
        startDate: undefined,
        endDate: undefined,
      })

      domainAssert.expectResultFailure(result, [
        new RequiredFieldError('cardId'),
        new RequiredFieldError('dueDate'),
        new RequiredFieldError('startDate'),
        new RequiredFieldError('endDate'),
      ])
    })

    it('should validate cardId is a valid UUID', () => {
      const result = createInvoice({ cardId: 'invalid-uuid' })

      domainAssert.expectResultFailure(result, [
        new InvalidUuidError('cardId', 'invalid-uuid'),
      ])
    })

    it('should validate that totalAmount is non-negative', () => {
      const result = createInvoice({ totalAmount: -100 })

      domainAssert.expectResultFailure(result, [
        new InvalidCurrencyError('totalAmount', -100),
      ])
    })

    it('should validate invoice status is valid', () => {
      const result = createInvoice({
        status: 'invalid-status',
      })

      domainAssert.expectResultFailure(result, [
        new InvalidInvoiceStatusError('status', 'invalid-status'),
      ])
    })

    it('should validate dueDate, startDate and endDate are valid dates', () => {
      const invalidDate = new Date('invalid-date')
      const result = createInvoice({
        dueDate: invalidDate,
        startDate: invalidDate,
        endDate: invalidDate,
      })

      domainAssert.expectResultFailure(result)
      domainAssert.expectFieldErrors(result, [
        'dueDate',
        'startDate',
        'endDate',
      ])

      const errors = domainAssert.expectResultFailure(result)
      errors.forEach((error) => {
        domainAssert.assertTrue(
          error instanceof InvalidDateError,
          'Error should be an instance of InvalidDateError',
        )
      })
    })

    it('should validate endDate is after startDate', () => {
      const result = createInvoice({
        startDate: new Date('2023-05-15'),
        endDate: new Date('2023-05-14'),
      })

      domainAssert.expectResultFailure(result, [
        new InvalidDateRangeError('endDate', 'startDate'),
      ])
    })
  })

  describe('load()', () => {
    it('should load a valid invoice', () => {
      const result = loadInvoice()
      const invoice = domainAssert.expectResultSuccess(result)

      domainAssert.expectValidEntity(invoice, validLoadData.id)
      domainAssert.expectUniqueIdEquals(invoice.cardId, validLoadData.cardId)
      domainAssert.assertEqual(invoice.dueDate, validLoadData.dueDate)
      domainAssert.assertEqual(invoice.startDate, validLoadData.startDate)
      domainAssert.assertEqual(invoice.endDate, validLoadData.endDate)
      domainAssert.assertEqual(invoice.totalAmount, validLoadData.totalAmount)
      domainAssert.expectValidValueObject(invoice.status, validLoadData.status)
    })
  })

  describe('update methods', () => {
    describe('updateStatus()', () => {
      it('should update invoice status', () => {
        const invoiceResult = createInvoice()
        const invoice = domainAssert.expectResultSuccess(invoiceResult)

        const result = invoice.updateStatus('closed')
        domainAssert.expectResultSuccess(result)
        domainAssert.expectValidValueObject(invoice.status, 'closed')
      })

      it('should validate new status', () => {
        const invoiceResult = createInvoice()
        const invoice = domainAssert.expectResultSuccess(invoiceResult)

        const result = invoice.updateStatus('invalid-status')
        domainAssert.expectResultFailure(result, [
          new InvalidInvoiceStatusError('status', 'invalid-status'),
        ])
        domainAssert.expectValidValueObject(invoice.status, 'open')
      })
    })

    describe('updateTotalAmount()', () => {
      it('should update invoice total amount', () => {
        const invoiceResult = createInvoice()
        const invoice = domainAssert.expectResultSuccess(invoiceResult)

        const result = invoice.updateTotalAmount(2000.0)
        domainAssert.expectResultSuccess(result)
        domainAssert.assertEqual(invoice.totalAmount, 2000.0)
      })

      it('should validate new amount is required', () => {
        const invoiceResult = createInvoice()
        const invoice = domainAssert.expectResultSuccess(invoiceResult)

        const result = invoice.updateTotalAmount(undefined as any)
        domainAssert.expectResultFailure(result, [
          new RequiredFieldError('totalAmount'),
        ])
        domainAssert.assertEqual(
          invoice.totalAmount,
          validCreateData.totalAmount,
        )
      })

      it('should validate new amount is a valid currency', () => {
        const invoiceResult = createInvoice()
        const invoice = domainAssert.expectResultSuccess(invoiceResult)

        const result = invoice.updateTotalAmount(-100)
        domainAssert.expectResultFailure(result, [
          new InvalidCurrencyError('totalAmount', -100),
        ])
        domainAssert.assertEqual(
          invoice.totalAmount,
          validCreateData.totalAmount,
        )
      })
    })

    describe('updateData()', () => {
      it('should update multiple invoice fields', () => {
        const invoiceResult = createInvoice()
        const invoice = domainAssert.expectResultSuccess(invoiceResult)

        const updateData: InvoiceUpdateInput = {
          dueDate: new Date('2023-05-20'),
          startDate: new Date('2023-04-20'),
          endDate: new Date('2023-05-20'),
          totalAmount: 2000.0,
          status: 'closed',
        }

        const result = invoice.updateData(updateData)
        domainAssert.expectResultSuccess(result)

        domainAssert.assertEqual(invoice.dueDate, updateData.dueDate!)
        domainAssert.assertEqual(invoice.startDate, updateData.startDate!)
        domainAssert.assertEqual(invoice.endDate, updateData.endDate!)
        domainAssert.assertEqual(invoice.totalAmount, updateData.totalAmount!)
        domainAssert.expectValidValueObject(invoice.status, updateData.status!)
      })

      it('should update date range successfully', () => {
        const invoiceResult = createInvoice()
        const invoice = domainAssert.expectResultSuccess(invoiceResult)

        const updateData: InvoiceUpdateInput = {
          startDate: new Date('2023-05-01'),
          endDate: new Date('2023-05-31'),
        }

        const result = invoice.updateData(updateData)
        domainAssert.expectResultSuccess(result)

        domainAssert.assertEqual(invoice.startDate, updateData.startDate!)
        domainAssert.assertEqual(invoice.endDate, updateData.endDate!)
      })

      it('should validate status is valid', () => {
        const invoiceResult = createInvoice()
        const invoice = domainAssert.expectResultSuccess(invoiceResult)

        const updateData: InvoiceUpdateInput = {
          status: 'invalid-status',
        }

        const result = invoice.updateData(updateData)
        domainAssert.expectResultFailure(result, [
          new InvalidInvoiceStatusError('status', 'invalid-status'),
        ])
        domainAssert.expectValidValueObject(
          invoice.status,
          validCreateData.status,
        )
      })

      it('should validate totalAmount is a valid currency', () => {
        const invoiceResult = createInvoice()
        const invoice = domainAssert.expectResultSuccess(invoiceResult)

        const updateData: InvoiceUpdateInput = {
          totalAmount: -100,
        }

        const result = invoice.updateData(updateData)
        domainAssert.expectResultFailure(result, [
          new InvalidCurrencyError('totalAmount', -100),
        ])
        domainAssert.assertEqual(
          invoice.totalAmount,
          validCreateData.totalAmount,
        )
      })

      it('should validate dueDate, startDate and endDate are valid dates', () => {
        const invoiceResult = createInvoice()
        const invoice = domainAssert.expectResultSuccess(invoiceResult)

        const invalidDate = new Date('invalid-date')
        const updateData: InvoiceUpdateInput = {
          dueDate: invalidDate,
          startDate: invalidDate,
          endDate: invalidDate,
        }

        const result = invoice.updateData(updateData)
        domainAssert.expectResultFailure(result)
        domainAssert.expectFieldErrors(result, [
          'dueDate',
          'startDate',
          'endDate',
        ])

        const errors = domainAssert.expectResultFailure(result)
        errors.forEach((error) => {
          domainAssert.assertTrue(
            error instanceof InvalidDateError,
            'Error should be an instance of InvalidDateError',
          )
        })
      })

      it('should validate endDate is after startDate when both are updated', () => {
        const invoiceResult = createInvoice()
        const invoice = domainAssert.expectResultSuccess(invoiceResult)

        const updateData: InvoiceUpdateInput = {
          startDate: new Date('2023-05-15'),
          endDate: new Date('2023-05-14'),
        }

        const result = invoice.updateData(updateData)
        domainAssert.expectResultFailure(result, [
          new InvalidDateRangeError('endDate', 'startDate'),
        ])
        domainAssert.assertEqual(invoice.startDate, validCreateData.startDate)
        domainAssert.assertEqual(invoice.endDate, validCreateData.endDate)
      })

      it('should validate endDate is after startDate when only endDate is updated', () => {
        const invoiceResult = createInvoice({
          startDate: new Date('2023-05-10'),
        })
        const invoice = domainAssert.expectResultSuccess(invoiceResult)

        const updateData: InvoiceUpdateInput = {
          endDate: new Date('2023-05-09'),
        }

        const result = invoice.updateData(updateData)
        domainAssert.expectResultFailure(result, [
          new InvalidDateRangeError('endDate', 'startDate'),
        ])
        domainAssert.assertEqual(invoice.endDate, validCreateData.endDate)
      })

      it('should validate endDate is after startDate when only startDate is updated', () => {
        const invoiceResult = createInvoice()
        const invoice = domainAssert.expectResultSuccess(invoiceResult)

        const updateData: InvoiceUpdateInput = {
          startDate: new Date('2023-05-15'),
        }

        const result = invoice.updateData(updateData)
        domainAssert.expectResultFailure(result, [
          new InvalidDateRangeError('endDate', 'startDate'),
        ])
        domainAssert.assertEqual(invoice.startDate, validCreateData.startDate)
      })
    })
  })
})
