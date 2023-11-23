using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using prid_2324_a02.Models;
using prid_2324_a02.Helpers;

namespace prid_2324_a02.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class QuizzesController : ControllerBase
{
	private readonly PridContext _context;
	private readonly IMapper _mapper;

	public QuizzesController(PridContext context, IMapper mapper)
	{
		_context = context;
		_mapper = mapper;
	}

	[Authorized(Role.Student, Role.Teacher)]
	[HttpGet("{id:int}")]
	public async Task<ActionResult<QuizzDTO>> GetOne(int id)
	{
		var quizz = await _context.Quizzes.Include(q => q.Database).SingleOrDefaultAsync(q => q.Id == id);
		if (quizz == null)
			return NotFound();
		return _mapper.Map<QuizzDTO>(quizz);
	}

	[Authorized(Role.Teacher)]
	[HttpGet("getAll")]
	public async Task<ActionResult<IEnumerable<QuizzDTO>>> GetAll()
	{
		return _mapper.Map<List<QuizzDTO>>(await _context.Quizzes.Include(q => q.Database).ToListAsync());
	}

	[Authorized(Role.Student, Role.Teacher)]
	[HttpGet("getTrainings")]
	public async Task<ActionResult<IEnumerable<QuizzDTO>>> GetTrainings()
	{
		return _mapper.Map<List<QuizzDTO>>(await _context.Quizzes
			.Include(q => q.Database)
			.Where(q => !q.IsTest && q.IsPublished).ToListAsync());
	}

	[Authorized(Role.Student, Role.Teacher)]
	[HttpGet("getTests")]
	public async Task<ActionResult<IEnumerable<QuizzDTO>>> GetTests()
	{
		return _mapper.Map<List<QuizzDTO>>(await _context.Quizzes
			.Include(q => q.Database)
			.Where(q => q.IsTest && q.IsPublished).ToListAsync());
	}
}