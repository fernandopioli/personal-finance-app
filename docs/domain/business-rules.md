# Regras de Negócio

## Regras Gerais

1. Todas as entidades possuem um ID único no formato UUID.
2. Entidades possuem registro de data de criação, atualização e eventual exclusão.
3. IDs e datas de sistema não são diretamente editáveis pelos usuários.
4. **Os campos de entidades podem ser atualizados individualmente, com exceção de campos de relacionamento e identificação que podem ter regras específicas de imutabilidade.**

## Bancos

1. Código do banco deve ter exatamente 3 caracteres.
2. Nome do banco deve ter no mínimo 3 caracteres.

## Contas

1. Conta deve estar associada a um banco existente.
2. Conta deve ser do tipo "corrente" ou "poupança".
3. Nome da conta deve ter no mínimo 3 caracteres.
4. Saldo não pode ser negativo.
5. Código de agência não pode ultrapassar 10 caracteres.
6. Número da conta não pode ultrapassar 20 caracteres.

## Cartões

1. Nome do cartão deve ter no mínimo 3 caracteres.
2. Limite do cartão deve ser maior ou igual a zero.
3. Dia de fechamento e vencimento devem ser valores entre 1 e 31.
4. **Cartão deve obrigatoriamente estar associado a uma conta bancária.**

## Faturas

1. Fatura deve estar associada a um cartão existente.
2. Data de fim da fatura deve ser posterior à data de início.
3. O valor total da fatura deve ser maior ou igual a zero.
4. Status da fatura deve ser "open", "closed" ou "paid".

## Categorias

1. Nome da categoria deve ter no mínimo 3 caracteres.
2. Categoria deve ser do tipo "expense" ou "income".
3. Uma categoria pode ser raiz ou subcategoria de outra existente.
4. Uma categoria não pode ser subcategoria de si mesma.

## Transações

1. Uma transação deve ter data, descrição, categoria, valor e tipo.
2. Descrição da transação deve ter no mínimo 3 caracteres.
3. Uma transação deve pertencer a uma categoria existente.
4. Valor da transação deve ser um valor monetário válido.
5. **Transação deve pertencer a uma conta OU a uma fatura, nunca a ambas simultaneamente.**
6. Tipo da transação deve ser "expense" ou "income".
7. Transações associadas a faturas são tipicamente do tipo "expense".

## Parcelamentos

1. **Transações em parcelas formam um grupo identificado pelo installmentGroupId.**
2. Número da parcela atual (currentInstallment) deve ser um inteiro positivo.
3. Total de parcelas (totalInstallments) deve ser um inteiro positivo.
4. Número da parcela atual não pode ser maior que o total de parcelas.
5. Quando uma transação tem installmentGroupId, ela deve ter também currentInstallment e totalInstallments.
6. **Após criada, informações de parcelamento (currentInstallment, totalInstallments, installmentGroupId) não podem ser alteradas.**
7. **Informações de vínculo (accountId ou invoiceId) não podem ser alteradas após a criação da transação.**
