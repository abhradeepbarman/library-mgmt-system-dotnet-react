using backend.Models;

namespace backend.Services.Interfaces
{
    public interface IUserService
    {
        public Task<User> GetUserByEmailId(string emailId);
        public Task<User> GetUserById(string userId);
        public Task<User> CreateUser(User user);
        public Task<User> UpdateUser(User user, string userId);
        public Task DeleteUser(string userId);
        public Task<bool> SaveUserToken(string userId, string token);
        public Task DeleteToken(string userId);
    }
}
