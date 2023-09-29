using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using prid_2324_a02.Models;
using AutoMapper;

namespace prid_2324.Controllers;

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

	[HttpGet]
	public async Task<ActionResult<IEnumerable<UserDTO>>> GetAll()
	{
		return _mapper.Map<List<UserDTO>>(await _context.Users.ToListAsync());
	}

	[HttpGet("{id}")]
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
		//var user = await _context.Users.FindAsync(pseudo);
		var user = await _context.Users.FirstOrDefaultAsync(u => u.Pseudo == pseudo);
		if (user == null)
			return NotFound();
		return _mapper.Map<UserDTO>(user);
	}

	[HttpGet("byEmail/{email}")]
	public async Task<ActionResult<UserDTO>> GetOneByEmail(string email)
	{
		var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
		if (user == null)
			return NotFound();
		return _mapper.Map<UserDTO>(user);
	}

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
			new { pseudo = user.Pseudo },
			_mapper.Map<UserDTO>(newUser));
	}

	[HttpPut]
	public async Task<IActionResult> PutUser(UserDTO dto)
	{
		var user = await _context.Users.FindAsync(dto.Id);
		if (user == null)
			return NotFound();

		_mapper.Map<UserDTO, User>(dto, user);

		var result = await new UserValidator(_context).ValidateAsync(user);
		if (!result.IsValid)
			return BadRequest(result);

		await _context.SaveChangesAsync();
		return NoContent();
	}

	[HttpDelete("{id}")]
	public async Task<IActionResult> DeleteUser(int id)
	{
		var user = await _context.Users.FindAsync(id);
		if (user == null)
			return NotFound();
		_context.Users.Remove(user);
		await _context.SaveChangesAsync();
		return NoContent();
	}
}
