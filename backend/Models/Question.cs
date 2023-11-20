using System.ComponentModel.DataAnnotations;

namespace prid_2324_a02.Models;

public class Question
{
	[Key]
	public int Id { get; set; }
	public int Order { get; set; }
	public string Body { get; set; } = null!;

	public Quizz Quizz { get; set; } = null!;
	public int QuizzId { get; set; }

	public virtual ICollection<Solution> Solutions { get; set; } = new HashSet<Solution>();
	public virtual ICollection<Answer> Answers { get; set; } = new HashSet<Answer>();

}