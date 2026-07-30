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
