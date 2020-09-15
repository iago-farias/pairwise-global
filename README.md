# Pairwise Global Alignment

Implementação do algoritmo de ***Needleman–Wunsch***, realizada durante o curso de Ciência da Computação no Instituto Federal de Brasília, como uma atividade da 
disciplina de Introdução a Bioinformática.

O programa recebe como entrada um arquivo ***sequences.fasta*** contendo duas sequências de aminoácidos ou nucleotídeos,
e retorna como resultado a tabela de programação dinâmica e um alinhamento ótimo. É criado também um arquivo em pdf para
melhor visualização dos resultados.

# Como usar
1 - Rode o comando no terminal para instalar as dependências:

```
npm install
```

2 - Depois rode o comando no terminal para executar o programa:

```
node index.js
```

> É necessário ter o arquivo sequences.fasta na raiz do projeto com a mesma formatação do arquivo de exemplo neste repositório.
