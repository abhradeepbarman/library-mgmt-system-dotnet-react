using backend.Db;
using backend.DTOs;
using backend.Models;
using backend.Services.Interfaces;
using MongoDB.Bson;
using MongoDB.Driver;

namespace backend.Services
{
    public class BookServices : IBookServices
    {
        private readonly DbContext _dbContext;

        public BookServices(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Book> AddBook(Book book)
        {
            try
            {
                await _dbContext.Books.InsertOneAsync(book);
                return book;
            } catch(Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public async Task DeleteBook(string id)
        {
            try
            {
                await _dbContext.Books.DeleteOneAsync(x => x.Id == id);
            } catch(Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public async Task<Book> GetBookById(string id)
        {
            try
            {
                return await _dbContext.Books.Find(x => x.Id == id).FirstOrDefaultAsync();
            } catch(Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public async Task<Book> UpdateBook(string id, Book book)
        {
            try
            {
                book.Id = id;
                return await _dbContext.Books.FindOneAndReplaceAsync(x => x.Id == id, book);
            } catch(Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public async Task DeleteAuthorBooks(string authorId)
        {
            try
            {
                await _dbContext.Books.DeleteManyAsync(x => x.AuthorIds!.Contains(authorId));
            } catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public async Task<List<BookWithAuthors>> GetAuthorBooks(string authorId)
        {
            try
            {
                var result = await _dbContext.Books.Aggregate()
                    .Match(Builders<Book>.Filter.AnyEq(b => b.AuthorIds, authorId))
                    .Lookup<Book, Author, BookWithAuthors>(
                        _dbContext.Authors,
                        book => book.AuthorIds,
                        Author => Author.Id,
                        BookWithAuthor => BookWithAuthor.Authors
                    )
                    .ToListAsync();
                return result;
            }
            catch (Exception e) { 
                throw new Exception(e.Message);
            }
        }

        public async Task<List<BookWithAuthors>> GetAllBooks(string userId, GetBooksQuery? query)
        {
            try
            {
                //var result = await _dbContext.Books.Aggregate()
                //    .Match(Builders<Book>.Filter.Eq(b => b.UserId, userId))
                //    .Lookup<Book, Author, BookWithAuthors>(
                //        _dbContext.Authors,
                //        book => book.AuthorIds,
                //        Author => Author.Id,
                //        BookWithAuthor => BookWithAuthor.Authors
                //    )
                //    .ToListAsync();
                //return result;


                var filter = Builders<Book>.Filter.Eq(b => b.UserId, userId);

                if (query != null)
                {
                    if (!string.IsNullOrEmpty(query.Title))
                    {
                        filter &= Builders<Book>.Filter.Regex(b => b.Title, new BsonRegularExpression(query.Title, "i"));
                    }

                    if (!string.IsNullOrEmpty(query.Genre))
                    {
                        filter &= Builders<Book>.Filter.Eq(b => b.Genre, query.Genre);
                    }

                    if(!string.IsNullOrEmpty(query.Status)) {
                        filter &= Builders<Book>.Filter.Eq(b => b.Status, Enum.Parse<BookStatus>(query.Status, true));
                    }

                    if (!string.IsNullOrEmpty(query.Language))
                    {
                        filter &= Builders<Book>.Filter.Eq(b => b.Language, Enum.Parse<BookLanguage>(query.Language, true));
                    }
                }

                var result = await _dbContext.Books.Aggregate()
                    .Match(filter)
                    .Lookup<Book, Author, BookWithAuthors>(
                        _dbContext.Authors,
                        book => book.AuthorIds,
                        Author => Author.Id,
                        BookWithAuthor => BookWithAuthor.Authors
                    )
                    .ToListAsync();
                return result;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }
    }
}
