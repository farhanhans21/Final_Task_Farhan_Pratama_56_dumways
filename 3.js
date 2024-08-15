// % =\> modular yang mana hasil keluarannya bagi sisa

function drawImage(panjang) {
  if (panjang % 2 === 0) {
    console.log("Panjang harus ganjil.");
    return;
  }

  for (let i = 0; i < panjang; i++) {
    let baris = "";
    for (let j = 0; j < panjang; j++) {
      if (i === 0 || i === panjang - 1 || j === 0 || j === panjang - 1) {
        baris += "#";
      }
       else if (i === Math.floor(panjang / 2) || j === Math.floor(panjang / 2)) {
        baris += "*";
      }
      else {
        baris += "#";
      }
    }
    console.log(baris);
  }
}

drawImage(5);
// drawImage(7);