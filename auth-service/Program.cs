using AuthService.Data;
using AuthService.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure MySQL Database
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// Add JwtService
builder.Services.AddScoped<JwtService>();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    
    // Seed Professional Dummy Accounts for all Roles
    if (!context.Users.Any(u => u.Email == "admin@cargox.com"))
    {
        // 1. Admin
        context.Users.Add(new AuthService.Models.User { Name = "Marcus Thorne", Email = "admin@cargox.com", Phone = "555-0199", Role = AuthService.Models.Role.ADMIN, Password = BCrypt.Net.BCrypt.HashPassword("password123") });
        // 2. Customer
        context.Users.Add(new AuthService.Models.User { Name = "Emily Chen", Email = "emily.chen@cargox.com", Phone = "555-0188", Role = AuthService.Models.Role.CUSTOMER, Password = BCrypt.Net.BCrypt.HashPassword("password123") });
        // 3. Warehouse Manager
        context.Users.Add(new AuthService.Models.User { Name = "Robert Vance", Email = "rvance@cargox.com", Phone = "555-0177", Role = AuthService.Models.Role.WAREHOUSE_MANAGER, Password = BCrypt.Net.BCrypt.HashPassword("password123") });
        // 4. Professional Delivery Agent
        context.Users.Add(new AuthService.Models.User { Name = "Sarah Jenkins", Email = "sjenkins@cargox.com", Phone = "555-0166", Role = AuthService.Models.Role.DELIVERY_AGENT, Password = BCrypt.Net.BCrypt.HashPassword("password123") });
        
        context.SaveChanges();
        Console.WriteLine("✅ Seeded Professional Dummy Accounts.");
    }

    if (!context.Users.Any(u => u.Email == "agent1@logistics.com"))
    {
        for (int i = 1; i <= 10; i++)
        {
            context.Users.Add(new AuthService.Models.User
            {
                Name = $"Delivery Agent {i}",
                Email = $"agent{i}@logistics.com",
                Phone = $"555-010{i:D2}",
                Role = AuthService.Models.Role.DELIVERY_AGENT,
                Password = BCrypt.Net.BCrypt.HashPassword("password123")
            });
        }
        context.SaveChanges();
        Console.WriteLine("✅ Seeded 10 Delivery Agents.");
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

app.Run();
