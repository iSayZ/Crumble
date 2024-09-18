import "./styles/Settings.css";
import { Avatar } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useMain } from "../contexts/MainContext";
import RandomAlert from "../components/Index/Alert/RandomAlert";
import myAxios from "../services/myAxios";
import {
  calculateAge,
  convertToDateInputValue,
  formatDateToIsoDate,
} from "../services/calculTime";

function Settings() {
  const { auth } = useAuth();
  const { handleRefresh, refresh } = useMain();
  const [account, setAccount] = useState();

  useEffect(() => {
    const getData = async () => {
      try {
        const accountDetails = await myAxios.get(
          `/api/accounts/${auth.account.id_account}`,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
        setAccount(accountDetails.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (auth.account.id_account) {
      getData();
    }
  }, [auth.account, auth.token, refresh]);

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

  // Update Personnal Informations
  const [profileFormData, setProfileFormData] = useState();

  const [errorPersonnal, setErrorPersonnal] = useState("");

  const [editingPersonnalInfo, setEditingPersonnalInfo] = useState(false);

  // Alert for confirmation update
  const [showConfirmationAlert, setShowConfirmationAlert] = useState(false);

  const editPersonnal = () => {
    setProfileFormData(account);
    setEditingPersonnalInfo(!editingPersonnalInfo);
  };

  const cancelEditPersonnal = () => {
    setEditingPersonnalInfo(false);
  };

  const handleChangeProfileFormData = (e) => {
    const { name, value } = e.target;
    setProfileFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmitProfile = async () => {
    try {
      const updateProfile = await myAxios.put(
        `/api/users/${auth.account.id_account}`,
        {
          id_user: account.id_user,
          firstname: profileFormData.firstname,
          lastname: profileFormData.lastname,
          birthdate: formatDateToIsoDate(profileFormData.birthdate),
          biography: profileFormData.biography,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      if (updateProfile.status === 200) {
        setEditingPersonnalInfo(false);
        setErrorPersonnal("");
        handleRefresh();
        setShowConfirmationAlert(true);
      }
    } catch (error) {
      setErrorPersonnal(error.response.data.message);
      console.error(error);
    }
  };

  // Update Connexion Informations
  const [accountFormData, setAccountFormData] = useState({
    email: "",
    oldPassword: "",
    password: "",
    confirmation: "",
  });

  const [errorConnexion, setErrorConnexion] = useState("");

  const [editingConnexionInfo, setEditingConnexionInfo] = useState(false);

  const editConnexion = () => {
    setAccountFormData((prevState) => ({ ...prevState, email: account.email }));
    setEditingConnexionInfo(!editingConnexionInfo);
  };

  const [editingPwd, setEditingPwd] = useState(false);

  const editPwd = () => {
    setEditingPwd(!editingPwd);
  };

  const cancelEditConnexion = () => {
    setEditingPwd(false);
    setEditingConnexionInfo(false);
  };

  const handleChangeAccountFormData = (e) => {
    const { name, value } = e.target;
    setAccountFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmitAccount = async () => {
    if (accountFormData.password === accountFormData.confirmation) {
      try {
        const updateAccount = await myAxios.put(
          `/api/accounts/${auth.account.id_account}`,
          {
            id: account.id_account,
            email: accountFormData.email,
            oldPassword: accountFormData.oldPassword,
            password: accountFormData.password,
          },
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
        if (updateAccount.status === 200) {
          setEditingConnexionInfo(false);
          setEditingPwd(false);
          setErrorConnexion("");
          handleRefresh();
          setAccountFormData({
            email: "",
            oldPassword: "",
            password: "",
            confirmation: "",
          });
          setShowConfirmationAlert(true);
        }
      } catch (error) {
        setErrorConnexion(error.response.data.message);
        console.error(error);
      }
    } else {
      setErrorConnexion(
        "La confirmation de votre mot de passe ne correspond pas !"
      );
    }
  };

  return (
    <div className="settings-page">
      {account ? (
        <>
          <div className="settings-container">
            <div className="section-title">
              <h3>Informations personnelles</h3>
              <button
                type="button"
                className="no-btn edit-btn"
                onClick={editPersonnal}
              >
                <EditIcon sx={{ width: 20, height: 20 }} />
              </button>
            </div>
            <hr />
            {editingPersonnalInfo ? (
              <>
                <div className="personnal-details-content">
                  <div className="input-settings">
                    <label htmlFor="firstname" className="bold">
                      Prénom :{" "}
                    </label>
                    <input
                      type="text"
                      id="firstname"
                      name="firstname"
                      value={profileFormData.firstname}
                      onChange={handleChangeProfileFormData}
                    />
                  </div>
                  <div className="input-settings">
                    <label htmlFor="lastname" className="bold">
                      Nom :{" "}
                    </label>
                    <input
                      type="text"
                      id="lastname"
                      name="lastname"
                      value={profileFormData.lastname}
                      onChange={handleChangeProfileFormData}
                    />
                  </div>
                  <div className="input-settings">
                    <label htmlFor="birthdate" className="bold">
                      Date de naissance :{" "}
                    </label>
                    <input
                      type="date"
                      id="birthdate"
                      name="birthdate"
                      value={convertToDateInputValue(profileFormData.birthdate)}
                      onChange={handleChangeProfileFormData}
                    />
                  </div>
                  <div className="input-settings biography">
                    <label htmlFor="biography" className="bold">
                      Biographie :{" "}
                    </label>
                    <textarea
                      type="text"
                      id="biography"
                      name="biography"
                      rows="5"
                      cols="35"
                      value={profileFormData.biography || ""}
                      onChange={handleChangeProfileFormData}
                    />
                  </div>
                </div>
                {errorPersonnal ? (
                  <p className="error">{errorPersonnal}</p>
                ) : (
                  ""
                )}
                <hr />
                <div className="update-btn-container">
                  <button
                    type="button"
                    className="btn red update-btn"
                    onClick={cancelEditPersonnal}
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    className="btn update-btn"
                    onClick={handleSubmitProfile}
                  >
                    Enregistrer
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="settings-card">
                  <div className="settings-avatar">
                    <Avatar
                      alt={`${account.firstname} ${account.lastname}`}
                      src={account.avatar}
                      sx={{ width: 100, height: 100 }}
                    />
                  </div>
                  <div className="profile-info">
                    <h4>{account.firstname}</h4>
                    <h4>{account.lastname}</h4>
                    <div className="second-info">
                      <p>{calculateAge(account.birthdate)}</p>
                      <span id="gender">{genderToIcon(account.sex)}</span>
                    </div>
                  </div>
                </div>
                <cite>
                  "{" "}
                  {account.biography
                    ? account.biography
                    : "Ajoute ici une biographie pour compléter ton profil !"}{" "}
                  "
                </cite>
              </>
            )}
          </div>
          <div className="connexion-details">
            <div className="section-title">
              <h3>Informations de connexion</h3>
              <button
                type="button"
                className="no-btn edit-btn"
                onClick={editConnexion}
              >
                <EditIcon sx={{ width: 20, height: 20 }} />
              </button>
            </div>
            <hr />
            {editingConnexionInfo ? (
              <>
                <div className="connexion-details-content">
                  <div className="input-settings">
                    <label htmlFor="email" className="bold">
                      E-mail :{" "}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={accountFormData.email}
                      onChange={handleChangeAccountFormData}
                    />
                  </div>
                  {editingPwd ? (
                    <>
                      <div className="input-settings">
                        <label htmlFor="old-password" className="bold">
                          Ancien mot de passe :{" "}
                        </label>
                        <input
                          type="password"
                          id="old-password"
                          name="oldPassword"
                          value={accountFormData.oldPassword}
                          onChange={handleChangeAccountFormData}
                        />
                      </div>
                      <div className="input-settings">
                        <label htmlFor="new-password" className="bold">
                          Nouveau mot de passe :{" "}
                        </label>
                        <input
                          type="password"
                          id="new-password"
                          name="password"
                          value={accountFormData.password}
                          onChange={handleChangeAccountFormData}
                        />
                      </div>
                      <div className="input-settings">
                        <label htmlFor="confirmation-password" className="bold">
                          Confirmation :{" "}
                        </label>
                        <input
                          type="password"
                          id="confirmation-password"
                          name="confirmation"
                          value={accountFormData.confirmation}
                          onChange={handleChangeAccountFormData}
                        />
                      </div>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="no-btn bold edit-pwd pointer"
                      onClick={editPwd}
                    >
                      Modifier mon mot de passe
                    </button>
                  )}
                </div>
                {errorConnexion ? (
                  <p className="error">{errorConnexion}</p>
                ) : (
                  ""
                )}
                <hr />
                <div className="update-btn-container">
                  <button
                    type="button"
                    className="btn red update-btn"
                    onClick={cancelEditConnexion}
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    className="btn update-btn"
                    onClick={handleSubmitAccount}
                  >
                    Enregistrer
                  </button>
                </div>
              </>
            ) : (
                <div className="connexion-details-content">
                  <p>
                    <span className="bold">E-mail :</span> {account.email}
                  </p>
                  <p>
                    <span className="bold">Mot de passe :</span> **********
                  </p>
                </div>
            )}
          </div>
        </>
      ) : (
        ""
      )}
      <RandomAlert
        openState={showConfirmationAlert}
        closingFunction={() => setShowConfirmationAlert(false)}
        content="Les modifications ont bien été enregistrées !"
      />
    </div>
  );
}

export default Settings;
