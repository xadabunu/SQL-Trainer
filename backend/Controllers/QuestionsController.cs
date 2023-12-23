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
public class QuestionsController : ControllerBase
{
    private readonly PridContext _context;
    private readonly IMapper _mapper;

    public QuestionsController(PridContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [Authorized(Role.Student)]
    [HttpGet("{id}")]
    public async Task<ActionResult<QuestionDTO>> GetOne(int id)
    {
        var question = await _context.Questions
            .Include(q => q.Solutions)
            .Include(q => q.Quiz)
            .ThenInclude(q => q.Database)
            .SingleOrDefaultAsync(q => q.Id == id);
        if (question == null)
            return NotFound();

        var quiz = question.Quiz;
        var dto = _mapper.Map<QuestionDTO>(question);
        dto.Quiz = _mapper.Map<QuizForQuestionDTO>(quiz);
        dto.Quiz.IsClosed = quiz.Finish != null && quiz.Finish < new DateTimeOffset();
        var temp = await _context.Questions
            .Where(q => q.QuizId == dto.Quiz.Id && q.Order == dto.Order - 1)
            .SingleOrDefaultAsync();
        dto.Previous = temp?.Id ?? 0;

        temp = await _context.Questions
            .Where(q => q.QuizId == dto.Quiz.Id && q.Order == dto.Order + 1)
            .SingleOrDefaultAsync();
        dto.Next = temp?.Id ?? 0;

        var user = _context.Users.SingleOrDefault(u => u.Pseudo == User.Identity!.Name);

        dto.Attempt = _mapper.Map<AttemptForAnswerDTO>(
                        await _context.Attempts
                        .Where(a => a.AuthorId == user!.Id && a.QuizId == quiz.Id)
                        .OrderBy(a => a.Id)
                        .LastOrDefaultAsync()
                    );
        var answer = await _context.Answers
            .Include(a => a.Attempt)
            .Where(a => a.QuestionId == id && a.Attempt.Id == dto.Attempt.Id)
            .SingleOrDefaultAsync();
        
        dto.Answer = _mapper.Map<AnswerDTO>(answer);
        if (quiz.IsTest && quiz.Finish >= DateTimeOffset.Now && dto.Attempt.Finish != null) {
            question.Solutions.Clear();
        }
        return dto;
    }

    [Authorized(Role.Student)]
    [HttpGet("getAnswer/{questionId}")]
    public async Task<ActionResult<AnswerDTO>> GetAnswer(int questionId)
    {
        var user = _context.Users.SingleOrDefault(u => u.Pseudo == User.Identity!.Name);

        var answer = await _context.Answers
            .SingleOrDefaultAsync(a => a.QuestionId == questionId && a.Attempt.AuthorId == user!.Id);
        return _mapper.Map<AnswerDTO>(answer);
    }
}