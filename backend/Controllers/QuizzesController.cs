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
		var quizz = await _context.Quizzes
		.Include(q => q.Database)
		// .Include(q => q.Questions).ThenInclude(q => q.Solutions)
		// .AsNoTracking()
		.SingleOrDefaultAsync(q => q.Id == id);
		if (quizz == null)
			return NotFound();
		quizz.Editable = !await _context.Attemps.AnyAsync(a => a.QuizzId == quizz.Id);
		return _mapper.Map<QuizzDTO>(quizz);
	}

	[Authorized(Role.Teacher)]
	[HttpGet("getAll")]
	public async Task<ActionResult<IEnumerable<QuizzDTO>>> GetAll()
	{
		var list = await _context.Quizzes
			.Include(q => q.Database)
			.ToListAsync();

		return _mapper.Map<List<QuizzDTO>>(
			list.Select(q => {
				var now = DateTime.Now;
				q.Status = !q.IsPublished ? "PAS PUBLIE" : ((q.IsTest && now > q.Finish!.Value) ? "CLOTURE" : "PUBLIE");
				return q;
			})
			);
	}

	[Authorized(Role.Student, Role.Teacher)]
	[HttpGet("getTrainings")]
	public async Task<ActionResult<IEnumerable<QuizzDTO>>> GetTrainings()
	{
		var user = _context.Users.SingleOrDefault(u => u.Pseudo == User.Identity!.Name);

		var list = await _context.Quizzes
        	.Include(q => q.Database)
			.Include(q => q.Questions)
        	.Where(q => !q.IsTest && q.IsPublished)
        	.ToListAsync();

		return _mapper.Map<List<QuizzDTO>>(
			list.Select(q => {
				var firstQuestion = q.Questions.FirstOrDefault(q => q.Order == 1);
				q.FirstQuestionId = firstQuestion?.Id ?? 0;
				var attempt = _context.Attemps
                                .SingleOrDefault(a => a.QuizzId == q.Id && a.AuthorId == user!.Id);
				return q.AddStatus(attempt);
			}));
	}

	[Authorized(Role.Student, Role.Teacher)]
	[HttpGet("getTests")]
	public async Task<ActionResult<IEnumerable<QuizzDTO>>> GetTests()
	{
		var user = _context.Users.SingleOrDefault(u => u.Pseudo == User.Identity!.Name);

		var list = await _context.Quizzes
        	.Include(q => q.Database)
			.Include(q => q.Questions)
        	.Where(q => q.IsTest && q.IsPublished)
        	.ToListAsync();

		return _mapper.Map<List<QuizzDTO>>(
			list.Select(q => {
				var firstQuestion = q.Questions.FirstOrDefault(q => q.Order == 1);
				q.FirstQuestionId = firstQuestion?.Id ?? 0;
				var attempt = _context.Attemps
					.Include(a => a.Answers)
                    .SingleOrDefault(a => a.QuizzId == q.Id && a.AuthorId == user!.Id);
				if (attempt != null) {
					var points = attempt.Answers.Count(a => a.IsCorrect);
					var total = q.Questions.Count;
					q.Evaluation = "" + points * 10 / total + "/10";
				}
				return q.AddStatus(attempt);
			}));
	}

	[Authorized(Role.Student, Role.Teacher)]
	[HttpGet("getQuestions/{quizId:int}")]
	public async Task<ActionResult<IEnumerable<QuestionDTO>>> GetQuestions(int quizId)
	{
		return _mapper.Map<List<QuestionDTO>>(
			await _context.Questions
				.Include(q => q.Solutions)
				.OrderBy(q =>q .Order)
				.Where(q => q.QuizzId == quizId).ToListAsync()
		);
	}

	[Authorized(Role.Teacher)]
	[HttpGet("byName/{name}")]
	public async Task<ActionResult<QuizzDTO>> ByName(string name)
	{
		var quizz = await _context.Quizzes
		.SingleOrDefaultAsync(q => q.Name == name);
		// if (quizz == null)
		// 	return NotFound();
		return _mapper.Map<QuizzDTO>(quizz);
	}

	/**
	 * !On ne rentre pas dans la méthode
	 */
	[Authorized(Role.Teacher)]
	[HttpPut]
	public async Task<IActionResult> PutQuiz(QuizzWithQuestionsDTO dto)
	{
		var quizz = await _context.Quizzes.FindAsync(dto.Id);

		if (quizz == null) return NotFound();

		_mapper.Map<QuizzWithQuestionsDTO, Quizz>(dto, quizz);

		var result = await new QuizValidator(_context).ValidateAsync(quizz);
		if (!result.IsValid)
			return BadRequest(result);
		
		await _context.SaveChangesAsync();
		return NoContent();
	}
}