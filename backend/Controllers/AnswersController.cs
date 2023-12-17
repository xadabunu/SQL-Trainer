using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using Microsoft.EntityFrameworkCore;
using prid_2324_a02.Helpers;
using prid_2324_a02.Models;
using System.Data;

namespace prid_2324_a02.Controllers;

public class ForQuery {
	public string DbName { get; set; } = null!;
	public string Query { get; set; } = null!;
	public int QuestionId { get; set; }
}

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class AnswersController : ControllerBase
{
    private readonly PridContext _context;
    private readonly IMapper _mapper;

    public AnswersController(PridContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [Authorized(Role.Student)]
    [HttpPost]
    public async Task<ActionResult<QueryResult>> CreateAnswer(AnswerDTO dto)
    {
        var newAnswer = _mapper.Map<Answer>(dto);
        var user = _context.Users.Where(u => u.Pseudo == User.Identity!.Name).Single();

        Question question = await _context.Questions.FindAsync(dto.Question.Id);
        if (question == null)
            return BadRequest();

        Quiz quiz = await _context.Quizzes
                .Include(q => q.Database)
                .SingleAsync(q => q.Id == question.QuizId);

        newAnswer.Attempt = await _context.Attempts
                            .Where(a => a.AuthorId == user.Id && a.QuizId == quiz!.Id)
                            .SingleAsync();

        var oldAnswer = await _context.Answers
                        .SingleOrDefaultAsync(a => a.Attempt.AuthorId == user.Id && a.QuestionId == question.Id);

        if (oldAnswer != null)
        {
            oldAnswer.Sql = dto.Sql;
            dto.Timestamp = dto.Timestamp;
        }
        else
        {
            _context.Answers.Add(newAnswer);
        }

        await _context.SaveChangesAsync();

        ForQuery fq = new()
        {
            Query = dto.Sql,
            DbName = quiz.Database.Name,
            QuestionId = question.Id
        };

        return await ExecuteQuery(fq);
    }

    [Authorized(Role.Student)]
    [HttpPost("executeQuery")]
    public async Task<ActionResult<QueryResult>> ExecuteQuery(ForQuery forquery)
    {
        QueryResult queryResult = new();
        QueryResult solutionResult = new();

        if (forquery.Query == "")
        {
            queryResult.IsCorrect = false;
            queryResult.SqlError = "Requête vide";
            return queryResult;
        }

        string solution = await _context.Solutions
                            .Where(s => s.QuestionId == forquery.QuestionId)
                            .Select(s => s.Sql)
                            .FirstOrDefaultAsync() ?? "";

        if (solution == "") return BadRequest();

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

    private static void CheckData(QueryResult attempt, QueryResult solution)
    {
        int index = 0;

        if (attempt.RowCount != solution.RowCount)
            attempt.Errors[index++] = "Nombre de lignes incorrect";
        if (attempt.ColumnCount != solution.ColumnCount)
            attempt.Errors[index++] = "Nombre de colonnes incorrect";

        if (index == 0)
        {
            if (attempt != solution)
                attempt.Errors[index] = "Données incorrectes";
            else
            {
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