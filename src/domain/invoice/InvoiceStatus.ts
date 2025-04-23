import { Result, ValueObject } from '@domain/core'
import { InvalidInvoiceStatusError } from '@domain/invoice/errors'

export class InvoiceStatus extends ValueObject<string> {
  private static readonly OPEN = 'open'
  private static readonly CLOSED = 'closed'
  private static readonly PAID = 'paid'

  private constructor(value: string) {
    super(value)
  }

  public static create(value: string): Result<InvoiceStatus> {
    const validationResult = this.validate(value)
    if (validationResult.isFailure) {
      return Result.fail(validationResult.errors)
    }
    return Result.ok(new InvoiceStatus(value))
  }

  public static validate(value: string): Result<void> {
    if (
      value === InvoiceStatus.OPEN ||
      value === InvoiceStatus.CLOSED ||
      value === InvoiceStatus.PAID
    ) {
      return Result.ok(undefined)
    }
    return Result.fail([new InvalidInvoiceStatusError('status', value)])
  }

  public isOpen(): boolean {
    return this.value === InvoiceStatus.OPEN
  }

  public isClosed(): boolean {
    return this.value === InvoiceStatus.CLOSED
  }

  public isPaid(): boolean {
    return this.value === InvoiceStatus.PAID
  }
}
