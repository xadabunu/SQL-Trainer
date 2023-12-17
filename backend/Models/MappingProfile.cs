using AutoMapper;

namespace prid_2324_a02.Models;

public class MappingProfile : Profile
{
	private readonly PridContext _context;

	public MappingProfile(PridContext context)
	{
		_context = context;

		CreateMap<User, UserDTO>();
		CreateMap<UserDTO, User>();

		CreateMap<User, UserWithPasswordDTO>();
		CreateMap<UserWithPasswordDTO, User>();

		CreateMap<UserLoginDTO, User>();
		CreateMap<User, UserLoginDTO>();

		CreateMap<Quiz, QuizDTO>();
		CreateMap<QuizDTO, Quiz>();

		CreateMap<Question, QuestionDTO>();
		CreateMap<QuestionDTO, Question>();

		CreateMap<Quiz, QuizWithQuestionsDTO>();
		CreateMap<QuizWithQuestionsDTO, Quiz>();

		CreateMap<Solution, SolutionDTO>();
		CreateMap<SolutionDTO, Solution>();

		CreateMap<Database, DatabaseDTO>();
		CreateMap<DatabaseDTO, Database>();

		CreateMap<Answer, AnswerDTO>();
		CreateMap<AnswerDTO, Answer>();

		CreateMap<QuizForQuestionDTO, Quiz>();
		CreateMap<Quiz, QuizForQuestionDTO>();

		CreateMap<Attempt, AttemptDTO>();
		CreateMap<AttemptDTO, Attempt>();

		CreateMap<Attempt, AttemptForAnswerDTO>();
		CreateMap<AttemptForAnswerDTO, Attempt>();
	}
}