using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class CreateBookDto
    {
        [Required(ErrorMessage = "Title is required")]
        [MinLength(3, ErrorMessage = "Title must be at least 3 characters")]
        public required string Title { get; set; }
        [Required(ErrorMessage = "At least one author is required")]
        [MinLength(1, ErrorMessage = "At least one author is required")]
        public required List<string> AuthorIds { get; set; }
        [Required(ErrorMessage = "Genre is required")]
        public required string Genre { get; set; }
        [Required(ErrorMessage = "Published year is required")]
        public required string PublishedYear { get; set; }
        [Required(ErrorMessage = "Status is required")]
        public required BookStatus Status { get; set; }
        [Required(ErrorMessage = "ISBN is required")]
        public required string ISBN { get; set; }
        [Required(ErrorMessage = "Number of pages is required")]
        public required int Pages { get; set; }
        [Required(ErrorMessage = "Language is required")]
        public required BookLanguage Language { get; set; }
        [Required(ErrorMessage = "Cover image URL is required")]
        public required string CoverImageUrl { get; set; }
    }

    public class UpdateBookDto
    {
        [Required(ErrorMessage = "Title is required")]
        [MinLength(3, ErrorMessage = "Title must be at least 3 characters")]
        public required string Title { get; set; }
        [Required(ErrorMessage = "At least one author is required")]
        [MinLength(1, ErrorMessage = "At least one author is required")]
        public required List<string> AuthorIds { get; set; }
        [Required(ErrorMessage = "Genre is required")]
        public required string Genre { get; set; }
        [Required(ErrorMessage = "Published year is required")]
        public required string PublishedYear { get; set; }
        [Required(ErrorMessage = "Status is required")]
        public required BookStatus Status { get; set; }
        [Required(ErrorMessage = "ISBN is required")]
        public required string ISBN { get; set; }
        [Required(ErrorMessage = "Number of pages is required")]
        public required int Pages { get; set; }
        [Required(ErrorMessage = "Language is required")]
        public required BookLanguage Language { get; set; }
        [Required(ErrorMessage = "Cover image URL is required")]
        public required string CoverImageUrl { get; set; }
    }

    public class GetBooksQuery
    {
        public string? Title { get; set; }
        public string? Genre { get; set; }
        public string? Status { get; set; }
        public string? Language { get; set; }
    }
}
