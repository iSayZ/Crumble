import "./styles/News.css"
import { useEffect, useState } from "react";
import { useMain } from "../contexts/MainContext";
import { useAuth } from "../contexts/AuthContext";
import PublicationCard from "../components/Index/PublicationCard/PublicationCard";
import myAxios from "../services/myAxios";

function News() {
    const { refresh } = useMain();
    const { auth } = useAuth();
    const [publications, setPublications] = useState();

    useEffect(
        () => {
        const getData = async () => {
                try {
                const response = await myAxios(`/api/publications/all/${auth.account.id_account}`)
                setPublications(response.data)
                } catch (error) {
                console.error(error)
                }
        }

        if (auth.account.id_account) {
            getData();
        };
        }, [auth.account, refresh]
    )

    return (
        <div className="news-page">
            {publications ? 
            publications.map((publication) =>
            <PublicationCard key={publication.id_publication} publication={publication} />
            )
            :
            <p>Aucunes publications disponibles.</p>
            }
        </div>
    )
}

export default News;