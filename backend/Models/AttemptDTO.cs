namespace prid_2324_a02.Models;

public class AttemptDTO
{
	public int Id { get; set; }
	public DateTimeOffset? Start { get; set; }
	public DateTimeOffset? Finish { get; set; }

	public UserDTO Author { get; set; } = null!;
	public QuizzDTO Quizz { get; set; } = null!;
	public int QuizId { get; set; }
}