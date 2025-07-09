using backend.DTOs;
using backend.Models;
using backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IPasswordService _passwordService;
        private readonly ITokenService _tokenService;

        public AuthController(IUserService userService, IPasswordService passwordService, ITokenService tokenService)
        {
            _userService = userService;
            _passwordService = passwordService;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> UserRegister([FromBody] RegisterRequestDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userService.GetUserByEmailId(dto.Email);
            if (user != null)
            {
                return BadRequest("User already exists");
            }

            var hashedPassword = _passwordService.HashedPassword(dto.Password);
            var newUser = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                Password = hashedPassword,
            };

            var createdUser = await _userService.CreateUser(newUser);
            var tokens = _tokenService.GenerateTokens(createdUser.Id!);

            var isTokenUpdated = await _userService.SaveUserToken(createdUser.Id!, tokens.RefreshToken);
            if (!isTokenUpdated) {
                return BadRequest("Token not updated");
            }

            newUser.RefreshToken = tokens.RefreshToken;
            return Ok(
                new RegisterResponseDto
                {
                    AccessToken = tokens.AccessToken,
                    RefreshToken = tokens.RefreshToken,
                    Id = createdUser.Id!
                });
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> UserLogin([FromBody] LoginRequestDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userService.GetUserByEmailId(dto.Email);
            if (user == null) {
                return NotFound("User does not exists");
            }

            var isPasswordMatch = _passwordService.VerifyPassowrd(dto.Password, user.Password!);
            if (!isPasswordMatch) { 
                return BadRequest("Invalid credentials");
            }

            var tokens = _tokenService.GenerateTokens(user.Id!);

            var isTokenUpdated = await _userService.SaveUserToken(user.Id!, tokens.RefreshToken);
            if (!isTokenUpdated)
            {
                return BadRequest("Token not updated");
            }

            return Ok(
                new LoginResponseDto
                {
                    AccessToken = tokens.AccessToken,
                    RefreshToken = tokens.RefreshToken,
                    Id = user.Id!
                });
        }

        [HttpPost("refresh/{token}")]
        [AllowAnonymous]
        public async Task<IActionResult> RefreshAccessToken(string token)
        {
            var principal = _tokenService.GetPrincipalFromExpiredToken(token);
            if (principal == null)
                return BadRequest("Invalid token");

            var userId = principal.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userService.GetUserById(userId!);

            if (user == null)
            {
                return BadRequest("Invalid token");
            }

            var tokens = _tokenService.GenerateTokens(user.Id!);
            await _userService.SaveUserToken(user.Id!, tokens.RefreshToken);

            return Ok(
                new RefreshTokenResponseDto
                {
                    Id = user.Id!,
                    RefreshToken = tokens.RefreshToken,
                    AccessToken = tokens.AccessToken
                });
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> UserLogout()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            await _userService.DeleteToken(userId!);
            return Ok("User logged out successfully");
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetMe()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _userService.GetUserById(userId!);
            user.Password = null;
            user.RefreshToken = null!;
            return Ok(user);
        }
    } 
}
