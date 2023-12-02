using FluentValidation;

namespace prid_2324_a02.Models;

public partial class QuestionValidator : AbstractValidator<Question>
{
    private readonly PridContext _context;

    public QuestionValidator(PridContext context)
    {
        _context = context;

        RuleFor(q => q.Body.Trim())
            .NotNull()
            .Length(2);
        
        RuleFor(q => q.Solutions)
            .Must(solutions => solutions != null && solutions.Any())
            .WithMessage("Question must have at least 1 solution.");
        
        RuleForEach(q => q.Solutions).SetValidator(new SolutionValidator(context));
    }
}

public partial class SolutionValidator : AbstractValidator<Solution>
{
    public SolutionValidator(PridContext context) {
        RuleFor(s => s.Sql.Trim()).NotNull().NotEmpty();
    }
}