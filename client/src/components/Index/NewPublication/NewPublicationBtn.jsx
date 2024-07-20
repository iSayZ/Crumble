import "./NewPublication.css"
import { usePublication } from "../../../contexts/PublicationContext";

function NewPublicationBtn() {
  const { handleShowNewPublication } = usePublication();
    return (
      <button type="button" onClick={handleShowNewPublication} className="new-publication-btn btn">
        Créer une publication
      </button>
    )
  }

  export default NewPublicationBtn;