
// barang a = 4550 if pembelian > 13 harga 231/quantity

function hitung(barang, quantity) {
  let harga;
  let hasil;
  switch (barang) {
    case "A":
      harga = 4550;
      if (quantity > 13) {
        hasil = (harga * quantity) / 321;
      }
      
      
      break;
    case "B":
      harga = 5330;
      if (quantity > 7) {
        hasil = harga * quantity * (23 / 100);
      }
      break;
    default:
      harga = 8653
      hasil = harga * quantity 
      break;
  }
  return hasil;
}

const a = hitung("A",22)
console.log(`Hasil A adalah ${a}`);

const b = hitung("B",22)
console.log(`Hasil B adalah ${b}`);

const c = hitung("C",22)
console.log(`Hasil C adalah ${c}`);


