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

		modelBuilder.Entity<Answer>().HasIndex(a => a.Id).IsUnique();
		modelBuilder.Entity<Question>().HasIndex(q => q.Id).IsUnique();
		modelBuilder.Entity<Quizz>().HasIndex(q => q.Id).IsUnique();
		modelBuilder.Entity<Database>().HasIndex(d => d.Id).IsUnique();

		modelBuilder.Entity<Teacher>().HasData(
			new Teacher {
				Id = 1,
				Pseudo = "admin",
				Password = "admin",
				Email = "admin@epfc.eu",
				Role = Role.Admin
			}
		);

		modelBuilder.Entity<Student>().HasData(
			new Student { 
				Id = 2,
				Pseudo = "ben",
				Password = "ben",
				Email = "benoit@epfc.eu",
				FirstName = "Benoît",
				LastName = "Penelle",
				BirthDate = new DateTime(1970, 1, 2)
			},
			new Student { Id = 3, Pseudo = "alain", Password = "alain", Email = "alain@epfc.eu", FirstName = "Alain", LastName = "Silovy" },
			new Student { Id = 4, Pseudo = "xavier", Password = "xavier", Email = "xavier@epfc.eu", FirstName = "Xavier", LastName = "Pigeolet" },
			new Student { Id = 5, Pseudo = "boris", Password = "boris", Email = "boris@epfc.eu", FirstName = "Boris", LastName = "Verhaegen" },
			new Student { Id = 6, Pseudo = "marc", Password = "marc", Email = "marc@epfc.eu", FirstName = "Marc", LastName = "Michel" },
			new Student {
				Id = 7,
				Pseudo = "bruno",
				Password = "bruno",
				Email = "bruno@epfc.eu",
				FirstName = "Bruno",
				LastName = "Lacroix",
				BirthDate = new DateTime(1971, 2, 3)
			}
		);

		Database fournisseurs_db = new() { Id = 1, Name = "fournisseurs" };
		Database facebook_db = new() { Id = 2, Name = "facebook" };

		modelBuilder.Entity<Database>().HasData(
			fournisseurs_db,
			facebook_db
		);

		modelBuilder.Entity<Quizz>().HasData(
			new Quizz {
				Id = 1,
				Name = "TP1",
				IsPublished = true,
				IsClosed = false,
				IsTest = false,
				DatabaseId = fournisseurs_db.Id
			},
			new Quizz {
				Id = 2,
				Name = "TP2",
				IsPublished = true,
				IsClosed = false,
				IsTest = false,
				DatabaseId = fournisseurs_db.Id
			},
			new Quizz {
				Id = 3,
				Name = "TP3",
				IsPublished = true,
				IsClosed = false,
				IsTest = false,
				DatabaseId = facebook_db.Id
			},
			new Quizz {
				Id = 4,
				Name = "TEST1",
				IsPublished = true,
				IsClosed = true,
				IsTest = true,
				Start = new DateTime(2023, 10, 20),
				Finish = new DateTime(2023, 10, 21),
				DatabaseId = fournisseurs_db.Id
			},
			new Quizz {
				Id = 5,
				Name = "TEST2",
				IsPublished = true,
				IsClosed = false,
				IsTest = true,
				Start = new DateTime(2023, 10, 21),
				Finish = new DateTime(2023, 10, 23),
				DatabaseId = fournisseurs_db.Id
			},
			new Quizz {
				Id = 6,
				Name = "TEST3",
				IsPublished = true,
				IsClosed = false,
				IsTest = true,
				Start = new DateTime(2023, 10, 22),
				Finish = new DateTime(2023, 10, 24),
				DatabaseId = facebook_db.Id
			}
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
