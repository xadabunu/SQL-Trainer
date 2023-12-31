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
	public async Task<ActionResult<QuizDTO>> GetOne(int id)
	{
		var quiz = await _context.Quizzes
		.Include(q => q.Database)
		.Include(q => q.Questions.OrderBy(q => q.Order))
		.ThenInclude(q => q.Solutions.OrderBy(s => s.Order))
		.SingleOrDefaultAsync(q => q.Id == id);
		if (quiz == null)
			return NotFound();
		quiz.Editable = !await _context.Attempts.AnyAsync(a => a.QuizId == quiz.Id);
		return _mapper.Map<QuizWithQuestionsDTO>(quiz);
	}

	[Authorized(Role.Teacher)]
	[HttpGet("getAll")]
	public async Task<ActionResult<IEnumerable<QuizDTO>>> GetAll()
	{
		var list = await _context.Quizzes
			.Include(q => q.Database)
			.ToListAsync();

		return _mapper.Map<List<QuizDTO>>(
			list.Select(q => {
				var now = DateTime.Now;
				q.Status = !q.IsPublished ? "PAS PUBLIE" : ((q.IsTest && now > q.Finish!.Value) ? "CLOTURE" : "PUBLIE");
				return q;
			})
			);
	}

	[Authorized(Role.Student, Role.Teacher)]
	[HttpGet("getTrainings")]
	public async Task<ActionResult<IEnumerable<QuizDTO>>> GetTrainings()
	{
		var user = _context.Users.SingleOrDefault(u => u.Pseudo == User.Identity!.Name);

		var list = await _context.Quizzes
        	.Include(q => q.Database)
			.Include(q => q.Questions)
        	.Where(q => !q.IsTest && q.IsPublished)
        	.ToListAsync();

		return _mapper.Map<List<QuizDTO>>(
			list.Select(q => {
				var firstQuestion = q.Questions.FirstOrDefault(q => q.Order == 1);
				q.FirstQuestionId = firstQuestion?.Id ?? 0;
				var attempt = _context.Attempts
                                .SingleOrDefault(a => a.QuizId == q.Id && a.AuthorId == user!.Id && a.Finish == null);
				return q.AddStatus(attempt);
			}));
	}

	[Authorized(Role.Student, Role.Teacher)]
	[HttpGet("getTests")]
	public async Task<ActionResult<IEnumerable<QuizDTO>>> GetTests()
	{
		var user = _context.Users.SingleOrDefault(u => u.Pseudo == User.Identity!.Name);

		var list = await _context.Quizzes
        	.Include(q => q.Database)
			.Include(q => q.Questions)
        	.Where(q => q.IsTest && q.IsPublished)
        	.ToListAsync();

		return _mapper.Map<List<QuizDTO>>(
			list.Select(q => {
				var firstQuestion = q.Questions.FirstOrDefault(q => q.Order == 1);
				q.FirstQuestionId = firstQuestion?.Id ?? 0;
				var attempt = _context.Attempts
					.Include(a => a.Answers)
                    .SingleOrDefault(a => a.QuizId == q.Id && a.AuthorId == user!.Id);
				if (attempt != null && attempt.Finish != null) {
					var answers = attempt.Answers
						.GroupBy(a => a.QuestionId)
						.Select(group => group.OrderByDescending(a => a.Timestamp).First());
					var points = answers.Count(a => a.IsCorrect);
					var total = q.Questions.Count;
					q.Evaluation = "" + points * 10 / total + "/10";
				}
				return q.AddStatus(attempt);
			}));
	}

	[Authorized(Role.Teacher)]
	[HttpGet("byName/{name}")]
	public async Task<ActionResult<QuizDTO>> ByName(string name)
	{
		var quiz = await _context.Quizzes
		.SingleOrDefaultAsync(q => q.Name == name);
		// if (quiz == null)
		// 	return NotFound();
		return _mapper.Map<QuizDTO>(quiz);
	}

	[Authorized(Role.Teacher)]
	[HttpPut]
	public async Task<IActionResult> PutQuiz(QuizWithQuestionsDTO dto)
	{
		var quiz = await _context.Quizzes
			.Include(q => q.Questions)
			.ThenInclude(q => q.Solutions)
			.Where(q => q.Id == dto.Id)
			.SingleOrDefaultAsync();

		if (quiz == null) return NotFound();

		_mapper.Map<QuizWithQuestionsDTO, Quiz>(dto, quiz);

		var result = await new QuizValidator(_context).ValidateAsync(quiz);
		if (!result.IsValid)
			return BadRequest(result);
		
		await _context.SaveChangesAsync();
		return NoContent();
	}

	[Authorized(Role.Teacher)]
	[HttpPost]
	public async Task<ActionResult> PostQuiz(QuizWithQuestionsDTO dto)
	{
		var newQuiz = _mapper.Map<Quiz>(dto);

		var result = await new QuizValidator(_context).ValidateOnCreate(newQuiz);
		if (!result.IsValid)
			return BadRequest(result.Errors);

		newQuiz.Database = null;

		_context.Quizzes.Add(newQuiz);
		await _context.SaveChangesAsync();
		return NoContent();
	}

	[Authorized(Role.Teacher)]
	[HttpDelete("{quizId}")]
	public async Task<ActionResult> DeleteQuiz(int quizId) {
		var quiz = await _context.Quizzes.FindAsync(quizId);
		if (quiz == null)
			return NotFound();
		_context.Quizzes.Remove(quiz);
		await _context.SaveChangesAsync();
		return NoContent();
	}
}