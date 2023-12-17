using System.Data;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using prid_2324_a02.Helpers;
using prid_2324_a02.Models;
using RouteAttribute = Microsoft.AspNetCore.Mvc.RouteAttribute;

namespace prid_2324_a02.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class DatabasesController : ControllerBase
{
	private readonly PridContext _context;
	private readonly IMapper _mapper;

	public DatabasesController(PridContext context, IMapper mapper)
	{
		_context = context;
		_mapper = mapper;
	}

	[Authorized(Role.Teacher)]
	[HttpGet("getAll")]
	public async Task<ActionResult<IEnumerable<DatabaseDTO>>> GetAll()
	{
		return _mapper.Map<List<DatabaseDTO>>(await _context.Databases.ToListAsync());
	}
}
