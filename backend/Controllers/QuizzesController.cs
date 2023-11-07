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

	[Authorized(Role.User, Role.Admin)]
	[HttpGet]
	public async Task<ActionResult<IEnumerable<QuizzDTO>>> GetAll()
	{
		return _mapper.Map<List<QuizzDTO>>(await _context.Quizzes.ToListAsync());
	}
}