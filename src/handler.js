const books = require('./books');
const { nanoid } = require('nanoid');


const addBookHandler = (request, h) => {

    const { 
        name, 
        year, 
        author, 
        summary, 
        publisher, 
        pageCount,
        readPage,
        reading
    } = request.payload;

    const id = nanoid(16);
    const finished = (pageCount === readPage);
    const insertedAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();;

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
        id, 
        name, 
        year, 
        author, 
        summary, 
        publisher, 
        pageCount, 
        readPage, 
        finished, 
        reading,
        insertedAt, 
        updatedAt
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
    const { reading, finished, name } = request.query;
        if (reading !== undefined ){
            if ( reading === '1' ){
                const listOfReadingBook = books.filter( b => b.reading === true);
                const response = h.response({
                    status: 'success',
                    message: 'daftar yg lagi dibaca',
                    data: {
                        books: listOfReadingBook.map( ({id,name,publisher}) => ({id,name,publisher}))
                     },
                });
                response.code(200);
                return response;
            }
            if ( reading === '0' ){
                const listOfUnreadingBook = books.filter( b => b.reading === false);
                const response = h.response({
                    status: 'success',
                    message: 'daftar yg lagi dibaca',
                    data: {
                        books: listOfUnreadingBook.map( ({id,name,publisher}) => ({id,name,publisher}))
                     },
                });
                response.code(200);
                return response;
            }
        }
        if (finished !== undefined ) {
            if ( finished === '1' ){
                const listOfFinishedBook = books.filter( b => b.finished === true);
                const response = h.response({
                    status: 'success',
                    message: 'daftar yg sudah selesai dibaca',
                    data: {
                        books: listOfFinishedBook.map( ({id,name,publisher}) => ({id,name,publisher}))
                     },
                });
                response.code(200);
                return response;
            }
            if ( finished === '0' ){
                const listOfUnfinishedBook = books.filter( b => b.finished === false);
                const response = h.response({
                    status: 'success',
                    message: 'daftar yg belum selesai dibaca',
                    data: {
                        books: listOfUnfinishedBook.map( ({id,name,publisher}) => ({id,name,publisher}))
                     },
                });
                response.code(200);
                return response;
            }
        }
        if (name !== undefined){
            const listofBookNamed = books.filter( b => b.name.toLowerCase().includes(name.toLowerCase()));
            const response = h.response({
                status: 'success',
                message: 'daftar buku bernama',
                data: {
                    books: listofBookNamed.map( ({id,name,publisher}) => ({id,name,publisher}))
                 },
            });
            response.code(200);
            return response;    

        }
        const response = h.response({
            status: 'success',
            data: {
                books: books.map( ({id,name,publisher}) => ({id,name,publisher})),
                
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
    const updatedAt = new Date().toISOString();

    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    };

    if ( readPage > pageCount ) {
        const response = h.response ({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    };


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
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;

};

const deleteBookByIdHandler = ( request, h ) => {
    const { bookId } = request.params;

    const index = books.findIndex( (b) => b.id === bookId );
    if ( index !== -1 ){
        books.splice(index,1);
        const response = h.response ({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }
    const response = h.response ({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};


module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler,
    
};