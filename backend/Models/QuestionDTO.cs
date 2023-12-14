namespace prid_2324_a02.Models;

public class QuestionDTO
{
	public int Id { get; set; }
	public int Order { get; set; }
	public string Body { get; set; } = null!;

	public AnswerDTO? Answer { get; set; } = null;
	public QuizForQuestionDTO? Quiz { get; set; } = null;

	public virtual ICollection<SolutionDTO> Solutions { get; set; } = new HashSet<SolutionDTO>();

	public int Previous { get; set; }
	public int Next { get; set; }
}