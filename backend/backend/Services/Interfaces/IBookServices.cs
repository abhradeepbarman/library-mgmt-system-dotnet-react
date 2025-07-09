using backend.DTOs;
using backend.Models;
using MongoDB.Bson;

namespace backend.Services.Interfaces
{
    public interface IBookServices
    {
        public Task<Book> GetBookById(string id);
        public Task<Book> AddBook(Book book);
        public Task<Book> UpdateBook(string id, Book book);
        public Task DeleteBook(string id);
        public Task DeleteAuthorBooks(string authorId);
        public Task<List<BookWithAuthors>> GetAuthorBooks(string authorId);
        public Task<List<BookWithAuthors>> GetAllBooks(string userId, GetBooksQuery? query);
    }
}
