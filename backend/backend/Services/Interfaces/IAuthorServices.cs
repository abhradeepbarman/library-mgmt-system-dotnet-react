using backend.Models;

namespace backend.Services.Interfaces
{
    public interface IAuthorServices
    {
        Task<List<AuthorWithBooks>> GetAllAuthors(string userId, string? name);
        Task<Author> GetAuthorById(string id);
        Task<Author> CreateAuthor(Author author);
        Task DeleteAuthor(string id);
        Task<Author> UpdateAuthor(string id, Author author);
    }
}
