namespace backend.Services.Interfaces
{
    public interface IPasswordService
    {
        public string HashedPassword(string password);
        public bool VerifyPassowrd(string password, string passwordHash);
    }
}
