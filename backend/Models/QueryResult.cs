namespace prid_2324_a02.Models;

public class QueryResult
{
    public bool? IsCorrect { get; set; }
    public string? SqlError { get; set; }
    public string[] Errors { get; set; } = new string[2];
    public int RowCount { get; set; }
    public int ColumnCount { get; set; }
    public string[]? Columns { get; set; }
    public string[][]? Data { get; set; }

    public static bool operator ==(QueryResult qr1, QueryResult qr2) {
        if (qr1.ColumnCount == qr2.ColumnCount && qr1.RowCount == qr2.RowCount) {
            string[] qr1_flat = qr1.Data.SelectMany(a => a).OrderBy(s => s).ToArray();
            string[] qr2_flat = qr2.Data.SelectMany(a => a).OrderBy(s => s).ToArray();
            return qr1_flat.SequenceEqual(qr2_flat);
        }
        return false;
    }

    public static bool operator !=(QueryResult qr1, QueryResult qr2) {
        return !(qr1 == qr2);
    }
}