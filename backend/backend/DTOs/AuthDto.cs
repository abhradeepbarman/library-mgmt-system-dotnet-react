using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class RegisterRequestDto
    {
        [Required(ErrorMessage = "Name is required")]
        [MinLength(3, ErrorMessage = "Name must be at least 3 characters")]
        public required string Name { get; set; }
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Insert Valid Email")]
        public required string Email { get; set; }
        [Required(ErrorMessage = "Password is required")]
        [MinLength(3, ErrorMessage = "Password must be at least 3 characters")]
        public required string Password { get; set; }
    }

    public class RegisterResponseDto
    {
        public required string Id { get; set; }
        public required string AccessToken { get; set; }
        public required string RefreshToken { get; set; }
    }



    public class LoginRequestDto
    {
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Insert Valid Email")]
        public required string Email { get; set; }
        [Required(ErrorMessage = "Password is required")]
        public required string Password { get; set; }
    }

    public class LoginResponseDto
    {
        public required string Id { get; set; }
        public required string AccessToken { get; set; }
        public required string RefreshToken { get; set; }
    }
    public class RefreshTokenResponseDto
    {
        public required string Id { get; set; }
        public required string AccessToken { get; set; }
        public required string RefreshToken { get; set; }
    }

    public class TokensDto
    {
        public required string AccessToken { get; set; }
        public required string RefreshToken { get; set; }
        public required DateTime AccessTokenExpiresAt {  get; set; }
        public required DateTime RefreshTokenExpiresAt { get; set; }
    }
}
