using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace prid_2324_a02.Models;

public class User
{
	[Key]
	//[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
	public int Id { get; set; }
	public string Pseudo { get; set; } = "";
	public string Password { get; set; } = "";
	public string Email { get; set; } = "";
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
  "firstName": null,
  "lastName": null,
  "birthDate": null,
  "password": "cestmoi"
}

*/
