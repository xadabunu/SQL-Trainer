using System.ComponentModel.DataAnnotations;

namespace prid_2324_a02.Models;

public class Quizz
{
	[Key]
	public int Id { get; set; }
	public string Name { get; set; } = null!;
	public string? Description { get; set; }
	public int DatabaseId { get; set; }
	public Database Database { get; set; } = null!;
	public bool IsPublished { get; set; }
	public bool IsClosed { get; set; } = false;
	public bool IsTest { get; set; } = false;
	public DateTimeOffset? Start { get; set; }
	public DateTimeOffset? Finish { get; set; }

	public virtual ICollection<Attempt> Attempts { get; set; } = new HashSet<Attempt>();
	public virtual ICollection<Question> Questions { get; set; } = new HashSet<Question>();
}