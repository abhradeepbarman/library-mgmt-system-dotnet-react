using backend.Services.Interfaces;
using System.Security.Cryptography;

namespace backend.Services
{
    public class PasswordService: IPasswordService
    {
        public string HashedPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        public bool VerifyPassowrd(string password, string passwordHash)
        {
            return BCrypt.Net.BCrypt.Verify(password, passwordHash);
        }
    }
}
