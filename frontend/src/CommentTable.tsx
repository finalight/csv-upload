import {
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

type CommentTableProps = {
  totalPages: number;
  page: number;
  handlePageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
  paginatedData: Array<Record<string, unknown>>;
};

export const CommentTable = ({
  totalPages,
  page,
  handlePageChange,
  paginatedData,
}: CommentTableProps) => {
  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="simple table">
          <TableHead>
            <TableRow>
              {Object.keys(paginatedData[0]).map((key) => (
                <TableCell key={key} align="left">
                  {key}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((item, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {Object.values(item).map((value, valueIndex) => (
                  <TableCell key={valueIndex} align="left">
                    {String(value)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        count={totalPages}
        page={page}
        onChange={handlePageChange}
        sx={{ display: "flex", justifyContent: "center", mt: 2 }}
      />
    </Paper>
  );
};
