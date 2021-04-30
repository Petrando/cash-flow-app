import React, {useEffect} from 'react';
import TablePagination from '@material-ui/core/TablePagination';

export default function TablePaging({handlePageChange, page, count}) {
  //const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  useEffect(()=>{

  }, [count]);
  /*const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };*/

  const handleChangeRowsPerPage = (event) => {
    //setRowsPerPage(parseInt(event.target.value, 10));
    //setPage(0);
  };

  return (
    <TablePagination
      component="div"
      count={count}
      page={page}
      onChangePage={(e, newPage) =>handlePageChange(newPage)}  
      rowsPerPage={rowsPerPage}    
      rowsPerPageOptions={[5]}
      onChangeRowsPerPage={handleChangeRowsPerPage}
    />
  );
}

//rowsPerPage={rowsPerPage}
//onChangeRowsPerPage={handleChangeRowsPerPage}