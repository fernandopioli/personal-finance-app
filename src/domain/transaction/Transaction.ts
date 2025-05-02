import { Entity, Result, UniqueId } from '@domain/core'
import { Validator } from '@domain/validation'
import {
  TransactionCreateInput,
  TransactionLoadInput,
  TransactionUpdateInput,
  TransactionProps,
  TransactionType,
} from '@domain/transaction'
import {
  InvalidTransactionSourceError,
  InvalidInstallmentError,
} from '@domain/transaction/errors'
import { ValidationError } from '@domain/errors'

export class Transaction extends Entity {
  private readonly _props: TransactionProps

  private constructor(
    props: TransactionProps,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date | null,
  ) {
    super(id, createdAt, updatedAt, deletedAt)
    this._props = props
  }

  get type(): TransactionType {
    return this._props.type
  }

  get amount(): number {
    return this._props.amount
  }

  get date(): Date {
    return this._props.date
  }

  get description(): string {
    return this._props.description
  }

  get categoryId(): UniqueId {
    return this._props.categoryId
  }

  get accountId(): UniqueId | undefined {
    return this._props.accountId
  }

  get invoiceId(): UniqueId | undefined {
    return this._props.invoiceId
  }

  get currentInstallment(): number | undefined {
    return this._props.currentInstallment
  }

  get totalInstallments(): number | undefined {
    return this._props.totalInstallments
  }

  get installmentGroupId(): UniqueId | undefined {
    return this._props.installmentGroupId
  }

  public isExpense(): boolean {
    return this._props.type.value === 'expense'
  }

  public isIncome(): boolean {
    return this._props.type.value === 'income'
  }

  public isInstallment(): boolean {
    return !!this._props.totalInstallments && this._props.totalInstallments > 1
  }

  public isFromAccount(): boolean {
    return !!this._props.accountId
  }

  public isFromInvoice(): boolean {
    return !!this._props.invoiceId
  }

  public static create(input: TransactionCreateInput): Result<Transaction> {
    const validationResult = this.validateCreate(input)
    if (validationResult.isFailure) {
      return Result.fail<Transaction>(validationResult.errors)
    }

    const type = TransactionType.create(input.type).value

    const props: TransactionProps = {
      date: input.date,
      type,
      description: input.description,
      categoryId: UniqueId.create(input.categoryId),
      amount: input.amount,
      accountId: input.accountId ? UniqueId.create(input.accountId) : undefined,
      invoiceId: input.invoiceId ? UniqueId.create(input.invoiceId) : undefined,
      currentInstallment: input.currentInstallment,
      totalInstallments: input.totalInstallments,
      installmentGroupId: input.installmentGroupId
        ? UniqueId.create(input.installmentGroupId)
        : undefined,
    }

    const transaction = new Transaction(props)
    return Result.ok(transaction)
  }

  public static load(input: TransactionLoadInput): Result<Transaction> {
    const props: TransactionProps = {
      type: TransactionType.create(input.type).value,
      amount: input.amount,
      date: input.date,
      description: input.description,
      categoryId: UniqueId.create(input.categoryId),
      accountId: input.accountId ? UniqueId.create(input.accountId) : undefined,
      invoiceId: input.invoiceId ? UniqueId.create(input.invoiceId) : undefined,
      currentInstallment: input.currentInstallment,
      totalInstallments: input.totalInstallments,
      installmentGroupId: input.installmentGroupId
        ? UniqueId.create(input.installmentGroupId)
        : undefined,
    }

    const transaction = new Transaction(
      props,
      input.id,
      input.createdAt,
      input.updatedAt,
      input.deletedAt,
    )
    return Result.ok(transaction)
  }

  public updateData(input: TransactionUpdateInput): Result<void> {
    const validationResult = this.validateUpdate(input)
    if (validationResult.isFailure) {
      return Result.fail<void>(validationResult.errors)
    }

    if (input.date !== undefined) {
      this._props.date = input.date
    }

    if (input.type !== undefined) {
      this._props.type = TransactionType.create(input.type).value
    }

    if (input.description !== undefined) {
      this._props.description = input.description
    }

    if (input.categoryId !== undefined) {
      this._props.categoryId = UniqueId.create(input.categoryId)
    }

    if (input.amount !== undefined) {
      this._props.amount = input.amount
    }

    this.updateTimestamp()
    return Result.ok(undefined)
  }

  private static validateCreate(input: TransactionCreateInput): Result<void> {
    const validator = new Validator()

    validator.check('date', input.date).required().isValidDate()
    validator.check('description', input.description).required().minLength(3)
    validator.check('categoryId', input.categoryId).required().isValidUuid()
    validator.check('amount', input.amount).required().isCurrency()

    const transactionTypeResult = TransactionType.validate(input.type)
    if (transactionTypeResult.isFailure) {
      validator.addErrors(transactionTypeResult.errors as ValidationError[])
    }

    const hasAccount = !!input.accountId
    const hasInvoice = !!input.invoiceId

    if (!hasAccount && !hasInvoice) {
      validator.addErrors([new InvalidTransactionSourceError()])
    } else if (hasAccount && hasInvoice) {
      validator.addErrors([new InvalidTransactionSourceError()])
    }

    if (hasAccount) {
      validator.check('accountId', input.accountId).isValidUuid()
    }

    if (hasInvoice) {
      validator.check('invoiceId', input.invoiceId).isValidUuid()
    }

    this.validateInstallmentInfo(validator, input)

    if (validator.hasErrors()) {
      return Result.fail<void>(validator.getErrors())
    }

    return Result.ok<void>(undefined)
  }

  private validateUpdate(input: TransactionUpdateInput): Result<void> {
    const validator = new Validator()

    if (input.date !== undefined) {
      validator.check('date', input.date).isValidDate()
    }

    if (input.type !== undefined) {
      const transactionTypeResult = TransactionType.validate(input.type)
      if (transactionTypeResult.isFailure) {
        validator.addErrors(transactionTypeResult.errors as ValidationError[])
      }
    }

    if (input.description !== undefined) {
      validator.check('description', input.description).minLength(3)
    }

    if (input.categoryId !== undefined) {
      validator.check('categoryId', input.categoryId).isValidUuid()
    }

    if (input.amount !== undefined) {
      validator.check('amount', input.amount).isCurrency()
    }

    if (validator.hasErrors()) {
      return Result.fail<void>(validator.getErrors())
    }

    return Result.ok<void>(undefined)
  }

  private static validateInstallmentInfo(
    validator: Validator,
    input: TransactionCreateInput,
  ): void {
    const hasCurrentInstallment = input.currentInstallment !== undefined
    const hasTotalInstallments = input.totalInstallments !== undefined
    const hasInstallmentGroupId = input.installmentGroupId !== undefined

    if (
      hasCurrentInstallment ||
      hasTotalInstallments ||
      hasInstallmentGroupId
    ) {
      if (!hasTotalInstallments) {
        validator.addErrors([
          InvalidInstallmentError.missingTotalInstallments(),
        ])
      }

      if (!hasCurrentInstallment) {
        validator.addErrors([
          InvalidInstallmentError.missingCurrentInstallment(),
        ])
      }

      if (!hasInstallmentGroupId) {
        validator.addErrors([InvalidInstallmentError.missingGroupId()])
      }

      if (
        hasCurrentInstallment &&
        hasTotalInstallments &&
        input.currentInstallment &&
        input.totalInstallments &&
        input.currentInstallment > input.totalInstallments
      ) {
        validator.addErrors([
          InvalidInstallmentError.currentGreaterThanTotal(
            input.currentInstallment,
            input.totalInstallments,
          ),
        ])
      }

      if (hasCurrentInstallment && input.currentInstallment !== undefined) {
        if (
          !Number.isInteger(input.currentInstallment) ||
          input.currentInstallment < 1
        ) {
          validator.addErrors([
            InvalidInstallmentError.invalidValue(
              'current installment',
              input.currentInstallment,
            ),
          ])
        }
      }

      if (hasTotalInstallments && input.totalInstallments !== undefined) {
        if (
          !Number.isInteger(input.totalInstallments) ||
          input.totalInstallments < 1
        ) {
          validator.addErrors([
            InvalidInstallmentError.invalidValue(
              'total installments',
              input.totalInstallments,
            ),
          ])
        }
      }

      if (hasInstallmentGroupId && input.installmentGroupId) {
        validator
          .check('installmentGroupId', input.installmentGroupId)
          .isValidUuid()
      }
    }
  }
}
