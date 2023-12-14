using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace prid_2324_a02.Models;

public class Quiz
{
	[Key]
	public int Id { get; set; }
	public string Name { get; set; } = null!;
	public string? Description { get; set; }
	public int DatabaseId { get; set; }
	public Database Database { get; set; } = null!;
	public bool IsPublished { get; set; }
	public bool IsClosed { get; set; } = false;
	public bool IsTest { get; set; } = false;
	public DateTimeOffset? Start { get; set; }
	public DateTimeOffset? Finish { get; set; }

	public virtual ICollection<Attempt> Attempts { get; set; } = new HashSet<Attempt>();
	public virtual ICollection<Question> Questions { get; set; } = new HashSet<Question>();

	[NotMapped]
	public string? Status { get; set; } = null;
	[NotMapped]
	public bool Editable { get; set; } = true;
	[NotMapped]
	public int FirstQuestionId { get; set; }
	[NotMapped]
	public string? Evaluation { get; set; }

	public Quiz AddStatus(Attempt? attempt) {

		if (IsTest) {
			var today = DateTime.Now;
			if (Start!.Value > today) {
				Status = "A VENIR";
				return this;
			}
			if (Finish!.Value < today)
				Status = "CLOTURE";
			else
				SetStatusForAttempt(attempt);
			return this;
		}
		SetStatusForAttempt(attempt);
		return this;
	}

	private void SetStatusForAttempt(Attempt? attempt) {
		if (attempt == null) {
			Status = "PAS COMMENCE";
			return ;
		}
		if (attempt.Finish != null)
			Status = "FINI";
		else
			Status = "EN COURS";
	}
}