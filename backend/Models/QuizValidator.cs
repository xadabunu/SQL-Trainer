using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace prid_2324_a02.Models;

public partial class QuizValidator : AbstractValidator<Quiz>
{
    private readonly PridContext _context;

    public QuizValidator(PridContext context)
    {
        _context = context;

        RuleFor(q => q.Name.Trim())
            .NotEmpty()
            .MinimumLength(3)
            .DependentRules(() => {
                RuleFor(q => new { q.Name, q.Id })
                .MustAsync((q, token) => BeUniqueName(q.Name, q.Id, token))
                .OverridePropertyName(nameof(Quiz.Name))
                .WithMessage("'{PropertyName}' must be unique.");
            });
        
        RuleFor(q => q.Questions)
            .Must(questions => questions != null && questions.Any())
            .WithMessage("Quiz must have at least 1 question.");
        
        RuleForEach(q => q.Questions).SetValidator(new QuestionValidator(context));
    }

    private async Task<bool> BeUniqueName(string name, int id, CancellationToken token) {
        return !await _context.Quizzes.AnyAsync(q => q.Name == name && q.Id != id);
    }
}