using Microsoft.AspNetCore.Mvc;
using AuthService.Data;
using AuthService.DTOs;
using AuthService.Models;
using AuthService.Services;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;

namespace AuthService.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly JwtService _jwtService;

        public AuthController(AppDbContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                return BadRequest(new { Message = "Email is already taken!" });
            }

            if (!Enum.TryParse<Role>(request.Role, true, out var roleEnum))
            {
                return BadRequest(new { Message = "Invalid Role!" });
            }

            var user = new User
            {
                Name = request.Name,
                Email = request.Email,
                Phone = request.Phone,
                Role = roleEnum,
                Password = BCrypt.Net.BCrypt.HashPassword(request.Password)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "User registered successfully!" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
            {
                return Unauthorized(new { Message = "Invalid email or password." });
            }

            var token = _jwtService.GenerateToken(user);
            var roles = new[] { "ROLE_" + user.Role.ToString() };

            user.RefreshToken = Guid.NewGuid().ToString();
            user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Token = token,
                RefreshToken = user.RefreshToken,
                Id = user.Id,
                Email = user.Email,
                Roles = roles
            });
        }
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null) return Ok(new { Message = "If that email exists, a reset link was sent." }); // Security best practice

            user.ResetToken = Guid.NewGuid().ToString();
            user.ResetTokenExpiry = DateTime.UtcNow.AddHours(1);
            await _context.SaveChangesAsync();

            // MOCK EMAIL SENDING
            Console.WriteLine($"\n[MOCK EMAIL] Password Reset Link for {user.Email}: http://localhost:5173/reset-password?token={user.ResetToken}\n");

            return Ok(new { Message = "If that email exists, a reset link was sent." });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.ResetToken == request.Token);
            
            if (user == null || user.ResetTokenExpiry < DateTime.UtcNow)
            {
                return BadRequest(new { Message = "Invalid or expired token." });
            }

            user.Password = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            user.ResetToken = null;
            user.ResetTokenExpiry = null;
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Password reset successfully!" });
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.RefreshToken == request.RefreshToken);

            if (user == null || user.RefreshTokenExpiry < DateTime.UtcNow)
            {
                return Unauthorized(new { Message = "Invalid or expired refresh token." });
            }

            var newToken = _jwtService.GenerateToken(user);
            user.RefreshToken = Guid.NewGuid().ToString(); // Rotate refresh token
            user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
            await _context.SaveChangesAsync();

            var roles = new[] { "ROLE_" + user.Role.ToString() };

            return Ok(new
            {
                Token = newToken,
                RefreshToken = user.RefreshToken,
                Id = user.Id,
                Email = user.Email,
                Roles = roles
            });
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            // Note: In a production app, we would add [Authorize(Roles = "Admin")] here.
            var users = await _context.Users
                .Select(u => new UserResponse
                {
                    Id = u.Id,
                    Name = u.Name,
                    Email = u.Email,
                    Phone = u.Phone,
                    Role = u.Role.ToString()
                })
                .ToListAsync();
            
            return Ok(users);
        }
    }
}
