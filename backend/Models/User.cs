using System.ComponentModel.DataAnnotations;

namespace prid_2324_a02.Models;

public class User
{
	[Key]
	public int Id { get; set; }
	public string Pseudo { get; set; } = null!; //déclenche une exception si valeur non fournie
	public string Password { get; set; } = null!;
	public string Email { get; set; } = null!;
	public string? LastName { get; set; }
	public string? FirstName { get; set; }
	public DateTimeOffset? BirthDate { get; set; }

	public string? FullName => FirstName + " " + LastName;	

	public int? Age {
		get {
			if (!BirthDate.HasValue)
				return null;
			var today = DateTime.Today;
			var age = today.Year - BirthDate.Value.Year;
			if (BirthDate.Value.Date > today.AddYears(-age))
				--age;
			return age; 
		}
	}
}

/*

{
  "pseudo": "cestmoi",
  "email": "cestmoi@epfc.eu",
  "password": "cestmoi"
}

*/
