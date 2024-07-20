import "./BurgerMenuIndex.css"
import { Link } from "react-router-dom";
import ProfilCard from "../../Index/ProfileCard/ProfileCard";
import NewPublicationBtn from "../../Index/NewPublication/NewPublicationBtn";

function BurgerMenuIndex() {

    return (
        <div className="burger-menu-index">
            <div className="profile-container">
                <ProfilCard />
            </div>
            <hr />
            <NewPublicationBtn />
            <hr />
            <nav>
                <Link to="/">A propos</Link>
                <Link to="/">Contact</Link>
            </nav>
        </div>
    )
}

export default BurgerMenuIndex;