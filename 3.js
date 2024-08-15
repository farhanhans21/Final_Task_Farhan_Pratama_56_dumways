function drawImage(n) {
  if (n % 2 === 0) {
      console.log("Parameter harus ganjil");
      return;
  }

  for (let i = 0; i < n; i++) {
      let row = '';
      for (let j = 0; j < n; j++) {
          // Aturan untuk menggambar
          if (i === j || i + j === n - 1) {
              row += '# ';
          } else {
              row += '* ';
          }
      }
      console.log(row.trim());
  }
}

// Contoh penggunaan
drawImage(5);
console.log('\n'); // untuk spasi antara output
drawImage(7);
