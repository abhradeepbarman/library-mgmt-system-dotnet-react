namespace backend.Db
{
    public class DatabaseSettings
    {
        public string? ConnectionString { get; set; }
        public string? DatabaseName { get; set; }
        public string? BooksCollectionName { get; set; }
        public string? AuthorsCollectionName { get; set; }
        public string? UsersCollectionName { get; set; }
    }
}
