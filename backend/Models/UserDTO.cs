using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace prid_2324_a02.Models;

public class UserDTO
{
	[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
	public int Id { get; private set; }
	public string Pseudo { get; set; } = "";
	public string Email { get; set; } = "";
	public string? FirstName { get; set; }
	public string? LastName { get; set; }
	public DateTimeOffset? BirthDate { get; set; }
}

public class UserWithPasswordDTO : UserDTO
{
	public string Password { get; set; } = "";
}
