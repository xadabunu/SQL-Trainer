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

    public bool HasSameData(QueryResult other) {
        if (this.Data == null && other.Data == null)
            return true;
        if (this.ColumnCount == other.ColumnCount && this.RowCount == other.RowCount) {
            string[] qr1_flat = this.Data!.SelectMany(a => a).OrderBy(s => s).ToArray();
            string[] qr2_flat = other.Data!.SelectMany(a => a).OrderBy(s => s).ToArray();
            return qr1_flat.SequenceEqual(qr2_flat);
        }
        return false;
    }
}