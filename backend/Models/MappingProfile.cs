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

		CreateMap<Quizz, QuizzDTO>();
		CreateMap<QuizzDTO, Quizz>();

		CreateMap<Question, QuestionDTO>();
		CreateMap<QuestionDTO, Question>();

		CreateMap<Quizz, QuizzWithQuestionsDTO>();
		CreateMap<QuizzWithQuestionsDTO, Quizz>();

		CreateMap<Solution, SolutionDTO>();
		CreateMap<SolutionDTO, Solution>();

		CreateMap<Database, DatabaseDTO>();
		CreateMap<DatabaseDTO, Database>();

		CreateMap<Answer, AnswerDTO>();
		CreateMap<AnswerDTO, Answer>();

		CreateMap<QuizzForQuestionDTO, Quizz>();
		CreateMap<Quizz, QuizzForQuestionDTO>();

		CreateMap<Attempt, AttemptDTO>();
		CreateMap<AttemptDTO, Attempt>();
	}
}