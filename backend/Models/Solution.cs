using System.ComponentModel.DataAnnotations;

namespace prid_2324_a02.Models;

public class Solution
{
	[Key]
	public int Id { get; set; }
	public int Order { get; set; }
	public string Sql { get; set; } = null!;

	public int QuestionId { get; set; }
}