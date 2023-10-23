using System.ComponentModel.DataAnnotations;

namespace prid_2324_a02.Models;

public class Quizz
{
	[Key]
	int Id { get; set; }
	string Name { get; set; } = null!;
	string? Description { get; set; }
	bool IsPublished { get; set; }
	bool IsClosed { get; set; }
	bool IsTest { get; set; }
	DateTimeOffset? Start { get; set; }
	DateTimeOffset? Finish { get; set; }

	

	public virtual ICollection<Attempt> Attempts { get; set; } = new HashSet<Attempt>();
	public virtual ICollection<Question> Questions { get; set; } = new HashSet<Question>();
}