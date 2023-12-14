using System.Data;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MySql.Data.MySqlClient;
using prid_2324_a02.Helpers;
using prid_2324_a02.Models;
using RouteAttribute = Microsoft.AspNetCore.Mvc.RouteAttribute;

namespace prid_2324_a02.Controllers;

public class ForQuery {
	public string DbName { get; set; } = null!;
	public string Query { get; set; } = null!;
}

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class DatabasesController : ControllerBase
{
	private readonly PridContext _context;
	private readonly IMapper _mapper;

	public DatabasesController(PridContext context, IMapper mapper)
	{
		_context = context;
		_mapper = mapper;
	}

	[Authorized(Role.Teacher)]
	[HttpGet("getAll")]
	public async Task<ActionResult<IEnumerable<DatabaseDTO>>> GetAll()
	{
		return _mapper.Map<List<DatabaseDTO>>(await _context.Databases.ToListAsync());
	}

	// [Authorized(Role.Student)]
	[AllowAnonymous]
	[HttpPost("executeQuery")]
	public async Task<ActionResult<QueryResult>> ExecuteQuery(ForQuery forquery)
	{
		QueryResult queryResult = new();
		QueryResult solutionResult = new();

		string solution = "SELECT * FROM S"; // todo: get solution

		using MySqlConnection connection = new($"server=localhost;database=" + forquery.DbName + ";uid=root;password=root");
		DataTable table;

		try
		{
			connection.Open();
			MySqlCommand command = new("SET sql_mode = 'STRICT_ALL_TABLES'; " + forquery.Query, connection);
			MySqlDataAdapter adapter = new(command);
			table = new DataTable();
			adapter.Fill(table);
			GetData(queryResult, table);

			command = new("SET sql_mode = 'STRICT_ALL_TABLES'; " + solution, connection);
			adapter = new(command);
			table = new DataTable();
			adapter.Fill(table);
			GetData(solutionResult, table);
			CheckData(queryResult, solutionResult);
		}
		catch (MySqlException sqlException)
		{
			queryResult.SqlError = sqlException.Message;
		}
		catch (Exception e)
		{
			return StatusCode(500, new { Error = e.Message });
		}

		return queryResult;
	}

	private static void CheckData(QueryResult attempt, QueryResult solution) {
		int index = 0;
		
		if (attempt.RowCount != solution.RowCount)
			attempt.Errors[index++] = "Nombre de colonnes incorrect";
		if (attempt.ColumnCount != solution.ColumnCount)
			attempt.Errors[index++] = "Nombre de lignes incorrect";
		
		if (index == 0) {
			if (attempt != solution)
				attempt.Errors[index] = "Données incorrectes";
			else {
				attempt.IsCorrect = true;
				return;
			}
		}
		attempt.IsCorrect = false;
	}

	private static void GetData(QueryResult queryResult, DataTable table)
	{
		// Récupère les noms des colonnes dans un tableau de strings
		queryResult.RowCount = table.Rows.Count;
		queryResult.ColumnCount = table.Columns.Count;
		queryResult.Columns = new string[queryResult.ColumnCount];
		for (int i = 0; i < table.Columns.Count; ++i)
			queryResult.Columns[i] = table.Columns[i].ColumnName;

		// Récupère les données dans un tableau de strings à deux dimensions
		queryResult.Data = new string[table.Rows.Count][];
		for (int j = 0; j < table.Rows.Count; ++j)
		{
			queryResult.Data[j] = new string[table.Columns.Count];
			for (int i = 0; i < table.Columns.Count; ++i)
			{
				object value = table.Rows[j][i];
				string str;
				if (value == null)
					str = "NULL";
				else
				{
					if (value is DateTime d)
					{
						if (d.TimeOfDay == TimeSpan.Zero)
							str = d.ToString("yyyy-MM-dd");
						else
							str = d.ToString("yyyy-MM-dd hh:mm:ss");
					}
					else
						str = value?.ToString() ?? "";
				}
				queryResult.Data[j][i] = str;
			}
		}
	}
}
