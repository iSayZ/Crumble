import "./styles/PublicationPage.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Publication from "../components/Index/Publication/Publication";
import myAxios from "../services/myAxios";

function PublicationPage() {
  const { id } = useParams();
  const { auth } = useAuth();
  const [publication, setPublication] = useState();

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await myAxios.get(`/api/publications/${id}`);
        setPublication(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    getData();
  }, [id]);

  return (
    <div className="publication-page">
      {publication && auth.account && (
        <Publication
          publication={publication}
          connectedProfile={auth.account}
        />
      )}
    </div>
  );
}

export default PublicationPage;
