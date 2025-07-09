using backend.DTOs;
using System.Security.Claims;

namespace backend.Services.Interfaces
{
    public interface ITokenService
    {
        public TokensDto GenerateTokens(string id);
        public ClaimsPrincipal? GetPrincipalFromExpiredToken(string token);
    }
}
