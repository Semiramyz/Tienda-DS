using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using Tienda_DS.Server.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.PropertyNamingPolicy = null;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure DbContext
builder.Services.AddDbContext<TiendaSdContext>(options => 
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    if (string.IsNullOrEmpty(connectionString))
    {
        throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
    }
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString))
           .EnableSensitiveDataLogging()
           .LogTo(Console.WriteLine, Microsoft.Extensions.Logging.LogLevel.Information);
});

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Test database connection at startup
try
{
    using (var scope = app.Services.CreateScope())
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<TiendaSdContext>();
        if (dbContext.Database.CanConnect())
        {
            Console.WriteLine("✅ Database connection successful!");
        }
        else
        {
            Console.WriteLine("❌ Cannot connect to database");
        }
    }
}
catch (Exception ex)
{
    Console.WriteLine($"❌ Database connection failed: {ex.Message}");
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHttpsRedirection();
}

// Servir archivos estáticos primero
app.UseDefaultFiles();
app.UseStaticFiles();

// CORS debe ir DESPUÉS de routing
app.UseRouting();
app.UseCors();

app.UseAuthorization();

// Mapear controladores de API
app.MapControllers();

// Fallback para Angular solo para rutas que NO son API
app.MapFallbackToFile("/index.html");

Console.WriteLine($"🚀 Backend running on: {app.Urls.FirstOrDefault()}");
Console.WriteLine("📍 API endpoints available at: /api/*");

app.Run();

