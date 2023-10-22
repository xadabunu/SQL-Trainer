namespace prid_2324_a02.Models;

public class UserDTO
{
	public int Id { get; set; }
	public string Pseudo { get; set; } = null!;
	public string Email { get; set; } = null!;
	public string? FirstName { get; set; }
	public string? LastName { get; set; }
	public DateTimeOffset? BirthDate { get; set; }

	public Role Role { get; set; }
	public string? Token { get; set; }
}

public class UserWithPasswordDTO : UserDTO
{
	public string Password { get; set; } = null!;
}
