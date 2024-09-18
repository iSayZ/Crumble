import "./Register.css";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Checkbox from "@mui/material/Checkbox";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import myAxios from "../../../services/myAxios";

function Register() {
  const navigate = useNavigate();

  // Formdata
  const [formData, setFormData] = useState({
    lastname: "",
    firstname: "",
    sex: "",
    birthdate: "",
    country: "",
    email: "",
    password: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Privacy
  const [privacy, setPrivacy] = useState(false);

  const handleChangePrivacy = () => {
    setPrivacy(!privacy);
  };

  // Confirmation password
  const [confirmationPassword, setConfirmationPassword] = useState("");

  const handleChangeConfPassword = (event) => {
    setConfirmationPassword(event.target.value);
  };

  // Show password
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Complexity password
  const hasUpperCase = /[A-Z]/.test(formData.password);
  const hasLowerCase = /[a-z]/.test(formData.password);
  const hasNumber = /\d/.test(formData.password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);
  const isLengthValid = formData.password.length >= 10;
  const pwdIsValid =
    hasUpperCase &&
    hasLowerCase &&
    hasNumber &&
    hasSpecialChar &&
    isLengthValid;

  // Function for verify age of user
  const checkAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    // If the month difference is negative or if the month is the same but the day is later
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      return age - 1;
    }

    return age;
  };

  // Go to next step registration
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  // Function to move to the next step
  const nextStep = () => {
    setStep((prevStep) => prevStep + 1); // Increment the step
  };

  // Function to go back to the previous step
  const previousStep = () => {
    setStep((prevStep) => prevStep - 1); // Decrement the step
  };

  // Function to move to the second step
  const handleChangeStepOne = () => {
    const values =
      formData.lastname !== "" &&
      formData.firstname !== "" &&
      formData.birthdate !== "" &&
      formData.birthdate !== "";
    if (values) {
      const age = checkAge(formData.birthdate);
      if (age < 18) {
        setError("Vous devez avoir au moins 18 ans.");
      } else {
        nextStep();
        setError("");
      }
    } else {
      setError("Veuillez remplir tous les champs.");
    }
  };

  // State to show the password rules
  const [passwordRules, setPasswordRules] = useState(false);

  // Function to show the password rules
  const handlePasswordChange = (e) => {
    setPasswordRules(true);
    handleInputChange(e);
    if (pwdIsValid) {
      setPasswordRules(false);
    }
  };

  // Function to move to the third step
  const handleChangeStepTwo = () => {
    const values =
      formData.country !== "" &&
      formData.email !== "" &&
      formData.password !== "";
    if (values) {
      if (confirmationPassword === formData.password) {
        setError("");
        nextStep();
      } else {
        setError("Les mots de passes ne correspondent pas.");
      }
    } else {
      setError("Veuillez remplir tous les champs.");
    }
  };

  // Google reCaptcha
  const [captchaVal, setCaptchaVal] = useState(null);

  const handleChangeCaptcha = (val) => {
    setCaptchaVal(val);
  };

  // Post the form registration
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!captchaVal) {
      setError("Veuillez effectuer la validation captcha.");
      return;
    }

    if (privacy) {
      try {
        const response = await myAxios.post("/api/users", {
          formData,
        });
        console.info(response);
        if (response.status === 201) {
          navigate("/inscription/complete");
        }
      } catch (err) {
        setError(err.response.data.error);
        console.error(err);

      }
    } else {
      setError("Veuillez accepter les conditions d'utilisation.");
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="image-container">
          <div className="login-img">
            <img src="/assets/images/register.jpg" alt="" />
          </div>
        </div>
        <form className="register-form" onSubmit={handleSubmit}>
          <h2>Inscription</h2>
          {step === 1 && (
            <>
              <div className="register-top">
                <div>
                  <input
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Nom"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Prénom"
                    required
                  />
                </div>
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleInputChange}
                  required
                  className={
                    formData.sex === ""
                      ? "input select default"
                      : "input select selected"
                  }
                >
                  <option value="" className="default">
                    Sexe
                  </option>
                  <option value="male">Homme</option>
                  <option value="female">Femme</option>
                  <option value="other">Autre</option>
                </select>
                <div className="input-birthdate">
                  <label htmlFor="birthdate">Date de naissance :</label>
                  <input
                    type="date"
                    name="birthdate"
                    value={formData.birthdate}
                    onChange={handleInputChange}
                    className={
                      formData.birthdate === ""
                        ? "input default"
                        : "input selected"
                    }
                    placeholder="Date de naissance"
                    required
                  />
                </div>
              </div>
              <div className="register-footer">
                <p className="error">{error}</p>
                <button
                  className="btn register"
                  type="button"
                  onClick={handleChangeStepOne}
                >
                  Suivant
                </button>
                <p className="bold">Etape {step}/3</p>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <button
                aria-label="Passer à l'étape précédente"
                type="button"
                className="no-btn back_btn pointer"
                onClick={previousStep}
              >
                <ArrowBackIcon />
              </button>
              <div className="register-top">
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className={
                    formData.country === ""
                      ? "input select default"
                      : "input select selected"
                  }
                >
                  <option value="">Pays</option>
                  <option value="CA">Canada</option>
                  <option value="AF">Afghanistan</option>
                  <option value="ZA">Afrique du sud</option>
                  <option value="AX">Åland, îles</option>
                  <option value="AL">Albanie</option>
                  <option value="DZ">Algérie</option>
                  <option value="DE">Allemagne</option>
                  <option value="AD">Andorre</option>
                  <option value="AO">Angola</option>
                  <option value="AI">Anguilla</option>
                  <option value="AQ">Antarctique</option>
                  <option value="AG">Antigua et barbuda</option>
                  <option value="SA">Arabie saoudite</option>
                  <option value="AR">Argentine</option>
                  <option value="AM">Arménie</option>
                  <option value="AW">Aruba</option>
                  <option value="AU">Australie</option>
                  <option value="AT">Autriche</option>
                  <option value="AZ">Azerbaïdjan</option>
                  <option value="BS">Bahamas</option>
                  <option value="BH">Bahreïn</option>
                  <option value="BD">Bangladesh</option>
                  <option value="BB">Barbade</option>
                  <option value="BY">Bélarus</option>
                  <option value="BE">Belgique</option>
                  <option value="BZ">Belize</option>
                  <option value="BJ">Bénin</option>
                  <option value="BM">Bermudes</option>
                  <option value="BT">Bhoutan</option>
                  <option value="BO">Bolivie, l'état plurinational de</option>
                  <option value="BQ">Bonaire, saint eustache et saba</option>
                  <option value="BA">Bosnie herzégovine</option>
                  <option value="BW">Botswana</option>
                  <option value="BV">Bouvet, île</option>
                  <option value="BR">Brésil</option>
                  <option value="BN">Brunei darussalam</option>
                  <option value="BG">Bulgarie</option>
                  <option value="BF">Burkina faso</option>
                  <option value="BI">Burundi</option>
                  <option value="KY">Caïmans, îles</option>
                  <option value="KH">Cambodge</option>
                  <option value="CM">Cameroun</option>
                  <option value="CV">Cap vert</option>
                  <option value="CF">Centrafricaine, république</option>
                  <option value="CL">Chili</option>
                  <option value="CN">Chine</option>
                  <option value="CX">Christmas, île</option>
                  <option value="CY">Chypre</option>
                  <option value="CC">Cocos (keeling), îles</option>
                  <option value="CO">Colombie</option>
                  <option value="KM">Comores</option>
                  <option value="CG">Congo</option>
                  <option value="CD">
                    Congo, la république démocratique du
                  </option>
                  <option value="CK">Cook, îles</option>
                  <option value="KR">Corée, république de</option>
                  <option value="KP">
                    Corée, république populaire démocratique de
                  </option>
                  <option value="CR">Costa rica</option>
                  <option value="CI">Côte d'ivoire</option>
                  <option value="HR">Croatie</option>
                  <option value="CU">Cuba</option>
                  <option value="CW">Curaçao</option>
                  <option value="DK">Danemark</option>
                  <option value="DJ">Djibouti</option>
                  <option value="DO">Dominicaine, république</option>
                  <option value="DM">Dominique</option>
                  <option value="EG">Égypte</option>
                  <option value="SV">El salvador</option>
                  <option value="AE">Émirats arabes unis</option>
                  <option value="EC">Équateur</option>
                  <option value="ER">Érythrée</option>
                  <option value="ES">Espagne</option>
                  <option value="EE">Estonie</option>
                  <option value="US">États unis</option>
                  <option value="ET">Éthiopie</option>
                  <option value="FK">Falkland, îles (malvinas)</option>
                  <option value="FO">Féroé, îles</option>
                  <option value="FJ">Fidji</option>
                  <option value="FI">Finlande</option>
                  <option value="FR">France</option>
                  <option value="GA">Gabon</option>
                  <option value="GM">Gambie</option>
                  <option value="GE">Géorgie</option>
                  <option value="GS">
                    Géorgie du sud et les îles sandwich du sud
                  </option>
                  <option value="GH">Ghana</option>
                  <option value="GI">Gibraltar</option>
                  <option value="GR">Grèce</option>
                  <option value="GD">Grenade</option>
                  <option value="GL">Groenland</option>
                  <option value="GP">Guadeloupe</option>
                  <option value="GU">Guam</option>
                  <option value="GT">Guatemala</option>
                  <option value="GG">Guernesey</option>
                  <option value="GN">Guinée</option>
                  <option value="GW">Guinée bissau</option>
                  <option value="GQ">Guinée équatoriale</option>
                  <option value="GY">Guyana</option>
                  <option value="GF">Guyane française</option>
                  <option value="HT">Haïti</option>
                  <option value="HM">Heard et îles macdonald, île</option>
                  <option value="HN">Honduras</option>
                  <option value="HK">Hong kong</option>
                  <option value="HU">Hongrie</option>
                  <option value="IM">Île de man</option>
                  <option value="UM">
                    Îles mineures éloignées des états unis
                  </option>
                  <option value="VG">Îles vierges britanniques</option>
                  <option value="VI">Îles vierges des états unis</option>
                  <option value="IN">Inde</option>
                  <option value="ID">Indonésie</option>
                  <option value="IR">Iran, république islamique d'</option>
                  <option value="IQ">Iraq</option>
                  <option value="IE">Irlande</option>
                  <option value="IS">Islande</option>
                  <option value="IL">Israël</option>
                  <option value="IT">Italie</option>
                  <option value="JM">Jamaïque</option>
                  <option value="JP">Japon</option>
                  <option value="JE">Jersey</option>
                  <option value="JO">Jordanie</option>
                  <option value="KZ">Kazakhstan</option>
                  <option value="KE">Kenya</option>
                  <option value="KG">Kirghizistan</option>
                  <option value="KI">Kiribati</option>
                  <option value="KW">Koweït</option>
                  <option value="LA">
                    Lao, république démocratique populaire
                  </option>
                  <option value="LS">Lesotho</option>
                  <option value="LV">Lettonie</option>
                  <option value="LB">Liban</option>
                  <option value="LR">Libéria</option>
                  <option value="LY">Libye</option>
                  <option value="LI">Liechtenstein</option>
                  <option value="LT">Lituanie</option>
                  <option value="LU">Luxembourg</option>
                  <option value="MO">Macao</option>
                  <option value="MK">
                    Macédoine, l'ex république yougoslave de
                  </option>
                  <option value="MG">Madagascar</option>
                  <option value="MY">Malaisie</option>
                  <option value="MW">Malawi</option>
                  <option value="MV">Maldives</option>
                  <option value="ML">Mali</option>
                  <option value="MT">Malte</option>
                  <option value="MP">Mariannes du nord, îles</option>
                  <option value="MA">Maroc</option>
                  <option value="MH">Marshall, îles</option>
                  <option value="MQ">Martinique</option>
                  <option value="MU">Maurice</option>
                  <option value="MR">Mauritanie</option>
                  <option value="YT">Mayotte</option>
                  <option value="MX">Mexique</option>
                  <option value="FM">Micronésie, états fédérés de</option>
                  <option value="MD">Moldova, république de</option>
                  <option value="MC">Monaco</option>
                  <option value="MN">Mongolie</option>
                  <option value="ME">Monténégro</option>
                  <option value="MS">Montserrat</option>
                  <option value="MZ">Mozambique</option>
                  <option value="MM">Myanmar</option>
                  <option value="NA">Namibie</option>
                  <option value="NR">Nauru</option>
                  <option value="NP">Népal</option>
                  <option value="NI">Nicaragua</option>
                  <option value="NE">Niger</option>
                  <option value="NG">Nigéria</option>
                  <option value="NU">Niué</option>
                  <option value="NF">Norfolk, île</option>
                  <option value="NO">Norvège</option>
                  <option value="NC">Nouvelle calédonie</option>
                  <option value="NZ">Nouvelle zélande</option>
                  <option value="IO">
                    Océan indien, territoire britannique de l'
                  </option>
                  <option value="OM">Oman</option>
                  <option value="UG">Ouganda</option>
                  <option value="UZ">Ouzbékistan</option>
                  <option value="PK">Pakistan</option>
                  <option value="PW">Palaos</option>
                  <option value="PS">Palestinien occupé, territoire</option>
                  <option value="PA">Panama</option>
                  <option value="PG">Papouasie nouvelle guinée</option>
                  <option value="PY">Paraguay</option>
                  <option value="NL">Pays bas</option>
                  <option value="PE">Pérou</option>
                  <option value="PH">Philippines</option>
                  <option value="PN">Pitcairn</option>
                  <option value="PL">Pologne</option>
                  <option value="PF">Polynésie française</option>
                  <option value="PR">Porto rico</option>
                  <option value="PT">Portugal</option>
                  <option value="QA">Qatar</option>
                  <option value="RE">Réunion</option>
                  <option value="RO">Roumanie</option>
                  <option value="GB">Royaume uni</option>
                  <option value="RU">Russie, fédération de</option>
                  <option value="RW">Rwanda</option>
                  <option value="EH">Sahara occidental</option>
                  <option value="BL">Saint barthélemy</option>
                  <option value="SH">
                    Sainte hélène, ascension et tristan da cunha
                  </option>
                  <option value="LC">Sainte lucie</option>
                  <option value="KN">Saint kitts et nevis</option>
                  <option value="SM">Saint marin</option>
                  <option value="MF">Saint martin(partie française)</option>
                  <option value="SX">Saint martin (partie néerlandaise)</option>
                  <option value="PM">Saint pierre et miquelon</option>
                  <option value="VA">
                    Saint siège (état de la cité du vatican)
                  </option>
                  <option value="VC">Saint vincent et les grenadines</option>
                  <option value="SB">Salomon, îles</option>
                  <option value="WS">Samoa</option>
                  <option value="AS">Samoa américaines</option>
                  <option value="ST">Sao tomé et principe</option>
                  <option value="SN">Sénégal</option>
                  <option value="RS">Serbie</option>
                  <option value="SC">Seychelles</option>
                  <option value="SL">Sierra leone</option>
                  <option value="SG">Singapour</option>
                  <option value="SK">Slovaquie</option>
                  <option value="SI">Slovénie</option>
                  <option value="SO">Somalie</option>
                  <option value="SD">Soudan</option>
                  <option value="SS">Soudan du sud</option>
                  <option value="LK">Sri lanka</option>
                  <option value="SE">Suède</option>
                  <option value="CH">Suisse</option>
                  <option value="SR">Suriname</option>
                  <option value="SJ">Svalbard et île jan mayen</option>
                  <option value="SZ">Swaziland</option>
                  <option value="SY">Syrienne, république arabe</option>
                  <option value="TJ">Tadjikistan</option>
                  <option value="TW">Taïwan, province de chine</option>
                  <option value="TZ">Tanzanie, république unie de</option>
                  <option value="TD">Tchad</option>
                  <option value="CZ">Tchèque, république</option>
                  <option value="TF">Terres australes françaises</option>
                  <option value="TH">Thaïlande</option>
                  <option value="TL">Timor leste</option>
                  <option value="TG">Togo</option>
                  <option value="TK">Tokelau</option>
                  <option value="TO">Tonga</option>
                  <option value="TT">Trinité et tobago</option>
                  <option value="TN">Tunisie</option>
                  <option value="TM">Turkménistan</option>
                  <option value="TC">Turks et caïcos, îles</option>
                  <option value="TR">Turquie</option>
                  <option value="TV">Tuvalu</option>
                  <option value="UA">Ukraine</option>
                  <option value="UY">Uruguay</option>
                  <option value="VU">Vanuatu</option>
                  <option value="VE">
                    Venezuela, république bolivarienne du
                  </option>
                  <option value="VN">Viet nam</option>
                  <option value="WF">Wallis et futuna</option>
                  <option value="YE">Yémen</option>
                  <option value="ZM">Zambie</option>
                  <option value="ZW">Zimbabwe</option>
                </select>
                <div className="input-container">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input icon"
                    placeholder="E-mail"
                    required
                  />
                  <AccountCircleIcon className="input-icon" />
                </div>
                <div className="input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handlePasswordChange}
                    className="input icon"
                    placeholder="Mot de passe"
                    required
                  />
                  {showPassword ? (
                    <VisibilityOff
                      className="input-icon"
                      onClick={handleClickShowPassword}
                    />
                  ) : (
                    <Visibility
                      className="input-icon"
                      onClick={handleClickShowPassword}
                    />
                  )}
                </div>
                {passwordRules && !pwdIsValid ? (
                  <div>
                    <p
                      style={{
                        fontSize: "0.8em",
                        color: hasUpperCase ? "green" : "red",
                      }}
                    >
                      Doit contenir au moins une majuscule
                    </p>
                    <p
                      style={{
                        fontSize: "0.8em",
                        color: hasLowerCase ? "green" : "red",
                      }}
                    >
                      Doit contenir au moins une minuscule
                    </p>
                    <p
                      style={{
                        fontSize: "0.8em",
                        color: hasNumber ? "green" : "red",
                      }}
                    >
                      Doit contenir au moins un chiffre
                    </p>
                    <p
                      style={{
                        fontSize: "0.8em",
                        color: hasSpecialChar ? "green" : "red",
                      }}
                    >
                      Doit contenir au moins un caractère spécial
                    </p>
                    <p
                      style={{
                        fontSize: "0.8em",
                        color: isLengthValid ? "green" : "red",
                      }}
                    >
                      Doit contenir au moins 10 caractères
                    </p>
                  </div>
                ) : (
                  <div>
                    <input
                      type="password"
                      name="confPassword"
                      value={confirmationPassword}
                      onChange={handleChangeConfPassword}
                      className="input icon"
                      placeholder="Confirmation"
                      required
                    />
                  </div>
                )}
              </div>
              <div className="register-footer">
                <p className="error">{error}</p>
                <button
                  className="btn register"
                  type="button"
                  onClick={handleChangeStepTwo}
                >
                  Suivant
                </button>
                <p className="bold">Etape {step}/3</p>
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <button
                aria-label="Passer à l'étape précédente"
                type="button"
                className="no-btn back_btn pointer"
                onClick={previousStep}
              >
                <ArrowBackIcon />
              </button>
              <div className="register-top">
                <ReCAPTCHA
                  sitekey={import.meta.env.VITE_RECAPTCHA_KEY}
                  onChange={(val) => handleChangeCaptcha(val)}
                />
                <div className="checkbox-container">
                  <Checkbox
                    sx={{
                      "& .MuiSvgIcon-root": {
                        fontSize: 22,
                        color: "white",
                        padding: 0,
                      },
                    }}
                    checked={privacy}
                    onChange={handleChangePrivacy}
                    required
                  />
                  <label htmlFor="privacy" id="privacy">
                    <p>J'accepte les</p>
                    <span className="underline">conditions d'utilisations</span>
                  </label>
                </div>
              </div>
              <div className="register-footer">
                <p className="error">{error}</p>
                <button className="btn register" type="submit">
                  S'inscrire
                </button>
                <p className="bold">Etape {step}/3</p>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default Register;
