namespace prid_2324_a02.Models;

public class QuizzDTO
{
	public int Id { get; set; }
	public string Name { get; set; } = null!;
	public string? Description { get; set; }
	public bool IsPublished { get; set; }
	public bool IsClosed { get; set; }
	public bool IsTest { get; set; }
	public DateTimeOffset? Start { get; set; }
	public DateTimeOffset? Finish { get; set; }
		
}