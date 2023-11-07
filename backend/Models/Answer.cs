using System.ComponentModel.DataAnnotations;
using prid_2324_a02.Models;

namespace prid_2324_a02;

public class Answer
{
	[Key]
	public int Id { get; set; }
	public string Sql { get; set; } = null!;
	public DateTimeOffset Timestamp { get; set; }
	public bool IsCorrect { get; }

	public Attempt Attempt { get; } = null!;
	public Question Question { get; } = null!;

}