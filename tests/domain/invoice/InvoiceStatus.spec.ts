import { InvoiceStatus } from '@domain/invoice'
import { InvalidInvoiceStatusError } from '@domain/invoice/errors'
import { domainAssert } from '@tests/framework'

describe('InvoiceStatus Value Object', () => {
  it('should create valid InvoiceStatus instances', () => {
    const openResult = InvoiceStatus.create('open')
    const open = domainAssert.expectResultSuccess(openResult)
    domainAssert.expectValidValueObject(open, 'open')

    const closedResult = InvoiceStatus.create('closed')
    const closed = domainAssert.expectResultSuccess(closedResult)
    domainAssert.expectValidValueObject(closed, 'closed')

    const paidResult = InvoiceStatus.create('paid')
    const paid = domainAssert.expectResultSuccess(paidResult)
    domainAssert.expectValidValueObject(paid, 'paid')
  })

  it('should fail with invalid status', () => {
    const result = InvoiceStatus.create('invalid-status')
    domainAssert.expectResultFailure(result, [
      new InvalidInvoiceStatusError('status', 'invalid-status'),
    ])
  })

  it('should fail with invalid status for validate method', () => {
    const result = InvoiceStatus.validate('invalid-status')
    domainAssert.expectResultFailure(result, [
      new InvalidInvoiceStatusError('status', 'invalid-status'),
    ])
  })

  it('should compare statuses correctly', () => {
    const open1 = InvoiceStatus.create('open').value
    const open2 = InvoiceStatus.create('open').value
    const closed = InvoiceStatus.create('closed').value
    const paid = InvoiceStatus.create('paid').value

    domainAssert.assertTrue(open1.equals(open2))
    domainAssert.assertFalse(open1.equals(closed))
    domainAssert.assertFalse(open1.equals(paid))
  })

  it('should check if status is open', () => {
    const open = domainAssert.expectResultSuccess(InvoiceStatus.create('open'))
    domainAssert.assertTrue(open.isOpen())
    domainAssert.assertFalse(open.isClosed())
    domainAssert.assertFalse(open.isPaid())
  })

  it('should check if status is closed', () => {
    const closed = domainAssert.expectResultSuccess(
      InvoiceStatus.create('closed'),
    )
    domainAssert.assertTrue(closed.isClosed())
    domainAssert.assertFalse(closed.isOpen())
    domainAssert.assertFalse(closed.isPaid())
  })

  it('should check if status is paid', () => {
    const paid = domainAssert.expectResultSuccess(InvoiceStatus.create('paid'))
    domainAssert.assertTrue(paid.isPaid())
    domainAssert.assertFalse(paid.isOpen())
    domainAssert.assertFalse(paid.isClosed())
  })
})
