const fs = require('fs');
const pdf = require('html-pdf');
const ejs = require('ejs');
const { exit } = require('process');

function getGreatAlignment(matrix){
    let sequenceAlignment1 = "";
    let sequenceAlignment2 = "";
    let score; 
    let scoreLeft;
    let scoreUp;
    let scoreDiagonal;
    // Posição do elemento do canto inferior direito
    let i = matrix.length - 1;
    let j = matrix[0].length - 1;

    while(i > 0 || j > 0){
        score = matrix[i][j];
        scoreLeft = matrix[i][j - 1];
        scoreDiagonal = matrix[i - 1][j - 1];
        scoreUp = matrix[i - 1][j];
            
        if(score === scoreLeft - 2){
            sequenceAlignment1 = sequence1[j - 1] + sequenceAlignment1;
            sequenceAlignment2 = "-" + sequenceAlignment2;

            j--;
        }
        else if(score === scoreUp - 2){
            sequenceAlignment1 = "-" + sequenceAlignment1;
            sequenceAlignment2 = sequence2[i - 1] + sequenceAlignment2;

            i--;
        }
        else if(score === scoreDiagonal + sequence1[i - 1] === sequence1[j - 1] ? 1 : -1){
            sequenceAlignment1 = sequence1[j - 1] + sequenceAlignment1;
            sequenceAlignment2 = sequence2[i - 1] + sequenceAlignment2;

            i--;
            j--;
        }  
    }

    while(j > 0){
        sequenceAlignment1 = sequence1[j - 1] + sequenceAlignment1;
        sequenceAlignment2 = "-" + sequenceAlignment2;

        j--;
    }

    while(i > 0){
        sequenceAlignment1 = "-" + sequenceAlignment1;
        sequenceAlignment2 = sequence2[i - 1] + sequenceAlignment2;
        
        i--;
    }

    console.log(sequenceAlignment1);
    console.log(sequenceAlignment2);

    return {sequenceAlignment1, sequenceAlignment2};
}

let sequence1;
let sequence2;

//Leitura do arquivo
try {
    const data = fs.readFileSync('./sequences.fasta', 'utf8')
    const sesquences = data.split("\n");

    sequence1 = sesquences[1].trim();
    sequence2 = sesquences[3].trim();

  } catch (err) {
    console.error(err)
    exit(0);
}


let matrix = [[0]]; //Matriz de pontuação

// Inicialização da matriz
for(j = 1 ; j <= sequence1.length ; j++){
    matrix[0][j] = -2 * j;
}

for(i = 1 ; i <= sequence2.length ; i++){
    matrix[i] = [-2 * i];
}

// Construção da matriz de pontuação
for(i = 1 ; i < matrix.length; i++){
    for(j = 1; j < matrix[0].length; j++){
        let max;     
        
        if(sequence1[j-1] === sequence2[i-1]){
            max = Math.max(matrix[i][j-1] - 2,  matrix[i-1][j] - 2,  matrix[i-1][j-1] + 1); //Match
        }
        else{
            max = Math.max(matrix[i][j-1] - 2,  matrix[i-1][j] - 2,  matrix[i-1][j-1] - 1); //Mismatch
        }

        matrix[i][j] = max;
    }
}

console.log("Matriz de programação dinâmica:");
for(i=0;i<matrix.length;i++){
    let linha="";

    for(j=0;j<matrix[0].length;j++){
        if(matrix[i][j] >= 0){
            linha=linha+" "+matrix[i][j]+" ";
        }
        else{
            linha=linha+matrix[i][j]+" ";
        }
    }

    console.log(linha);
}

console.log("Alinhamento ótimo:");
const {sequenceAlignment1, sequenceAlignment2} = getGreatAlignment(matrix);

// Gera um arquivo em pdf para melhor visualização
ejs
.renderFile('./resultTemplate.ejs',
    {
    sequence1: sequence1,
    sequence2: sequence2,
    sequenceAlignment1: sequenceAlignment1, 
    sequenceAlignment2: sequenceAlignment2,
    matrix: matrix
    },
    (error, html) =>
    {
        if(error){
            console.log(err);
        }
        else{
            pdf.create(html, {}).toFile("result.pdf",(
                (error, result) => {
                    if(error){
                        console.log(error);
                    }
                    else{
                        console.log("Arquivo pdf criado!\nDiretório: " + result.filename);
                    }
                }
            ));
        }
    }
);