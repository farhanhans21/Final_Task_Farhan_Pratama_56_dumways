const array = [20,12,35,11,17,9,58,23,69,21];
let tukar
// periksa nilai array
// jika kecil maka di pindahkan ke depan
// arr [4,2,5,6]
// temp = arr[0]
// tem = 4 
// arr[0] == arr[1]
// expect 2
// arr [2,2,5,6]
// arr[1] =temp
// arr [2,4,5,6]

do {
  tukar = false // tidak melakukan apa apa
  for (let index = 0; index < array.length; index++) {
    if (array[index] > array[index+1]) {
      let temp = array[index]
      array[index] = array[index+1]
      array[index + 1] = temp

      tukar = true // menjalankan tukar
    }
  }
} while (tukar);

console.log(array);

