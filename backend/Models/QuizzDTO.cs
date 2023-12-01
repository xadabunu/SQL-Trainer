namespace prid_2324_a02.Models;

public class QuizzDTO
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
}

public class QuizzWithQuestionsDTO : QuizzDTO
{
	public virtual ICollection<Question> Questions { get; set; } = new HashSet<Question>();
}