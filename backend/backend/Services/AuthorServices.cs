using backend.Db;
using backend.Models;
using backend.Services.Interfaces;
using MongoDB.Bson;
using MongoDB.Driver;

namespace backend.Services
{
    public class AuthorServices : IAuthorServices
    {
        private readonly DbContext _dbContext;

        public AuthorServices(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Author> CreateAuthor(Author author)
        {
            try
            {
                await _dbContext.Authors.InsertOneAsync(author);
                return author;
            } catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public async Task<Author> GetAuthorById(string id)
        {
            try
            {
                var filter = Builders<Author>.Filter.Eq(author => author.Id, id);
                var author = await _dbContext.Authors.Find(filter).FirstOrDefaultAsync();
                return author;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public async Task DeleteAuthor(string id)
        {
            try
            {
                await _dbContext.Authors.DeleteOneAsync(x => x.Id == id);
            }
            catch(Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public async Task<List<AuthorWithBooks>> GetAllAuthors(string userId, string? name)
        {
            try
            {
                var filter = Builders<Author>.Filter.Eq(a => a.UserId, userId);

                if(!string.IsNullOrEmpty(name))
                {
                    filter &= Builders<Author>.Filter.Regex(a => a.Name, new BsonRegularExpression(name, "i"));
                }

                var result = await _dbContext.Authors.Aggregate()
                    .Match(filter)
                     .Lookup<Author, Book, AuthorWithBooks>(
                        _dbContext.Books,
                        author => author.Id,
                        book => book.AuthorIds,
                        AuthorWithBooks => AuthorWithBooks.Books
                    ).ToListAsync();

                return result;
            } catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public async Task<Author> UpdateAuthor(string id, Author author)
        {
            try
            {
                var filter = Builders<Author>.Filter.Eq(author => author.Id, id);
                var oldAuthorDetails = await _dbContext.Authors.Find(filter).FirstOrDefaultAsync();
                var oldId = oldAuthorDetails.Id;
                author.Id = oldId;
                author.UserId = oldAuthorDetails.UserId;

                await _dbContext.Authors.ReplaceOneAsync(filter, author);
                return author;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }
    }
}
