using System.ComponentModel.DataAnnotations;

namespace prid_2324_a02.Models;

public class Attempt
{
	[Key]
	public int Id { get; set; }
	public DateTimeOffset? Start { get; set; }
	public DateTimeOffset? Finish { get; set; }

	public Student Author { get; } = null!;
	public int AuthorId { get; set; }
	public Quiz Quiz { get; } = null!;
	public int QuizId { get; set; }

	public virtual ICollection<Answer> Answers { get; set; } = new HashSet<Answer>();
}