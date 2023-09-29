using Microsoft.EntityFrameworkCore;

namespace prid_2324_a02.Models;

public class PridContext : DbContext
{
	public PridContext(DbContextOptions<PridContext> options) : base(options)
	{
	}

	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		base.OnModelCreating(modelBuilder);

		modelBuilder.Entity<User>().HasIndex(u => u.Id).IsUnique();

		modelBuilder.Entity<User>().HasData(
			new User { 
				Id = 1,
				Pseudo = "ben",
				Password = "ben",
				Email = "benoit@epfc.eu",
				FirstName = "Benoît",
				LastName = "Penelle" },
			new User { Id = 2, Pseudo = "bruno", Password = "bruno", Email = "bruno@epfc.eu", FirstName = "Bruno", LastName = "Lacroix" },
			new User { Id = 3, Pseudo = "alain", Password = "alain", Email = "alain@epfc.eu", FirstName = "Alain", LastName = "Silovy" },
			new User { Id = 4, Pseudo = "xavier", Password = "xavier", Email = "xavier@epfc.eu", FirstName = "Xavier", LastName = "Pigeolet" },
			new User { Id = 5, Pseudo = "boris", Password = "boris", Email = "boris@epfc.eu", FirstName = "Boris", LastName = "Verhaegen" },
			new User { Id = 6, Pseudo = "marc", Password = "marc", Email = "marc@epfc.eu", FirstName = "Marc", LastName = "Michel" }
		);
	}

	public DbSet<User> Users => Set<User>();
}
