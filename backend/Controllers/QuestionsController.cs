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
            .FindAsync(id);
        if (question == null)
            return NotFound();

        var dto = _mapper.Map<QuestionDTO>(question);
        var temp = _context.Questions
            .Where(q => q.QuizzId == dto.QuizzId && q.Order == dto.Order - 1)
            .SingleOrDefault();
        dto.Previous = temp?.Id ?? 0;
        temp = _context.Questions
            .Where(q => q.QuizzId == dto.QuizzId && q.Order == dto.Order + 1)
            .SingleOrDefault();
        dto.Next = temp?.Id ?? 0;
        var answer = _context.Answers
            .Where(a => a.QuestionId == id && a.Attempt.Author.Pseudo == User.Identity!.Name)
            .SingleOrDefaultAsync();
        
        dto.Answer = _mapper.Map<AnswerDTO>(answer);
        var quiz = _context.Quizzes.Find(dto.QuizzId);
        dto.QuizTitle = quiz!.Name;
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