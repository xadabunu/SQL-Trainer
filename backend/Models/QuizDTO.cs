namespace prid_2324_a02.Models;

public class QuizDTO
{
	public int Id { get; set; }
	public string Name { get; set; } = null!;
	public string? Description { get; set; }
	public DatabaseDTO Database { get; set; } = null!;
	public bool IsPublished { get; set; }
	public bool IsClosed { get; set; }
	public bool IsTest { get; set; }
	public DateTimeOffset? Start { get; set; }
	public DateTimeOffset? Finish { get; set; }
	public string? Status { get; set; } = null;
	public bool Editable { get; set; }
	public int FirstQuestionId { get; set; }
	public string? Evaluation { get; set; }
}

public class QuizWithQuestionsDTO : QuizDTO
{
	public virtual ICollection<QuestionDTO> Questions { get; set; } = new HashSet<QuestionDTO>();
}

public class QuizForQuestionDTO
{
	public int Id { get; set; }
	public string Name { get; set; } = null!;
	public DatabaseDTO Database { get; set; } = null!;
	public bool IsClosed { get; set; }
	public bool IsTest { get; set; }
}