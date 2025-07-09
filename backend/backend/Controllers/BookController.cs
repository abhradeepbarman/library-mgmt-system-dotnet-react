using backend.DTOs;
using backend.Models;
using backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookController(IBookServices bookServices, IAuthorServices authorServices) : ControllerBase
    {
        private readonly IBookServices _bookServices = bookServices;
        private readonly IAuthorServices _authorServices = authorServices;

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateBook([FromBody] CreateBookDto dto)
        {
            if (!ModelState.IsValid) { 
                return BadRequest(ModelState);
            }

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            foreach (var authorId in dto.AuthorIds)
            {
                var authorDetails = await _authorServices.GetAuthorById(authorId);
                if (authorDetails == null)
                {
                    return NotFound("Author not found");
                }
            }

            var newBook = new Book
            {
                AuthorIds = dto.AuthorIds,
                CoverImageUrl = dto.CoverImageUrl,
                Pages = dto.Pages,
                Genre = dto.Genre,
                ISBN = dto.ISBN,
                Language = dto.Language,
                PublishedYear = dto.PublishedYear,
                Status = dto.Status,
                Title = dto.Title,
                UserId = userId!
            };
            
            var newBookDetails = await _bookServices.AddBook(newBook);
            return Ok(newBookDetails);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetBookById([FromRoute] string id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var book = await _bookServices.GetBookById(id);
            
            if(book == null)
            {
                return NotFound();
            }
            
            if(book.UserId != userId)
            {
                return BadRequest();
            }

            return Ok(book);
        }

        [HttpPost("{id}/delete")]
        [Authorize]
        public async Task<IActionResult> DeleteBook([FromRoute] string id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var bookDetails = await _bookServices.GetBookById(id);
            
            if(bookDetails == null)
            {
                return NotFound();
            }

            if (bookDetails.UserId != userId) { 
                return BadRequest();
            }

            await _bookServices.DeleteBook(id);
            return Ok(bookDetails);
        }

        [HttpPost("{id}/update")]
        [Authorize]
        public async Task<IActionResult> UpdateBook([FromRoute] string id, [FromBody] UpdateBookDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var bookDetails = await _bookServices.GetBookById(id);
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (bookDetails == null)
            {
                return NotFound();
            }

            if (bookDetails.UserId != userId)
            {
                return BadRequest();
            }

            foreach (var authorId in dto.AuthorIds)
            {
                var authorDetails = await _authorServices.GetAuthorById(authorId);
                if (authorDetails == null)
                {
                    return NotFound("Author not found");
                }
            }

            var updatedBook = new Book
            {
                AuthorIds = dto.AuthorIds,
                CoverImageUrl = dto.CoverImageUrl,
                Genre = dto.Genre,
                ISBN = dto.ISBN,
                Language = dto.Language,
                PublishedYear = dto.PublishedYear,
                Pages = dto.Pages,
                Status = dto.Status,
                Title = dto.Title,
                UserId = userId,
            };

            await _bookServices.UpdateBook(id, updatedBook);
            return Ok(updatedBook);
        }

        [HttpGet("author/{authorId}")]
        [Authorize]
        public async Task<IActionResult> GetAuthorBooks([FromRoute] string authorId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var authorDetails = await _authorServices.GetAuthorById(authorId);
            if(authorDetails == null)
            {
                return NotFound();
            }

            if(authorDetails.UserId != userId)
            {
                return BadRequest();
            }

            var books = await _bookServices.GetAuthorBooks(authorId);
            return Ok(books);
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAllBooks([FromQuery(Name = "title")] string? title, [FromQuery(Name = "genre")] string? genre, [FromQuery(Name ="language")] string? language, [FromQuery(Name ="status")] string? status)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var query = new GetBooksQuery { };
            
            if(!string.IsNullOrEmpty(title))
            {
                query.Title = title;
            }

            if (!string.IsNullOrEmpty(genre))
            {
                query.Genre = genre;
            }

            if (!string.IsNullOrEmpty(language))
            {
                query.Language = language;
            }

            if (!string.IsNullOrEmpty(status))
            {
                query.Status = status;   
            }

            var books = await _bookServices.GetAllBooks(userId!, query);
            return Ok(books);
        }

        [HttpGet("stats")]
        [Authorize]
        public async Task<IActionResult> GetStats()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return BadRequest();
            }
            var books = await _bookServices.GetAllBooks(userId, null);
            var totalBooks = books.Count;
            var availableBooks = books.Count(b => b.Status == BookStatus.available);
            var borrowedBooks = books.Count(b => b.Status == BookStatus.borrowed);
            var totalAuthors = await _authorServices.GetAllAuthors(userId, null);

            return Ok(new
            {
                TotalBooks = totalBooks,
                AvailableBooks = availableBooks,
                BorrowedBooks = borrowedBooks,
                TotalAuthors = totalAuthors.Count
            });
        }
    } 
}
