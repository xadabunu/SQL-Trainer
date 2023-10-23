using System.ComponentModel.DataAnnotations;
using prid_2324_a02.Models;

namespace prid_2324_a02;

public class Answer
{
	[Key]
	int Id { get; set; }
	string Sql { get; set; } = null!;
	DateTimeOffset Timestamp { get; set; }
	bool IsCorrect { get; }

	Attempt Attempt { get; } = null!;
	Question Question { get; } = null!;
}