import "./styles/News.css";
import { useEffect, useState } from "react";
import { useMain } from "../contexts/MainContext";
import { useAuth } from "../contexts/AuthContext";
import PublicationCard from "../components/Index/Publication/Publication";
import myAxios from "../services/myAxios";

function News() {
  const { refresh } = useMain();
  const { auth } = useAuth();
  const [publications, setPublications] = useState();
  const [connectedProfile, setConnectedProfile] = useState();

  useEffect(() => {
    const getData = async () => {
      try {
        const responsePublication = await myAxios(
          `/api/publications/all/${auth.account.id_account}`
        );
        setPublications(responsePublication.data);
        const profile = await myAxios.get(
          `/api/users/${auth.account.id_user_fk}`
        );
        setConnectedProfile(profile.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (auth.account.id_account) {
      getData();
    }
  }, [auth.account, refresh]);

  return (
    <div className="news-page">
      {publications && connectedProfile ? (
        publications.map((publication) => (
          <PublicationCard
            key={publication.id_publication}
            publication={publication}
            connectedProfile={connectedProfile}
          />
        ))
      ) : (
        <p>Aucunes publications disponibles.</p>
      )}
    </div>
  );
}

export default News;
