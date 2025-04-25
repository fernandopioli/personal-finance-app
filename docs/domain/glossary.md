# Glossário do Domínio Financeiro

## Entidades

### Banco (Bank)

Instituição financeira que fornece serviços bancários. No sistema, é representada por um nome e um código de 3 dígitos (ex: "341" para Itaú).

### Conta (Account)

Conta bancária que pode ser corrente ou poupança, vinculada a um banco específico. Possui saldo e pode receber transações diretamente.

### Cartão (Card)

Instrumento de pagamento que pode estar vinculado a uma conta bancária. Possui limites de crédito e ciclos de faturamento determinados por dia de fechamento e vencimento.

### Fatura (Invoice)

Conjunto de transações realizadas com um cartão dentro de um período específico (entre data inicial e final). Tem status (aberta, fechada ou paga) e valor total.

### Categoria (Category)

Classificação de transações que pode ser de receita ou despesa. Permite estrutura hierárquica, onde uma categoria pode ter categorias-filha (subcategorias).

### Transação (Transaction)

Movimento financeiro que pode ser receita ou despesa. Pode estar associada a uma conta bancária (débito direto) OU a uma fatura de cartão (nunca ambas). Pode ser parcelada, quando faz parte de um grupo de parcelas identificadas pelo mesmo installmentGroupId.

## Conceitos-chave

### Tipos de Conta

- **Corrente**: Conta para movimentações diárias
- **Poupança**: Conta para economia e rendimentos

### Tipos de Categoria e Transação

- **Receita (Income)**: Entrada de dinheiro (salário, rendimentos, etc.)
- **Despesa (Expense)**: Saída de dinheiro (compras, pagamentos, etc.)

### Ciclo de Faturamento

- **Dia de Fechamento**: Data em que a fatura corrente fecha e inicia-se a próxima
- **Dia de Vencimento**: Data limite para pagamento da fatura

### Estados da Fatura

- **Aberta (Open)**: Fatura atual, ainda recebendo transações
- **Fechada (Closed)**: Fatura com período encerrado, aguardando pagamento
- **Paga (Paid)**: Fatura quitada

### Parcelamentos

- **Parcela Atual (CurrentInstallment)**: Número da parcela atual
- **Total de Parcelas (TotalInstallments)**: Quantidade total de parcelas
- **Grupo de Parcelas (InstallmentGroupId)**: Identificador único para vincular todas as parcelas de uma mesma compra

### Identificadores Únicos

IDs no formato UUID que garantem a unicidade global de cada entidade e relacionamento no sistema.
