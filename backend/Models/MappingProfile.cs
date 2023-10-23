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
	}
}