import "./styles/SearchResult.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import FriendshipCard from "../components/Index/FriendshipCard/FriendshipCard";
import PublicationCard from "../components/Index/PublicationCard/PublicationCard";
import myAxios from "../services/myAxios";

function SearchResult() {
  const { auth } = useAuth();

  const [searchResult, setSearchResult] = useState();
  const { query } = useParams();
  const location = useLocation();

  useEffect(() => {
    const getData = async () => {
      const result = await myAxios.get(
        `/api/search/${auth.account.id_account}/${query}`
      );
      setSearchResult(result.data);
    };

    if (auth.account) {
      getData();
    }
  }, [auth.account, query, location]);

  return (
    <div className="search-page">
      {searchResult && (
        <>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <h3>Résultat des utilisateurs</h3>
              {searchResult.users.length > 0 ? (
                <span className="bubble-count">
                  {searchResult.users.length}
                </span>
              ) : (
                ""
              )}
            </AccordionSummary>
            <AccordionDetails>
              <div className="friendships-container">
                {searchResult.users && searchResult.users.length > 0 ? (
                  searchResult.users.map((user) => (
                    <FriendshipCard
                      key={user.id_user}
                      user={user}
                      noDelete
                    />
                  ))
                ) : (
                  <p>Aucun résultat</p>
                )}
              </div>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <h3>Résultat des publications</h3>
              {searchResult.publications.length > 0 ? (
                <span className="bubble-count">
                  {searchResult.publications.length}
                </span>
              ) : (
                ""
              )}
            </AccordionSummary>
            <AccordionDetails>
              <div className="publications-container">
                {searchResult.publications &&
                searchResult.publications.length > 0 ? (
                  searchResult.publications.map((publication) => (
                    <PublicationCard
                      key={publication.id_publication}
                      publication={publication}
                    />
                  ))
                ) : (
                  <p>Aucun résultat</p>
                )}
              </div>
            </AccordionDetails>
          </Accordion>
        </>
      )}
    </div>
  );
}

export default SearchResult;
