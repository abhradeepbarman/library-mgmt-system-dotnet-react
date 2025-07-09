using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models
{
    public class Author
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public required string Name { get; set; }
        public required string Bio { get; set; }
        public required string Nationality { get; set; }
        public required string DOB { get; set; }
        public required List<string> Awards { get; set; }
        [BsonRepresentation(BsonType.ObjectId)]
        public string? UserId { get; set; }
    }

    public class AuthorWithBooks: Author
    {
        public List<Book> Books { get; set; } = [];
    }
}
