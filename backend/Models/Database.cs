using System.ComponentModel.DataAnnotations;

namespace prid_2324_a02.Models;

public class Database
{
	[Key]
	public int Id { get; set; }
	public string Name { get; set; } = null!;
	public string? Description { get; set; }

	public virtual ICollection<Quizz> Quizzes { get; set; } = new HashSet<Quizz>();
}