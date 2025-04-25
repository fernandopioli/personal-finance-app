# ADR 001: Relações Imutáveis em Transações

## Status

Aceito

## Contexto

Transações financeiras podem ser associadas a contas bancárias ou faturas de cartão, e podem fazer parte de um grupo de parcelas. No método `updateData()` da entidade `Transaction`, analisamos se devemos permitir a alteração dessas relações após a criação da transação.

As informações de relacionamento em questão são:

- `accountId`: Vincula a transação a uma conta bancária
- `invoiceId`: Vincula a transação a uma fatura de cartão
- `currentInstallment`: Número da parcela atual
- `totalInstallments`: Total de parcelas
- `installmentGroupId`: ID do grupo de parcelas

O código permite que esses campos sejam informados na criação da transação, mas não na atualização.

## Decisão

Decidimos que as informações de relacionamento (`accountId`, `invoiceId`) e de parcelamento (`currentInstallment`, `totalInstallments`, `installmentGroupId`) não podem ser alteradas após a criação da transação.

Os seguintes campos foram deliberadamente removidos do método `updateData()`:

```typescript
// Esses campos NÃO estão presentes no método updateData()
// accountId
// invoiceId
// currentInstallment
// totalInstallments
// installmentGroupId
```

Os campos que podem ser alterados são apenas:

```typescript
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
```

## Motivação

1. **Integridade dos dados financeiros**: Alterar a qual conta ou fatura uma transação pertence pode causar inconsistências nos saldos e totais.

2. **Simplicidade do domínio**: A decisão simplifica a lógica do domínio ao não precisar lidar com mudanças complexas de relacionamento.

3. **Parcelamentos imutáveis**: Alterar informações de parcelamento criaria inconsistências no grupo de parcelas, onde as parcelas poderiam ter configurações diferentes.

4. **Comportamento do mundo real**: No mundo financeiro real, transações normalmente não mudam sua origem ou destino após registradas.

## Consequências

### Positivas

- Garante integridade dos dados financeiros
- Simplifica a auditoria de transações
- Evita inconsistências em grupos de parcelas
- Reduz a complexidade do domínio

### Negativas

- Correção de erros de entrada exige exclusão e recriação da transação
- Mudanças legítimas de vínculo (ex.: transação lançada na conta errada) não podem ser feitas diretamente

## Alternativas Consideradas

1. **Permitir alterações com regras específicas**: Poderíamos ter permitido alterações em condições específicas, como apenas para transações recentes ou com verificações adicionais de integridade.

2. **Implementar transações de estorno/correção**: Poderíamos criar um mecanismo de estorno automático + nova transação, registrando a relação entre elas.
