using backend.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace backend.Db
{
    public class DbContext
    {
        public IMongoCollection<User> Users { get; }
        public IMongoCollection<Book> Books { get; }
        public IMongoCollection<Author> Authors { get; }

        public DbContext(IOptions<DatabaseSettings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            var database = client.GetDatabase(settings.Value.DatabaseName);

            Users = database.GetCollection<User>("UsersCollection");
            Books = database.GetCollection<Book>("BooksCollection");
            Authors = database.GetCollection<Author>("AuthorsCollection");
        }
    }
}
