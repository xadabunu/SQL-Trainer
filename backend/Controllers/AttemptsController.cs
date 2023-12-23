using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

    [Authorized(Role.Student)]
	[HttpPost]
    public async Task<ActionResult> CreateAttempt(AttemptDTO dto)
	{
		var quiz = await _context.Quizzes.FindAsync(dto.Quiz.Id);

		if (quiz == null)
			return NotFound();

		dto.QuizId = quiz.Id;
		var user = await _context.Users.SingleAsync(u => u.Pseudo == User.Identity!.Name);
		dto.Author = _mapper.Map<UserDTO>(user);

		var attempt = _mapper.Map<Attempt>(dto);

		// var result = await new AttemptValidator(_context).ValidateAsync(attempt);
		// if (result.IsValid)
		// 	return BadRequest();
		_context.Attempts.Add(attempt);

		await _context.SaveChangesAsync();
		return NoContent();
	}

	[Authorized(Role.Student)]
	[HttpPost("close")]
	public async Task<ActionResult> CloseAttempt(AttemptDTO dto)
	{
		var attempt = await _context.Attempts.FindAsync(dto.Id);
		
		var user = await _context.Users.SingleAsync(u => u.Pseudo == User.Identity!.Name);
		if (attempt.AuthorId != user.Id)
			return BadRequest("Not the author" + attempt.AuthorId + " - " + user.Id);
		
		attempt.Finish = DateTimeOffset.Now;
		await _context.SaveChangesAsync();

		return NoContent();
	}
}