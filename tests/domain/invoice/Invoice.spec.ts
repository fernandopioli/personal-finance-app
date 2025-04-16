import { UniqueId } from '@domain/core'
import { Invoice } from '@domain/invoice'
import {
  InvoiceStatus,
  InvoiceCreateInput,
  InvoiceLoadInput,
  InvoiceUpdateInput,
} from '@domain/invoice/InvoiceTypes'
import { ValidationError } from '@domain/errors'

describe('Invoice', () => {
  describe('create', () => {
    it('should create a valid invoice', () => {
      const cardId = UniqueId.create().value
      const validInput: InvoiceCreateInput = {
        cardId,
        dueDate: new Date('2023-05-15'),
        startDate: new Date('2023-04-15'),
        endDate: new Date('2023-05-14'),
        totalAmount: 1500.0,
        status: 'open',
      }

      const result = Invoice.create(validInput)

      expect(result.isSuccess).toBe(true)

      const invoice = result.value
      expect(invoice.cardId.value).toBe(validInput.cardId)
      expect(invoice.dueDate).toEqual(validInput.dueDate)
      expect(invoice.startDate).toEqual(validInput.startDate)
      expect(invoice.endDate).toEqual(validInput.endDate)
      expect(invoice.totalAmount).toBe(validInput.totalAmount)
      expect(invoice.status).toBe(validInput.status)
    })

    it('should set default values when not provided', () => {
      const cardId = UniqueId.create().value
      const validInput: InvoiceCreateInput = {
        cardId,
        dueDate: new Date('2023-05-15'),
        startDate: new Date('2023-04-15'),
        endDate: new Date('2023-05-14'),
      }

      const result = Invoice.create(validInput)

      expect(result.isSuccess).toBe(true)

      const invoice = result.value
      expect(invoice.totalAmount).toBe(0)
      expect(invoice.status).toBe('open')
    })

    it('should validate required fields', () => {
      const invalidInput: Partial<InvoiceCreateInput> = {}

      const result = Invoice.create(invalidInput as InvoiceCreateInput)

      expect(result.isFailure).toBe(true)
      expect(result.errors).toHaveLength(4)

      const errorFields = result.errors.map((e) => (e as ValidationError).field)
      expect(errorFields).toContain('cardId')
      expect(errorFields).toContain('dueDate')
      expect(errorFields).toContain('startDate')
      expect(errorFields).toContain('endDate')
    })

    it('should validate cardId is a valid UUID', () => {
      const invalidInput: InvoiceCreateInput = {
        cardId: 'invalid-uuid',
        dueDate: new Date('2023-05-15'),
        startDate: new Date('2023-04-15'),
        endDate: new Date('2023-05-14'),
        totalAmount: 1500.0,
        status: 'open',
      }

      const result = Invoice.create(invalidInput)

      expect(result.isFailure).toBe(true)

      const errors = result.errors
      const hasUuidError = errors.some(
        (error) =>
          error.message.includes('must be a valid UUID') &&
          (error as ValidationError).field === 'cardId',
      )
      expect(hasUuidError).toBe(true)
    })

    it('should validate that totalAmount is non-negative', () => {
      const cardId = UniqueId.create().value
      const invalidInput: InvoiceCreateInput = {
        cardId: cardId.toString(),
        dueDate: new Date('2023-05-15'),
        startDate: new Date('2023-04-15'),
        endDate: new Date('2023-05-14'),
        totalAmount: -100,
        status: 'open',
      }

      const result = Invoice.create(invalidInput)

      expect(result.isFailure).toBe(true)

      const errors = result.errors
      const hasNegativeError = errors.some(
        (error) =>
          error.message.includes('must be greater than or equal to 0') &&
          (error as ValidationError).field === 'totalAmount',
      )
      expect(hasNegativeError).toBe(true)
    })

    it('should validate invoice status is valid', () => {
      const cardId = UniqueId.create().value
      const invalidInput: InvoiceCreateInput = {
        cardId: cardId.toString(),
        dueDate: new Date('2023-05-15'),
        startDate: new Date('2023-04-15'),
        endDate: new Date('2023-05-14'),
        totalAmount: 1500.0,
        status: 'invalid-status' as InvoiceStatus,
      }

      const result = Invoice.create(invalidInput)

      expect(result.isFailure).toBe(true)

      const errors = result.errors
      const hasStatusError = errors.some(
        (error) =>
          error.message.includes('must be "open", "closed" or "paid"') &&
          (error as ValidationError).field === 'status',
      )
      expect(hasStatusError).toBe(true)
    })

    it('should validate dueDate, startDate and endDate are valid dates', () => {
      const cardId = UniqueId.create().value
      const invalidInput: InvoiceCreateInput = {
        cardId,
        dueDate: new Date('invalid-date'),
        startDate: new Date('invalid-date'),
        endDate: new Date('invalid-date'),
        totalAmount: 1500.0,
        status: 'open',
      }

      const result = Invoice.create(invalidInput)

      expect(result.isFailure).toBe(true)

      const errors = result.errors
      const hasDateError = errors.filter((error) =>
        error.message.includes('must be a valid date'),
      )
      expect(hasDateError).toHaveLength(3)
    })

    it('should validate endDate is after startDate', () => {
      const cardId = UniqueId.create().value
      const invalidInput: InvoiceCreateInput = {
        cardId: cardId.toString(),
        dueDate: new Date('2023-05-15'),
        startDate: new Date('2023-05-15'),
        endDate: new Date('2023-05-14'),
        totalAmount: 1500.0,
        status: 'open',
      }

      const result = Invoice.create(invalidInput)

      expect(result.isFailure).toBe(true)

      const errors = result.errors
      const hasDateError = errors.some(
        (error) =>
          error.message.includes('must be after startDate') &&
          (error as ValidationError).field === 'endDate',
      )
      expect(hasDateError).toBe(true)
    })
  })

  describe('load', () => {
    it('should load a valid invoice', () => {
      const cardId = UniqueId.create().value
      const id = UniqueId.create().value
      const validInput: InvoiceLoadInput = {
        id: id.toString(),
        cardId,
        dueDate: new Date('2023-05-15'),
        startDate: new Date('2023-04-15'),
        endDate: new Date('2023-05-14'),
        totalAmount: 1500.0,
        status: 'open',
        createdAt: new Date('2023-04-01'),
        updatedAt: new Date('2023-04-01'),
        deletedAt: null,
      }

      const result = Invoice.load(validInput)

      expect(result.isSuccess).toBe(true)

      const invoice = result.value
      expect(invoice.id.value).toBe(validInput.id)
      expect(invoice.cardId.value).toBe(validInput.cardId)
      expect(invoice.dueDate).toEqual(validInput.dueDate)
      expect(invoice.startDate).toEqual(validInput.startDate)
      expect(invoice.endDate).toEqual(validInput.endDate)
      expect(invoice.totalAmount).toBe(validInput.totalAmount)
      expect(invoice.status).toBe(validInput.status)
      expect(invoice.createdAt).toEqual(validInput.createdAt)
      expect(invoice.updatedAt).toEqual(validInput.updatedAt)
      expect(invoice.deletedAt).toEqual(validInput.deletedAt)
    })
  })

  describe('updateStatus', () => {
    it('should update invoice status', () => {
      const cardId = UniqueId.create().value
      const validInput: InvoiceCreateInput = {
        cardId,
        dueDate: new Date('2023-05-15'),
        startDate: new Date('2023-04-15'),
        endDate: new Date('2023-05-14'),
        totalAmount: 1500.0,
        status: 'open',
      }
      const invoice = Invoice.create(validInput).value

      const result = invoice.updateStatus('closed')

      expect(result.isSuccess).toBe(true)
      expect(invoice.status).toBe('closed')
    })

    it('should validate new status', () => {
      const cardId = UniqueId.create().value
      const validInput: InvoiceCreateInput = {
        cardId,
        dueDate: new Date('2023-05-15'),
        startDate: new Date('2023-04-15'),
        endDate: new Date('2023-05-14'),
        totalAmount: 1500.0,
        status: 'open',
      }
      const invoice = Invoice.create(validInput).value

      const result = invoice.updateStatus('invalid-status' as InvoiceStatus)

      expect(result.isFailure).toBe(true)
      expect(result.errors[0].message).toContain(
        'must be "open", "closed" or "paid"',
      )
      expect(invoice.status).toBe('open')
    })
  })

  describe('updateTotalAmount', () => {
    it('should update invoice total amount', () => {
      const cardId = UniqueId.create().value
      const validInput: InvoiceCreateInput = {
        cardId,
        dueDate: new Date('2023-05-15'),
        startDate: new Date('2023-04-15'),
        endDate: new Date('2023-05-14'),
        totalAmount: 1500.0,
        status: 'open',
      }
      const invoice = Invoice.create(validInput).value

      const result = invoice.updateTotalAmount(2000.0)

      expect(result.isSuccess).toBe(true)
      expect(invoice.totalAmount).toBe(2000.0)
    })

    it('should validate new amount is empty', () => {
      const cardId = UniqueId.create().value
      const validInput: InvoiceCreateInput = {
        cardId,
        dueDate: new Date('2023-05-15'),
        startDate: new Date('2023-04-15'),
        endDate: new Date('2023-05-14'),
        totalAmount: 1500.0,
        status: 'open',
      }
      const invoice = Invoice.create(validInput).value

      const result = invoice.updateTotalAmount(undefined as any)

      expect(result.isFailure).toBe(true)
      expect(result.errors[0].message).toContain('is required')
      expect(invoice.totalAmount).toBe(1500.0)
    })

    it('should validate totalAmount is non-negative', () => {
      const cardId = UniqueId.create().value
      const validInput: InvoiceCreateInput = {
        cardId,
        dueDate: new Date('2023-05-15'),
        startDate: new Date('2023-04-15'),
        endDate: new Date('2023-05-14'),
        totalAmount: 1500.0,
        status: 'open',
      }
      const invoice = Invoice.create(validInput).value

      const updateInput: InvoiceUpdateInput = {
        totalAmount: -100,
      }

      const result = invoice.updateData(updateInput)

      expect(result.isFailure).toBe(true)
      expect(result.errors[0].message).toContain(
        'must be greater than or equal to 0',
      )
      expect(invoice.totalAmount).toBe(validInput.totalAmount)
    })
  })

  describe('updateData', () => {
    it('should update multiple invoice fields', () => {
      const cardId = UniqueId.create().value
      const validInput: InvoiceCreateInput = {
        cardId,
        dueDate: new Date('2023-05-15'),
        startDate: new Date('2023-04-15'),
        endDate: new Date('2023-05-14'),
        totalAmount: 1500.0,
        status: 'open',
      }
      const invoice = Invoice.create(validInput).value

      const updateInput: InvoiceUpdateInput = {
        dueDate: new Date('2023-05-20'),
        startDate: new Date('2023-04-20'),
        endDate: new Date('2023-05-20'),
        totalAmount: 2000.0,
        status: 'closed',
      }

      const result = invoice.updateData(updateInput)

      expect(result.isSuccess).toBe(true)
      expect(invoice.dueDate).toEqual(updateInput.dueDate)
      expect(invoice.totalAmount).toBe(updateInput.totalAmount)
      expect(invoice.status).toBe(updateInput.status)
      expect(invoice.startDate).toEqual(updateInput.startDate)
      expect(invoice.endDate).toEqual(updateInput.endDate)
    })

    it('should validate dueDate, startDate and endDate are valid dates', () => {
      const cardId = UniqueId.create().value
      const invalidInput: InvoiceCreateInput = {
        cardId,
        dueDate: new Date('2023-05-15'),
        startDate: new Date('2023-04-15'),
        endDate: new Date('2023-05-14'),
        totalAmount: 1500.0,
        status: 'open',
      }

      const invoice = Invoice.create(invalidInput).value

      const updateInput: InvoiceUpdateInput = {
        dueDate: new Date('invalid-date'),
        startDate: new Date('invalid-date'),
        endDate: new Date('invalid-date'),
      }

      const result = invoice.updateData(updateInput)

      expect(result.isFailure).toBe(true)

      const errors = result.errors
      const hasDateError = errors.filter((error) =>
        error.message.includes('must be a valid date'),
      )
      expect(hasDateError).toHaveLength(3)
    })

    it('should update date range successfully', () => {
      const cardId = UniqueId.create().value
      const validInput: InvoiceCreateInput = {
        cardId,
        dueDate: new Date('2023-05-15'),
        startDate: new Date('2023-04-15'),
        endDate: new Date('2023-05-14'),
        totalAmount: 1500.0,
        status: 'open',
      }
      const invoice = Invoice.create(validInput).value

      const updateInput: InvoiceUpdateInput = {
        startDate: new Date('2023-05-01'),
        endDate: new Date('2023-05-31'),
      }

      const result = invoice.updateData(updateInput)

      expect(result.isSuccess).toBe(true)
      expect(invoice.startDate).toEqual(updateInput.startDate)
      expect(invoice.endDate).toEqual(updateInput.endDate)
    })

    it('should validate status is valid', () => {
      const cardId = UniqueId.create().value
      const validInput: InvoiceCreateInput = {
        cardId,
        dueDate: new Date('2023-05-15'),
        startDate: new Date('2023-04-15'),
        endDate: new Date('2023-05-14'),
        totalAmount: 1500.0,
        status: 'open',
      }
      const invoice = Invoice.create(validInput).value

      const updateInput: InvoiceUpdateInput = {
        status: 'invalid-status' as InvoiceStatus,
      }

      const result = invoice.updateData(updateInput)

      expect(result.isFailure).toBe(true)
      expect(result.errors[0].message).toContain(
        'must be "open", "closed" or "paid"',
      )
      expect(invoice.status).toBe(validInput.status)
    })

    it('should validate totalAmount is non-negative', () => {
      const cardId = UniqueId.create().value
      const validInput: InvoiceCreateInput = {
        cardId,
        dueDate: new Date('2023-05-15'),
        startDate: new Date('2023-04-15'),
        endDate: new Date('2023-05-14'),
        totalAmount: 1500.0,
        status: 'open',
      }
      const invoice = Invoice.create(validInput).value

      const updateInput: InvoiceUpdateInput = {
        totalAmount: -100,
      }

      const result = invoice.updateData(updateInput)

      expect(result.isFailure).toBe(true)
      expect(result.errors[0].message).toContain(
        'must be greater than or equal to 0',
      )
      expect(invoice.totalAmount).toBe(validInput.totalAmount)
    })

    it('should validate endDate is after startDate when both are updated', () => {
      const cardId = UniqueId.create().value
      const validInput: InvoiceCreateInput = {
        cardId,
        dueDate: new Date('2023-05-15'),
        startDate: new Date('2023-04-15'),
        endDate: new Date('2023-05-14'),
        totalAmount: 1500.0,
        status: 'open',
      }
      const invoice = Invoice.create(validInput).value

      const updateInput: InvoiceUpdateInput = {
        startDate: new Date('2023-05-15'),
        endDate: new Date('2023-05-14'),
      }

      const result = invoice.updateData(updateInput)

      expect(result.isFailure).toBe(true)
      expect(result.errors[0].message).toContain('must be after startDate')
      expect(invoice.startDate).toEqual(validInput.startDate)
      expect(invoice.endDate).toEqual(validInput.endDate)
    })

    it('should validate endDate is after startDate when only endDate is updated', () => {
      const cardId = UniqueId.create().value
      const validInput: InvoiceCreateInput = {
        cardId,
        dueDate: new Date('2023-05-15'),
        startDate: new Date('2023-05-10'),
        endDate: new Date('2023-05-14'),
        totalAmount: 1500.0,
        status: 'open',
      }
      const invoice = Invoice.create(validInput).value

      const updateInput: InvoiceUpdateInput = {
        endDate: new Date('2023-05-09'),
      }

      const result = invoice.updateData(updateInput)

      expect(result.isFailure).toBe(true)
      expect(result.errors[0].message).toContain('must be after startDate')
      expect(invoice.endDate).toEqual(validInput.endDate)
    })

    it('should validate endDate is after startDate when only startDate is updated', () => {
      const cardId = UniqueId.create().value
      const validInput: InvoiceCreateInput = {
        cardId,
        dueDate: new Date('2023-05-15'),
        startDate: new Date('2023-04-15'),
        endDate: new Date('2023-05-14'),
        totalAmount: 1500.0,
        status: 'open',
      }
      const invoice = Invoice.create(validInput).value

      const updateInput: InvoiceUpdateInput = {
        startDate: new Date('2023-05-15'),
      }

      const result = invoice.updateData(updateInput)

      expect(result.isFailure).toBe(true)
      expect(result.errors[0].message).toContain('must be after startDate')
      expect(invoice.startDate).toEqual(validInput.startDate)
    })
  })
})
