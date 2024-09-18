import "./styles/Profile.css";
import { Avatar } from "@mui/material";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useMain } from "../contexts/MainContext";
import PublicationCard from "../components/Index/Publication/Publication";
import Popup from "../components/Index/Popup/Popup";
import { calculateAge } from "../services/calculTime";
import myAxios from "../services/myAxios";

function Profile() {
  const { auth } = useAuth();
  const { id } = useParams();
  const { handleRefresh, refresh } = useMain();

  const [profile, setProfile] = useState();
  const [publicationsProfile, setPublicationsProfile] = useState();

  const [connectedProfile, setConnectedProfile] = useState();

  useEffect(() => {
    const getData = async () => {
      try {
        const profileInformations = await myAxios.get(
          `/api/accounts/profile/${id}/${auth.account.id_account}`
        );
        setProfile(profileInformations.data);

        const profilePublications = await myAxios.get(
          `/api/publications/profile/${id}`
        );
        setPublicationsProfile(profilePublications.data);

        const profileData = await myAxios.get(
          `/api/users/${auth.account.id_user_fk}`
        );
        setConnectedProfile(profileData.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (auth.account.id_user_fk) {
      getData();
    }
  }, [id, auth.account, refresh]);

  // Convert the gender to icon
  const genderToIcon = (gender) => {
    if (gender === "male") {
      return (
        <MaleIcon
          sx={{
            color: "#34b6e2",
            width: 22,
            height: 22,
            display: "flex",
            alignItems: "center",
          }}
        />
      );
    } 
    if (gender === "female") {
      return (
        <FemaleIcon
          sx={{
            color: "#de3cb8",
            width: 22,
            height: 22,
            display: "flex",
            alignItems: "center",
          }}
        />
      );
    } 
  
    return (
      <TransgenderIcon
        sx={{
          color: "#3cde65",
          width: 22,
          height: 22,
          display: "flex",
          alignItems: "center",
        }}
      />
    );
  };

  // For remove a friendship
  const handleDeleteFriendship = async () => {
    await myAxios.delete(
      `/api/friendships/${auth.account.id_account}/${profile.friendship_exists}`,
      {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );
    handleRefresh();
  };

  // For add a friend request
  const handleAddFriend = async () => {
    try {
      const response = await myAxios.post(
        "/api/friends-requests",
        {
          id_account: auth.account.id_account,
          id_recipient: profile.id_account,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      console.info(response.data);
      handleRefresh();
    } catch (error) {
      console.error(error);
    }
  };

  // For upload a coverage
  const [coverage, setCoverage] = useState();
  const [coverageUrl, setCoverageUrl] = useState();
  const [badExtension, setBadExtension] = useState(false);

  // Reference for file input element
  const CoverageInputRef = useRef(null);

  // Function to open the file picker
  const handleEditCoverage = () => {
    CoverageInputRef.current.click();
  };

  function getExtension(filename) {
    const lastDotIndex = filename.lastIndexOf(".");
    return lastDotIndex !== -1 ? filename.substring(lastDotIndex + 1) : "";
  }

  // Function to handle the selected file
  const handleCoverageChange = (event) => {
    const file = event.target.files[0];
    const extension = getExtension(file.name);
    const allowedExtensions = ["png", "jpg", "jpeg", "webp"];
    if (allowedExtensions.includes(extension) && file.size <= 7000000) {
      setCoverage(file);

      if (file) {
        // Create a preview URL for the image
        const objectUrl = URL.createObjectURL(file);
        setCoverageUrl(objectUrl);
      }
    } else {
      setBadExtension(true);
    }
  };

  const cancelChangeCoverage = () => {
    setCoverage("");
    setCoverageUrl("");
  };

  const handleUploadCoverage = async (image) => {
    if (!image) {
      console.error("No image selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);
    formData.append("id_user", auth.account.id_user_fk);

    // Send formData to upload picture
    try {
      await myAxios.post("/api/upload/coverage", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setCoverage("");
    } catch (err) {
      console.error("Error uploading file:", err);
    }
  };

  // Function for close popup extension image error
  const handleCloseError = () => {
    setBadExtension(false);
  };

  // For upload an avatar
  const [avatar, setAvatar] = useState();
  const [avatarUrl, setAvatarUrl] = useState();
  // Reference for file input element
  const avatarInputRef = useRef(null);

  // Function to open the file picker
  const handleEditAvatar = () => {
    avatarInputRef.current.click();
  };

  // Function to handle the selected file
  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    const extension = getExtension(file.name);
    const allowedExtensions = ["png", "jpg", "jpeg", "webp"];
    if (allowedExtensions.includes(extension) && file.size <= 7000000) {
      setAvatar(file);

      if (file) {
        // Create a preview URL for the image
        const objectUrl = URL.createObjectURL(file);
        setAvatarUrl(objectUrl);
      }
    } else {
      setBadExtension(true);
    }
  };

  const cancelChangeAvatar = () => {
    setAvatar("");
    setAvatarUrl("");
  };

  const handleUploadAvatar = async (image) => {
    if (!image) {
      console.error("No image selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);
    formData.append("id_user", auth.account.id_user_fk);

    // Send formData to upload picture
    try {
      await myAxios.post("/api/upload/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setAvatar("");
      setTimeout(() => {
        handleRefresh();
      }, 1000);
    } catch (err) {
      console.error("Error uploading file:", err);
    }
  };

  return (
    <div className="profile-page">
      {profile && (
        <>
          <div className="profile-container">
            <div className="profile-header">
              <div className="profile-coverage">
                <img
                  src={coverageUrl || profile.coverage}
                  alt={`Couverture de profil de ${profile.firstname} ${profile.lastname}`}
                />
                {profile.id_account === auth.account.id_account ? (
                  !coverage ? (
                    <>
                      <button
                        type="button"
                        onClick={handleEditCoverage}
                        className="no-btn edit-btn pointer"
                      >
                        <EditIcon sx={{ width: 18, height: 18 }} />
                      </button>
                      <input
                        type="file"
                        ref={CoverageInputRef}
                        style={{ display: "none" }}
                        onChange={handleCoverageChange}
                      />
                    </>
                  ) : (
                    <div className="coverage-btn">
                      <button
                        type="button"
                        className="btn green pointer"
                        onClick={() => handleUploadCoverage(coverage)}
                      >
                        <DoneIcon />
                      </button>
                      <button
                        type="button"
                        className="btn red pointer"
                        onClick={cancelChangeCoverage}
                      >
                        <CloseIcon />
                      </button>
                    </div>
                  )
                ) : null}
              </div>
              <div className="profile-details">
                <div className="pointer profile-avatar">
                  <Avatar
                    alt={`${profile.firstname} ${profile.lastname}`}
                    src={avatarUrl || profile.avatar}
                    sx={{ width: 120, height: 120 }}
                  />
                  {profile.id_account === auth.account.id_account ? (
                  !avatar ? (
                    <>
                      <button
                        type="button"
                        onClick={handleEditAvatar}
                        className="no-btn edit-btn pointer"
                      >
                        <EditIcon sx={{ width: 18, height: 18 }} />
                      </button>
                      <input
                        type="file"
                        ref={avatarInputRef}
                        style={{ display: "none" }}
                        onChange={handleAvatarChange}
                      />
                    </>
                  ) : (
                    <div className="avatar-btn">
                      <button
                        type="button"
                        className="btn green pointer"
                        onClick={() => handleUploadAvatar(avatar)}
                      >
                        <DoneIcon />
                      </button>
                      <button
                        type="button"
                        className="btn red pointer"
                        onClick={cancelChangeAvatar}
                      >
                        <CloseIcon />
                      </button>
                    </div>
                  )
                ) : null}
                </div>
                <div className="profile-info">
                  {profile.id_account === auth.account.id_account ? (
                    <Link to="/parametres" className="no-btn edit-btn pointer">
                      <EditIcon sx={{ width: 18, height: 18 }} />
                    </Link>
                  ) : (
                    ""
                  )}
                  <h3>
                    {profile.firstname} {profile.lastname}
                  </h3>
                  <div className="second-info">
                    <p>{calculateAge(profile.birthdate)}</p>
                    <span id="gender">{genderToIcon(profile.sex)}</span>
                  </div>
                </div>
                {profile.biography ? (
                  <>
                    <hr />
                    <div className="profile-biography">
                      <cite>" {profile.biography} "</cite>
                    </div>
                  </>
                ) : (
                  ""
                )}
                {profile.id_account === auth.account.id_account ? (
                  ""
                ) : (
                  <>
                    <hr />
                    <div className="profile-button">
                      {profile.friendship_exists ? (
                        <button
                          type="button"
                          className="btn red"
                          onClick={handleDeleteFriendship}
                        >
                          Supprimer l'amitié{" "}
                          <span className="icon-friend-btn">
                            <PersonRemoveIcon sx={{ width: 18, height: 18 }} />
                          </span>
                        </button>
                      ) : profile.friend_request_exists ? (
                        <button
                          type="button"
                          className="btn green"
                          disabled
                        >
                          Demande en attente
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn green"
                          onClick={handleAddFriend}
                        >
                          Ajouter en ami{" "}
                          <span className="icon-friend-btn">
                            <PersonAddIcon sx={{ width: 18, height: 18 }} />
                          </span>
                        </button>
                      )}
                      <Link
                        to={`/conversation/${auth.account.id_account}/${profile.id_account}`}
                        className="btn"
                      >
                        Envoyer un message
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="profile-publication">
            <h2>Activité récente</h2>
            {publicationsProfile &&
            connectedProfile &&
            publicationsProfile.length > 0 ? (
              publicationsProfile.map((publication) => (
                <PublicationCard
                  key={publication.id_publication}
                  publication={publication}
                  connectedProfile={connectedProfile}
                />
              ))
            ) : (
              <p>Aucunes publications pour le moment...</p>
            )}
          </div>
        </>
      )}
      {badExtension && (
        <Popup
          closePopup={handleCloseError}
          title="Erreur : Format d'image non valide"
          content="L'image que vous avez sélectionnée doit être au format PNG, JPEG/JPG ou WEBP.<br><br>Veuillez vérifier l'extension de votre fichier et réessayer avec un format supporté."
          choiceTwo="D'accord"
          actionTwo={handleCloseError}
        />
      )}
    </div>
  );
}

export default Profile;
