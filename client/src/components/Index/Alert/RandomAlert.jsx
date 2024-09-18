import PropTypes from 'prop-types';
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

function RandomAlert({ openState, closingFunction, content }) {
  return (
    <Snackbar
      open={openState}
      autoHideDuration={6000}
      onClose={closingFunction}
    >
      <Alert
        onClose={closingFunction}
        severity="success"
        variant="filled"
        sx={{ width: "100%" }}
      >
        {content}
      </Alert>
    </Snackbar>
  );
}

RandomAlert.propTypes = {
  openState: PropTypes.bool.isRequired,
  closingFunction: PropTypes.func.isRequired,
  content: PropTypes.node.isRequired,
};

export default RandomAlert;
