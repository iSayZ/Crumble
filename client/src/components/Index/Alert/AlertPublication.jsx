import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { usePublication } from "../../../contexts/PublicationContext";

function AlertPublication() {
  const { publicationSent, handleCloseAlert } = usePublication();

  return (
    <Snackbar
      open={publicationSent}
      autoHideDuration={6000}
      onClose={handleCloseAlert}
    >
      <Alert
        onClose={handleCloseAlert}
        severity="success"
        variant="filled"
        sx={{ width: "100%" }}
      >
        Votre publication a bien été postée !
      </Alert>
    </Snackbar>
  );
}

export default AlertPublication;
