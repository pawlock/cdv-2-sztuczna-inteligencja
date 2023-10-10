/*
założenia: 
a) znaleźć mete
b) nie dotykać ścian

legenda:
zielony - a.i.
biały - nieznane pole
niebieskie - sprawdzone bezpieczne pole
czarne - ściana
czerwone - sprawdzone zakazane pole

*/





var column = 1;//początkowa wartość column
var row = 1;//początkowa wartość row
var last_move= {
  row: 1,
  column: 1
}//ostatni wykonany ruch
var tries = 1; // numer ery
var click = true; //zmienna do pojedyńczego kliknięcia
var path = []; //ścieżka w danej erze

window.onload=function(){

  //wciśnięcie przycisku start
  document.getElementById("btn2").addEventListener("click",()=>{
  if(click){
    //upewnienie się co do wartości poazątkowych
    column = 1;
    row = 1;

    //prędkość ruchu
    const time = document.getElementById("time").value;

    //ustawienie się na początku planszy
    const element = document.getElementsByClassName(`${row}e${column}`);
    if(element[0]){//jeśli element not null
      element[0].style.backgroundColor = 'green'; // zielony to kolor a.i.
      var timer = setInterval(()=>{
        check(timer);
      },time);
      click = false;
    }else{
      document.getElementById(`tries`).innerHTML = 'Nie stworzono pola!'
    }
    
  }
});
  
  //wciśnięcie przycisku rewind
  document.getElementById("btn3").addEventListener("click",()=>{
    column = 1;
    row = 1;
  
    const time = document.getElementById("time").value;
    
    const element = document.getElementsByClassName(`${row}e${column}`);
    if(element[0] || path.length == 0){
      element[0].style.backgroundColor = 'green';
      rewind(time);
      
    }else{
      document.getElementById(`tries`).innerHTML = 'Nie stworzono pola albo nie ma rozwiązania!'
    }
    
  });
  
}

//przechodzi przez tablicę path
function rewind(time){
  let num = 1
  const timer2 = setInterval(()=>{
    if(path[num]){
      let element = document.getElementsByClassName(`${path[num]}`);
      element[0].style.backgroundColor = 'green';
      element = document.getElementsByClassName(`${path[num-1]}`);
      element[0].style.backgroundColor = 'orange';
      num++
    }else{
      clearInterval(timer2);
    }
    
  }, time)
  
}

//wykonuje ruch, czyli nowe pole na zielono a stare na niebiesko
function move(test_row, test_column){
  let element = document.getElementsByClassName(`${test_row}e${test_column}`);
  element[0].style.backgroundColor = 'green';
  element = document.getElementsByClassName(`${row}e${column}`);
  element[0].style.backgroundColor = 'blue';
  path.push(`${test_row}e${test_column}`);
  last_move.row = row;
  last_move.column = column;
  row = test_row;
  column = test_column;
};


function move_multiple(tab){
  if(tab.length>0){
    const num = Math.floor(Math.random() * tab.length);
    test_row = tab[num].row;
    test_column = tab[num].column;
    move(test_row, test_column);
  }else{
    slap();//jeśli jest tylko jedno wyjście to automatycznie uznaje to za ślepą uliczkę
  }
  
}

//po dostaniu się na zakazane pole cofa na początek
function slap(){
  element = document.getElementsByClassName(`${row}e${column}`);
  element[0].style.backgroundColor = 'red';
  last_move.row = row;
  last_move.column = column;
  row = 1;
  column = 1;
  element = document.getElementsByClassName(`${row}e${column}`);
  element[0].style.backgroundColor = 'green';
  tries++
  element = document.getElementById(`tries`);
  element.innerHTML = `Era ${tries}`;
  path = [];
}

//sprawdza wokół siebie pola
function check(timer){
  var tab = [];
  for(var test_row = row-1; test_row<=row+1; test_row++){
    for(var test_column = column-1; test_column<=column+1; test_column++){
      let element = document.getElementsByClassName(`${test_row}e${test_column}`);
      if(element[0]){
        if(test_row == last_move.row && test_column == last_move.column){
          //sprawdza czy sprawdzane obecnie pole nie jest poprzednim ruchem
        }else if(element[0].style.getPropertyValue("background-color") == "black"){
          slap()
          return 0;
        }else if(element[0].style.getPropertyValue("background-color") == 'yellow'){
          move(test_row, test_column);
          clearInterval(timer);
          return 0;
        }else if(element[0].style.getPropertyValue("background-color") == 'white'){
          //dist jest po to by a.i. nie skakało na ukos, ale jeśli po ukosie będzie czarne pole to nadal traktowało to jako błąd
          const dist = Math.abs(row - test_row) + Math.abs(column - test_column);
          if(dist<2){
            tab.push({row: test_row, column: test_column});
            tab.push({row: test_row, column: test_column});
            //dodatkowo a.i. jest ciekawe nowych doświadczeń
          }
        }else if(element[0].style.getPropertyValue("background-color") == 'blue'){
          const dist = Math.abs(row - test_row) + Math.abs(column - test_column);
          if(dist<2){
            tab.push({row: test_row, column: test_column});
          }
        }
        
        
      } 
    }
  }
  move_multiple(tab)
}