const books = require('./books');
const { nanoid } = require('nanoid');


const addBookHandler = (request, h) => {

    const { 
        name, year, author, summary, publisher, pageCount,readPage,reading
    } = request.payload;

    const id = nanoid(16);
    const finished = (pageCount === readPage);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    };

    if ( readPage > pageCount ) {
        const response = h.response ({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    };

    const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading,insertedAt, updatedAt
    };

    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }
    const response = h.response ({
        status: 'error',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
};

const getAllBooksHandler = (request, h) => {
   
    
    if ( books.length > 0 ) {
        const response = h.response({
            status: 'success',
            data: {
                books: books.map(book => ({
                    id: book.id, 
                    name: book.name, 
                    publisher: book.publisher}))
                  },
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'success',
        data: {
            books,
            
        },
    });
    response.code(200);
    return response;

   

};

const getBookByIdHandler = ( request, h ) => {
    const { bookId } =request.params;

    const book = books.filter( (b) => b.id === bookId)[0];
    if (book !== undefined){
        const response = h.response ({
            status: 'success',
            data: {
                book,
            },
        });
        response.code(200);
        return response;
      }
      const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
      });
      response.code(404);
      return response; 
  
};

const editBookByIdHandler = ( request, h ) => {
    const { bookId } = request.params;
    const { 
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;
    const updatedAt = new Date().toISOString;

    const index = books.findIndex( (b) => b.id === bookId );

    if ( index !== -1 ){
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt,
        };
        // const book = books.filter( (b) => b.id === bookId)[0];
        const response = h.response ({
            status: 'success',
            message: 'Buku berhasil diperbarui',
            data: {
                book:books[index],
            }
        });
        response.code(200);
        return response;
    }
    const response = h.response ({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;

};

module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
};