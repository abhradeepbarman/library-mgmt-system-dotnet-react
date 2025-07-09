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
    public class AuthorController(IAuthorServices authorServices, IBookServices bookServices) : ControllerBase
    {
        private readonly IAuthorServices _authorServices = authorServices;
        private readonly IBookServices _bookServices = bookServices;

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateAuthor(CreateAuthorRequestDto dto)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var newAuthor = new Author
            {
                Name = dto.Name,
                Bio = dto.Bio,
                Nationality = dto.Nationality,
                DOB = dto.DOB,
                UserId = userId,
                Awards = dto.Awards
            };
            await _authorServices.CreateAuthor(newAuthor);
            return Ok(newAuthor);
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAll([FromQuery(Name = "name")] string? name)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var authors = await _authorServices.GetAllAuthors(userId!, name);
            
            return Ok(authors);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetById([FromRoute] string id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var author = await _authorServices.GetAuthorById(id);
            
            if(author == null)
            {
                return NotFound();
            }

            if(author.UserId != userId)
            {
                return BadRequest();
            }

            return Ok(author);
        }

        [HttpPost("{id}/delete")]
        [Authorize]
        public async Task<IActionResult> DeleteAuthor([FromRoute] string id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var author = await _authorServices.GetAuthorById(id);
            
            if (author == null)
            {
                return NotFound();
            }

            if(author.UserId != userId)
            {
                return BadRequest();
            }

            //await _bookServices.DeleteAuthorBooks(authorId: author.Id!);
            var books = await _bookServices.GetAuthorBooks(author.Id!);
            if(books.Count > 0)
            {
                return BadRequest("You have to delete this author's books first");
            } 

            await _authorServices.DeleteAuthor(id);
            return Ok(author);
        }

        [HttpPost("{id}/update")]
        [Authorize]
        public async Task<IActionResult> UpdateAuthor([FromRoute] string id, [FromBody] Author author)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var authorDetails = await _authorServices.GetAuthorById(id);
            if (authorDetails == null)
            {
                return NotFound();
            }

            if(authorDetails.UserId != userId)
            {
                return BadRequest();
            }

            var updatedAuthor = await _authorServices.UpdateAuthor(id, author);
            return Ok(updatedAuthor);
        }
    }
}
