namespace prid_2324_a02.Models;

public class AttemptDTO
{
	public int Id { get; set; }
	public DateTimeOffset? Start { get; set; }
	public DateTimeOffset? Finish { get; set; }

	public UserDTO? Author { get; set; } = null!;
	public QuizDTO? Quiz { get; set; } = null!;
	public int QuizId { get; set; }
}

public class AttemptForAnswerDTO
{
	public int Id { get; set; }
	public int AuthorId { get; set; }
	public int QuizId { get; set; }
	public DateTimeOffset? Finish { get; set; }
}