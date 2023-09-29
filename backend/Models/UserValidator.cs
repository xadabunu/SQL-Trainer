using System.Text.RegularExpressions;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration.UserSecrets;
using Microsoft.IdentityModel.Tokens;

namespace prid_2324_a02.Models;

public partial class UserValidator : AbstractValidator<User>
{
	private readonly PridContext _context;

	public UserValidator(PridContext context)
	{
		_context = context;

		RuleFor(u => u.Pseudo)
			.NotEmpty()
			//.Length(3, 10)
			.Matches("^[a-zA-Z][a-zA-Z0-9_]{2,9}$") // \w == [a-zA-Z0-9_] => ^"[a-zA-Z]\w{2,8}"$
			.DependentRules(() => {
				RuleFor(u => new { u.Pseudo, u.Id })
					.MustAsync((u, token) => BeUniquePseudo(u.Pseudo, u.Id, token))
					.OverridePropertyName(nameof(User.Pseudo))
					.WithMessage("'{PropertyName}' must be unique.");
			});

		RuleFor(u => u.Password)
			.NotEmpty()
			.Length(3, 10);

		RuleFor(u => u.Email)
			.NotEmpty()
			.Matches(@"[a-zA-Z0-9-_.]+@([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]{2,4}")
			//.EmailAddress()
			.MustAsync(async (mail, token) => !await _context.Users.AnyAsync(u => u.Email == mail));

		RuleFor(u => new { u.FirstName, u.LastName, u.Id })
			.Must(u => u.FirstName.IsNullOrEmpty() == u.LastName.IsNullOrEmpty())
			.DependentRules(() => {
				RuleFor(u => u.FirstName)
					.Must(name => ValidName(name));
				RuleFor(u => u.LastName)
					.Must(name => ValidName(name));
			})
			.OverridePropertyName(nameof(User.FirstName))
			.WithMessage("First and last name can not be empty if the other isn't.")
			.DependentRules(() => {
				RuleFor(u => new { u.FirstName, u.LastName, u.Id})
					.MustAsync((user, token) => BeUniqueFullName(user.FirstName, user.LastName, user.Id, token))
					.OverridePropertyName(nameof(User.FirstName))
					.WithMessage("'{PropertyName}' must be unique.");
			});

		RuleSet("create", () => {

		});
	}

	public async Task<FluentValidation.Results.ValidationResult> ValidateOnCreate(User user) {
		return await this.ValidateAsync(user, o => o.IncludeRuleSets("default", "create"));
	}

    private async Task<bool> BeUniquePseudo(string pseudo, int id, CancellationToken token) {
        return !await _context.Users.AnyAsync(u => u.Pseudo == pseudo && u.Id != id);
    }

	private bool ValidFullName(string? firstname, string? lastname, int id) {

		if (firstname.IsNullOrEmpty() && lastname.IsNullOrEmpty())
			return true;
		/*
		 * additionnal checking
		 */
		return true;
	}

	private async Task<bool> BeUniqueFullName(string? firstname, string? lastname, int id, CancellationToken token) {
		if (!firstname.IsNullOrEmpty())
			return true;
		return !await _context.Users.AnyAsync(u => u.FirstName == firstname && u.LastName == lastname && u.Id != id);
	}

	private static bool ValidName(string? name) {
		if (name == null)
			return true;
		if (name[0] == ' ' || name[0] == '\t' || name[^1] == ' ' || name[^1] == '\t')
			return false;
		return MyRegex().Match(name).Success;
	}

    [GeneratedRegex(".{3,50}")]
    private static partial Regex MyRegex();
}
