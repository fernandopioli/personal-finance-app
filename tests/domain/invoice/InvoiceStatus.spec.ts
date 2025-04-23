import { InvoiceStatus } from '@domain/invoice'
import { expectSuccess, expectFailureWithMessage } from '@tests/utils'
describe('InvoiceStatus Value Object', () => {
  it('should create valid InvoiceStatus instances', () => {
    const open = expectSuccess(InvoiceStatus.create('open'))
    const closed = expectSuccess(InvoiceStatus.create('closed'))
    const paid = expectSuccess(InvoiceStatus.create('paid'))

    expect(open.value).toBe('open')
    expect(closed.value).toBe('closed')
    expect(paid.value).toBe('paid')
  })

  it('should fail with invalid status', () => {
    const result = InvoiceStatus.create('invalid-status')
    expectFailureWithMessage(
      result,
      'The field "status" must be "open", "closed" or "paid". Current: invalid-status',
    )
  })
  it('should fail with invalid status for validate method', () => {
    const result = InvoiceStatus.validate('invalid-status')
    expectFailureWithMessage(
      result,
      'The field "status" must be "open", "closed" or "paid". Current: invalid-status',
    )
  })

  it('should compare statuses correctly', () => {
    const open1 = expectSuccess(InvoiceStatus.create('open'))
    const open2 = expectSuccess(InvoiceStatus.create('open'))
    const closed = expectSuccess(InvoiceStatus.create('closed'))
    const paid = expectSuccess(InvoiceStatus.create('paid'))

    expect(open1.equals(open2)).toBe(true)
    expect(open1.equals(closed)).toBe(false)
    expect(open1.equals(paid)).toBe(false)
  })

  it('should check if status is open', () => {
    const open = expectSuccess(InvoiceStatus.create('open'))
    expect(open.isOpen()).toBe(true)
  })
  it('should check if status is closed', () => {
    const closed = expectSuccess(InvoiceStatus.create('closed'))
    expect(closed.isClosed()).toBe(true)
  })
  it('should check if status is paid', () => {
    const paid = expectSuccess(InvoiceStatus.create('paid'))
    expect(paid.isPaid()).toBe(true)
  })
})
