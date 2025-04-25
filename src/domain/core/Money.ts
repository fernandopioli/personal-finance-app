import { ValueObject, Result } from '@domain/core'
import {
  InvalidMoneyValueError,
  IncompatibleCurrencyError,
} from '@domain/errors'

interface MoneyProps {
  amount: number
  currency: string
}

export class Money extends ValueObject<MoneyProps> {
  private static readonly DEFAULT_CURRENCY = 'BRL'

  private constructor(props: MoneyProps) {
    super(props)
  }

  public get amount(): number {
    return this.value.amount
  }

  public get currency(): string {
    return this.value.currency
  }

  public static zero(): Money {
    return new Money({ amount: 0, currency: Money.DEFAULT_CURRENCY })
  }

  public static create(
    amount: number,
    currency: string = Money.DEFAULT_CURRENCY,
  ): Result<Money> {
    if (!this.isValidAmount(amount)) {
      return Result.fail([new InvalidMoneyValueError('amount', amount)])
    }

    if (!this.isValidCurrency(currency)) {
      return Result.fail([new InvalidMoneyValueError('currency', currency)])
    }

    return Result.ok(new Money({ amount, currency }))
  }

  private static isValidAmount(amount: number): boolean {
    if (isNaN(amount) || !Number.isFinite(amount)) {
      return false
    }

    const rounded = parseFloat(amount.toFixed(2))

    return Math.abs(amount - rounded) < 0.00001
  }

  private static isValidCurrency(currency: string): boolean {
    return /^[A-Z]{3}$/.test(currency)
  }

  public add(money: Money): Result<Money> {
    if (this.currency !== money.currency) {
      return Result.fail([
        IncompatibleCurrencyError.forAddition(this.currency, money.currency),
      ])
    }

    return Money.create(this.amount + money.amount, this.currency)
  }

  public subtract(money: Money): Result<Money> {
    if (this.currency !== money.currency) {
      return Result.fail([
        IncompatibleCurrencyError.forSubtraction(this.currency, money.currency),
      ])
    }

    return Money.create(this.amount - money.amount, this.currency)
  }

  public multiply(factor: number): Result<Money> {
    return Money.create(this.amount * factor, this.currency)
  }

  public format(): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: this.currency,
    }).format(this.amount)
  }
}
