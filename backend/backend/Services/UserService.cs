using backend.Db;
using backend.Models;
using backend.Services.Interfaces;
using MongoDB.Driver;

namespace backend.Services
{
    public class UserService : IUserService
    {
        private readonly DbContext _dbContext;

        public UserService(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<User> CreateUser(User user)
        {
            try
            {
                await _dbContext.Users.InsertOneAsync(user);
                return user;
            }
            catch (Exception ex) {
                throw new Exception(ex.Message);
            }
        }

        public async Task DeleteUser(string userId)
        {
            try
            {
                var filter = Builders<User>.Filter.Eq(u => u.Id, userId);
                await _dbContext.Users.DeleteOneAsync(filter);
            }
            catch (Exception ex) { 
                throw new Exception(ex.Message);
            }
        }

        public async Task<User> GetUserByEmailId(string emailId)
        {
            try
            {
                var filter = Builders<User>.Filter.Eq(u => u.Email, emailId);
                return await _dbContext.Users.Find(filter).FirstOrDefaultAsync();
            }
            catch (Exception ex) {
                throw new Exception(ex.Message);
            }
        }

        public async Task<User> GetUserById(string userId)
        {
            try
            {
                var filter = Builders<User>.Filter.Eq(u => u.Id, userId);
                return await _dbContext.Users.Find(filter).FirstOrDefaultAsync();
            }
            catch (Exception ex) {
                throw new Exception(ex.Message);
            }
        }

        public async Task<User> UpdateUser(User user, string userId)
        {
            try
            {
                var filter = Builders<User>.Filter.Eq(u => u.Id, userId);
                await _dbContext.Users.ReplaceOneAsync(filter, user);
                return user;
            }
            catch (Exception ex) {
                throw new Exception(ex.Message);
            }
        }

        public async Task<Boolean> SaveUserToken(string userId, string token)
        {
            try
            {
                var filter = Builders<User>.Filter.Eq(user => user.Id, userId);
                var update = Builders<User>.Update.Set(user => user.RefreshToken, token);
                await _dbContext.Users.UpdateOneAsync(filter, update);
                return true;
            }
            catch {
                return false;
            }
        }

        public async Task DeleteToken(string userId)
        {
            try
            {
                var filter = Builders<User>.Filter.Eq(user => user.Id, userId);
                var update = Builders<User>.Update.Set(user => user.RefreshToken, null);
                await _dbContext.Users.UpdateOneAsync(filter, update);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }
    }
}
