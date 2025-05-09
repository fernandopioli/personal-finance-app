import { Entity, Result, UniqueId } from '@domain/core'
import { Validator } from '@domain/validation'
import {
  InvoiceCreateInput,
  InvoiceLoadInput,
  InvoiceUpdateInput,
  InvoiceProps,
  InvoiceStatus,
} from '@domain/invoice'
import { ValidationError } from '@domain/errors'

export class Invoice extends Entity {
  private readonly _props: InvoiceProps

  private constructor(
    props: InvoiceProps,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date | null,
  ) {
    super(id, createdAt, updatedAt, deletedAt)
    this._props = props
  }

  get cardId(): UniqueId {
    return this._props.cardId
  }

  get dueDate(): Date {
    return this._props.dueDate
  }

  get startDate(): Date {
    return this._props.startDate
  }

  get endDate(): Date {
    return this._props.endDate
  }

  get totalAmount(): number {
    return this._props.totalAmount
  }

  get status(): InvoiceStatus {
    return this._props.status
  }

  public static create(input: InvoiceCreateInput): Result<Invoice> {
    const validationResult = this.validateCreate(input)

    if (validationResult.isFailure) {
      return Result.fail<Invoice>(validationResult.errors)
    }

    let statusResult = InvoiceStatus.create(input.status ?? 'open')

    const props: InvoiceProps = {
      cardId: UniqueId.create(input.cardId),
      dueDate: input.dueDate,
      startDate: input.startDate,
      endDate: input.endDate,
      totalAmount: input.totalAmount ?? 0,
      status: statusResult.value,
    }

    const invoice = new Invoice(props)
    return Result.ok(invoice)
  }

  public static load(input: InvoiceLoadInput): Result<Invoice> {
    const statusResult = InvoiceStatus.create(input.status)

    const props: InvoiceProps = {
      cardId: UniqueId.create(input.cardId),
      dueDate: input.dueDate,
      startDate: input.startDate,
      endDate: input.endDate,
      totalAmount: input.totalAmount,
      status: statusResult.value,
    }

    const invoice = new Invoice(
      props,
      input.id,
      input.createdAt,
      input.updatedAt,
      input.deletedAt,
    )
    return Result.ok(invoice)
  }

  public updateStatus(status: string): Result<void> {
    const statusResult = InvoiceStatus.create(status)
    if (statusResult.isFailure) {
      return Result.fail<void>(statusResult.errors)
    }

    this._props.status = statusResult.value
    this.updateTimestamp()
    return Result.ok<void>(undefined)
  }

  public updateTotalAmount(amount: number): Result<void> {
    const validator = new Validator()
    validator.check('totalAmount', amount).required().isCurrency()

    if (validator.hasErrors()) {
      return Result.fail<void>(validator.getErrors())
    }

    this._props.totalAmount = amount
    this.updateTimestamp()
    return Result.ok<void>(undefined)
  }

  public updateData(input: InvoiceUpdateInput): Result<Invoice> {
    const validationResult = this.validateUpdate(input)

    if (validationResult.isFailure) {
      return Result.fail<Invoice>(validationResult.errors)
    }

    if (input.status) {
      const statusResult = InvoiceStatus.create(input.status)
      this._props.status = statusResult.value
    }

    if (input.totalAmount !== undefined) {
      this._props.totalAmount = input.totalAmount
    }

    if (input.dueDate) {
      this._props.dueDate = input.dueDate
    }

    if (input.startDate) {
      this._props.startDate = input.startDate
    }

    if (input.endDate) {
      this._props.endDate = input.endDate
    }

    this.updateTimestamp()
    return Result.ok<Invoice>(this)
  }

  private static validateCreate(input: InvoiceCreateInput): Result<void> {
    const validator = new Validator()
    validator.check('cardId', input.cardId).required().isValidUuid()
    validator.check('dueDate', input.dueDate).required().isValidDate()
    validator.check('startDate', input.startDate).required().isValidDate()
    validator
      .check('endDate', input.endDate)
      .required()
      .isValidDate()
      .isDateAfter(input.startDate, 'startDate')
    input.totalAmount &&
      validator.check('totalAmount', input.totalAmount).isCurrency()

    if (input.status) {
      const statusResult = InvoiceStatus.validate(input.status)
      if (statusResult.isFailure) {
        validator.addErrors(statusResult.errors as ValidationError[])
      }
    }

    if (validator.hasErrors()) {
      return Result.fail<void>(validator.getErrors())
    }

    return Result.ok<void>(undefined)
  }

  private validateUpdate(input: InvoiceUpdateInput): Result<void> {
    const validator = new Validator()
    input.dueDate && validator.check('dueDate', input.dueDate).isValidDate()
    input.startDate &&
      validator.check('startDate', input.startDate).isValidDate()
    if (input.endDate || input.startDate) {
      validator
        .check('endDate', input.endDate ?? this.endDate)
        .isValidDate()
        .isDateAfter(input.startDate ?? this.startDate, 'startDate')
    }
    input.totalAmount &&
      validator.check('totalAmount', input.totalAmount).isCurrency()

    if (input.status) {
      const statusResult = InvoiceStatus.validate(input.status)
      if (statusResult.isFailure) {
        validator.addErrors(statusResult.errors as ValidationError[])
      }
    }

    if (validator.hasErrors()) {
      return Result.fail<void>(validator.getErrors())
    }

    return Result.ok<void>(undefined)
  }
}
