using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace prid_2324_a02.Models;

public class Attempt
{
	[Key]
	int Id { get; set; }
	DateTimeOffset? Start { get; set; }
	DateTimeOffset? Finish { get; set; }

	Student Author { get; }
	Quizz Quizz { get; }

	public virtual ICollection<Answer> Answers { get; set; } = new HashSet<Answer>();
}