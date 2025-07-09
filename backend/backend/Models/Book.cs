using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public enum BookStatus
{
    available,
    borrowed
}

public enum BookLanguage
{
    hindi,
    english,
    bengali
}

namespace backend.Models
{
    public class Book
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public required string? Title { get; set; }
        [BsonRepresentation(BsonType.ObjectId)]
        public List<string>? AuthorIds { get; set; }
        public required string Genre { get; set; }
        public required string PublishedYear { get; set; } 
        public required BookStatus Status { get; set; } = BookStatus.available;
        public required string ISBN { get; set; }
        public required int Pages { get; set; }        
        public required BookLanguage Language { get; set; }
        public required string CoverImageUrl { get; set; }
        [BsonRepresentation(BsonType.ObjectId)]
        public required string UserId { get; set; }
    }

    [BsonIgnoreExtraElements]
    public class BookWithAuthors : Book
    {
        public List<Author> Authors { get; set; } = [];
    }
}
