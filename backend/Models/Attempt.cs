using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace prid_2324_a02.Models;

public class Attempt
{
	[Key]
	public int Id { get; set; }
	public DateTimeOffset? Start { get; set; }
	public DateTimeOffset? Finish { get; set; }

	public Student? Author { get; }
	public Quizz? Quizz { get; }

	public virtual ICollection<Answer> Answers { get; set; } = new HashSet<Answer>();
}