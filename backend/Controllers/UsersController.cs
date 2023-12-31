using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using prid_2324_a02.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using prid_2324_a02.Helpers;

namespace prid_2324.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase
{
	private readonly PridContext _context;
	private readonly IMapper _mapper;

	public UsersController(PridContext context, IMapper mapper)
	{
		_context = context;
		_mapper = mapper;
	}

	[Authorized(Role.Teacher)]
	[HttpGet]
	public async Task<ActionResult<IEnumerable<UserDTO>>> GetAll()
	{
		return _mapper.Map<List<UserDTO>>(await _context.Users.ToListAsync());
	}

	[HttpGet("{id:int}")]
	public async Task<ActionResult<UserDTO>> GetOne(int id)
	{
		var user = await _context.Users.FindAsync(id);
		if (user == null)
			return NotFound();
		return _mapper.Map<UserDTO>(user);
	}

	[HttpGet("byPseudo/{pseudo}")]
	public async Task<ActionResult<UserDTO>> GetOneByPseudo(string pseudo)
	{
		var user = await _context.Users.SingleOrDefaultAsync(u => u.Pseudo == pseudo);
		if (user == null)
			return NotFound();
		return _mapper.Map<UserDTO>(user);
	}

	[HttpGet("byEmail/{email}")]
	public async Task<ActionResult<UserDTO>> GetOneByEmail(string email)
	{
		var user = await _context.Users.SingleOrDefaultAsync(u => u.Email == email);
		if (user == null)
			return NotFound();
		return _mapper.Map<UserDTO>(user);
	}

	/**
	 * ! erreur cannot create instance of User at AutoMapper...,
	 */
	[AllowAnonymous]
	[HttpPost]
	public async Task<ActionResult<UserDTO>> PostUser(UserWithPasswordDTO user)
	{
		var newUser = _mapper.Map<User>(user);
		var result = await new UserValidator(_context).ValidateOnCreate(newUser);
		if (!result.IsValid)
			return BadRequest(result);
		_context.Users.Add(newUser);
		await _context.SaveChangesAsync();
		return CreatedAtAction(
			nameof(GetOne),
			new { id = user.Id },
			_mapper.Map<UserDTO>(newUser));
	}

	[Authorized(Role.Teacher)]
	[HttpPut]
	public async Task<IActionResult> PutUser(UserWithPasswordDTO dto)
	{
		var user = await _context.Users.FindAsync(dto.Id);
		if (user == null)
			return NotFound();

		// S'il n'y a pas de mot de passe dans le dto, on garde le mot de passe actuel
        if (string.IsNullOrEmpty(dto.Password))
            dto.Password = user.Password;

		_mapper.Map<UserWithPasswordDTO, User>(dto, user);

		var result = await new UserValidator(_context).ValidateAsync(user);
		if (!result.IsValid)
			return BadRequest(result);

		await _context.SaveChangesAsync();
		return NoContent();
	}

	[Authorized(Role.Teacher)]
	[HttpDelete("{id:int}")]
	public async Task<IActionResult> DeleteUser(int id)
	{
		var user = await _context.Users.FindAsync(id);
		if (user == null)
			return NotFound();
		_context.Users.Remove(user);
		await _context.SaveChangesAsync();
		return NoContent();
	}

    [AllowAnonymous]
    [HttpGet("available/{pseudo}")]
    public async Task<ActionResult<bool>> IsAvailable(string pseudo) {
        return await _context.Users.FindAsync(pseudo) == null;
    }

    [AllowAnonymous]
    [HttpPost("signup")]
    public async Task<ActionResult<UserDTO>> SignUp(UserWithPasswordDTO data) {
        return await PostUser(data);
    }

	[AllowAnonymous]
	[HttpPost("authenticate")]
	public async Task<ActionResult<UserDTO>> Authenticate(UserLoginDTO dto) {
		var user = await Authenticate(dto.Pseudo, dto.Password);

		var result = await new UserValidator(_context).ValidateForAuthenticate(user);
		if (!result.IsValid)
			return BadRequest(result);

		return Ok(_mapper.Map<UserDTO>(user));
	}

	private async Task<User?> Authenticate(string pseudo, string password) {
		var user = await _context.Users.SingleOrDefaultAsync(u => u.Pseudo == pseudo);

		// return null if user not found
		if (user == null)
			return null;

		if (user.Password == TokenHelper.GetPasswordHash(password)) {
			// authentication successful so generate jwt token
			var tokenHandler = new JwtSecurityTokenHandler();
			var key = Encoding.ASCII.GetBytes("my-super-secret-key");
			var tokenDescriptor = new SecurityTokenDescriptor {
				Subject = new ClaimsIdentity(new Claim[] {
						new Claim(ClaimTypes.Name, user.Pseudo),
						new Claim(ClaimTypes.Role, user.Role.ToString())
					}),
				IssuedAt = DateTime.UtcNow,
				Expires = DateTime.UtcNow.AddMinutes(60),
				SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
			};
			var token = tokenHandler.CreateToken(tokenDescriptor);
			user.Token = tokenHandler.WriteToken(token);
		}

		return user;
	}
}
