namespace prid_2324_a02.Models;

public class AnswerDTO
{
    public int Id { get; set; }
	public string Sql { get; set; } = null!;
	public DateTimeOffset Timestamp { get; set; }
	public bool IsCorrect { get; set; }

	public AttemptForAnswerDTO Attempt { get; set; } = null!;
	public QuestionDTO? Question { get; set; } = null!;
}