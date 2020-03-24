var book={
  title:'Ego is the Enemy',
  author:'Ryan Holiday'  
}

var bookJSON=JSON.stringify(book);
console.log(bookJSON);
var parseData=JSON.parse(bookJSON);
console.log(parseData.author);
