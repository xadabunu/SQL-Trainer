using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using prid_2324_a02.Helpers;
using prid_2324_a02.Models;

namespace prid_2324_a02.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class AttemptsController : ControllerBase
{
    private readonly PridContext _context;
    private readonly IMapper _mapper;

    public AttemptsController(PridContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    // [Authorized(Role.Student)]
	[AllowAnonymous]
    [HttpPost]
    public async Task<ActionResult> CreateAttempt(AttemptDTO dto)
	{
		var quiz = await _context.Quizzes.FindAsync(dto.Quiz.Id);

		if (quiz == null)
			return NotFound();

		var attempt = _mapper.Map<Attempt>(dto);
		// var result = await new AttemptValidator(_context).ValidateAsync(attempt);
		// if (result.IsValid)
		// 	return BadRequest();
		_context.Attemps.Add(attempt);

		await _context.SaveChangesAsync();
		return NoContent();
	}
}