using System;
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
		modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
		modelBuilder.Entity<User>().HasIndex(u => new { u.FirstName, u.LastName}).IsUnique();

		modelBuilder.Entity<User>().HasData(
			new Teacher {
				Id = 1,
				Pseudo = "admin",
				Password = "admin",
				Email = "admin@epfc.eu",
				Role = Role.Admin
			},
			new Student { 
				Id = 2,
				Pseudo = "ben",
				Password = "ben",
				Email = "benoit@epfc.eu",
				FirstName = "Benoît",
				LastName = "Penelle",
				BirthDate = new DateTime(1970, 1, 2) },
			new Student { Id = 3, Pseudo = "alain", Password = "alain", Email = "alain@epfc.eu", FirstName = "Alain", LastName = "Silovy" },
			new Student { Id = 4, Pseudo = "xavier", Password = "xavier", Email = "xavier@epfc.eu", FirstName = "Xavier", LastName = "Pigeolet" },
			new Student { Id = 5, Pseudo = "boris", Password = "boris", Email = "boris@epfc.eu", FirstName = "Boris", LastName = "Verhaegen" },
			new Student { Id = 6, Pseudo = "marc", Password = "marc", Email = "marc@epfc.eu", FirstName = "Marc", LastName = "Michel" },
			new Student { Id = 7, Pseudo = "bruno", Password = "bruno", Email = "bruno@epfc.eu", FirstName = "Bruno", LastName = "Lacroix", BirthDate = new DateTime(1971, 2, 3) }
		);
	}

	public DbSet<User> Users => Set<User>();
	public DbSet<Answer> Answers => Set<Answer>();
	public DbSet<Attempt> Attemps => Set<Attempt>();
	public DbSet<Database> Databases => Set<Database>();
	public DbSet<Question> Questions => Set<Question>();
	public DbSet<Quizz> Quizzes => Set<Quizz>();
	public DbSet<Solution> Solutions => Set<Solution>();
}
