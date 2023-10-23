using System.ComponentModel.DataAnnotations;

namespace prid_2324_a02.Models;

public class Database
{
	[Key]
	int Id { get; set; }
	string Name { get; set; } = null!;
	string? Description { get; set; }

	public virtual ICollection<Quizz> Quizzes { get; set; } = new HashSet<Quizz>();
}