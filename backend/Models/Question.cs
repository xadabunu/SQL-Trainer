using System.ComponentModel.DataAnnotations;

namespace prid_2324_a02.Models;

public class Question
{
	[Key]
	int Id { get; set; }
	int Order { get; set; }
	string Body { get; set; } = null!;

	Quizz Quizz { get; set; }

	public virtual ICollection<Solution> Solutions { get; set; } = new HashSet<Solution>();
	public virtual ICollection<Answer> Answers { get; set; } = new HashSet<Answer>();
}