using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class CreateAuthorRequestDto
    {
        [Required(ErrorMessage = "Name is required")]
        [MinLength(3, ErrorMessage = "Name must be at least 3 characters")]
        public required string Name { get; set; }

        [Required(ErrorMessage = "Bio is required")]
        [MinLength(3, ErrorMessage = "Bio must be at least 3 characters")]
        public required string Bio { get; set; }

        [Required(ErrorMessage = "Nationality is required")]
        public required string Nationality { get; set; }

        [Required(ErrorMessage = "DOB is required")]
        public required string DOB { get; set; }
        [Required(ErrorMessage = "Awards is required")]
        public required List<string> Awards { get; set; }
    }
}
